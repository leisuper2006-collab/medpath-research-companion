suppressPackageStartupMessages({
  library(httr2)
  library(jsonlite)
  library(dplyr)
  library(tidyr)
  library(ggplot2)
  library(stringr)
})

cbio_api <- "https://www.cbioportal.org/api"

gene_catalog <- tibble::tribble(
  ~gene, ~entrezGeneId,
  "TP53", 7157L, "KRAS", 3845L, "BRAF", 673L, "PIK3CA", 5290L,
  "APC", 324L, "SMAD4", 4089L, "EGFR", 1956L, "ALK", 238L,
  "STK11", 6794L, "KEAP1", 9817L, "PTEN", 5728L, "IDH1", 3417L,
  "IDH2", 3418L, "NPM1", 4869L, "DNMT3A", 1788L, "FLT3", 2322L,
  "TET2", 54790L, "RUNX1", 861L, "CEBPA", 1050L, "WT1", 7490L,
  "CDKN2A", 1029L, "NF1", 4763L, "TERT", 7015L, "CTNNB1", 1499L,
  "MEN1", 4221L, "PRKAR1A", 5573L, "ZNRF3", 84133L, "ATRX", 546L,
  "RB1", 5925L, "MDM2", 4193L, "CDK4", 1019L, "FBXW7", 55294L,
  "ARID1A", 8289L, "MYD88", 4615L, "CD79B", 974L, "BCL2", 596L,
  "PIM1", 5292L, "EZH2", 2146L, "VHL", 7428L, "PBRM1", 55193L,
  "SETD2", 29072L, "BAP1", 8314L, "MTOR", 2475L, "NRAS", 4893L,
  "KIT", 3815L, "RNF43", 54894L, "GNAS", 2778L, "ERBB2", 2064L,
  "ESR1", 2099L, "BRCA1", 672L, "BRCA2", 675L, "MAP3K1", 4214L,
  "GATA3", 2625L, "CDH1", 999L, "KMT2C", 58508L, "KMT2D", 8085L,
  "FGFR3", 2261L, "KDM6A", 7403L, "STAG2", 10735L, "HRAS", 3265L,
  "JAK2", 3717L, "NOTCH1", 4851L, "SF3B1", 23451L, "RET", 5979L,
  "AR", 367L, "FOXA1", 3169L, "SPOP", 8405L, "ATM", 472L,
  "FGFR2", 2263L, "FGFR1", 2260L, "KMT2A", 4297L,
  "PTCH1", 5727L, "SMO", 6608L, "SUFU", 51684L, "TSC1", 7248L,
  "TSC2", 7249L, "FAT1", 2195L, "CREBBP", 1387L, "EP300", 2033L
)

request_json <- function(path) {
  request(paste0(cbio_api, path)) |>
    req_timeout(60) |>
    req_perform() |>
    resp_body_json(simplifyVector = TRUE)
}

post_json <- function(path, body) {
  request(paste0(cbio_api, path)) |>
    req_headers("Content-Type" = "application/json") |>
    req_body_json(body, auto_unbox = TRUE) |>
    req_timeout(90) |>
    req_perform() |>
    resp_body_json(simplifyVector = TRUE)
}

pick_profile <- function(study_id) {
  profiles <- as_tibble(request_json(sprintf("/studies/%s/molecular-profiles?projection=SUMMARY", study_id)))
  if (!nrow(profiles)) return(NA_character_)
  picked <- profiles |>
    mutate(score = case_when(
      molecularAlterationType == "MUTATION_EXTENDED" ~ 4,
      str_detect(molecularProfileId, regex("mutations", ignore_case = TRUE)) ~ 3,
      str_detect(name, regex("mutation", ignore_case = TRUE)) ~ 2,
      TRUE ~ 0
    )) |>
    arrange(desc(score), molecularProfileId) |>
    slice(1)
  if (!nrow(picked) || picked$score[[1]] == 0) return(NA_character_)
  picked$molecularProfileId[[1]]
}

pick_sample_list <- function(study_id) {
  sample_lists <- as_tibble(request_json(sprintf("/studies/%s/sample-lists?projection=SUMMARY", study_id)))
  if (!nrow(sample_lists)) return(NA_character_)
  sample_lists |>
    mutate(score = case_when(
      sampleListId == paste0(study_id, "_all") ~ 4,
      str_detect(sampleListId, regex("_sequenced|sequenced", ignore_case = TRUE)) ~ 3,
      str_detect(sampleListId, regex("_all|all", ignore_case = TRUE)) ~ 2,
      TRUE ~ 0
    )) |>
    arrange(desc(score), sampleListId) |>
    slice(1) |>
    pull(sampleListId)
}

fetch_mutations <- function(study_id, data_dir, suffix) {
  molecular_profile_id <- pick_profile(study_id)
  sample_list_id <- pick_sample_list(study_id)
  if (is.na(molecular_profile_id) || is.na(sample_list_id)) {
    stop("no mutation molecular profile or sample list")
  }
  raw_path <- file.path(data_dir, sprintf("%s_%s_selected_gene_mutations_raw.json", study_id, suffix))
  body <- list(sampleListId = sample_list_id, entrezGeneIds = as.integer(gene_catalog$entrezGeneId))
  mutations <- post_json(sprintf("/molecular-profiles/%s/mutations/fetch?projection=SUMMARY", molecular_profile_id), body)
  write_json(mutations, raw_path, auto_unbox = TRUE, pretty = TRUE)
  list(
    mutations = as_tibble(mutations),
    molecular_profile_id = molecular_profile_id,
    sample_list_id = sample_list_id
  )
}

safe_file <- function(path) gsub("\\\\", "/", path)

build_public_mutation_plot <- function(study_id, public_sources, data_dir, out_dir, suffix = "round57") {
  source <- public_sources |> filter(id == study_id) |> slice(1)
  title <- ifelse(nrow(source), source$title[[1]], study_id)
  citation <- ifelse(nrow(source), source$citation[[1]], "citation pending")
  source_url <- ifelse(nrow(source), source$url[[1]], sprintf("https://www.cbioportal.org/study/summary?id=%s", study_id))
  cancer_type <- ifelse(nrow(source), source$cancer_type[[1]], "public cancer cohort")
  tier <- ifelse(nrow(source), source$tier[[1]], "public cBioPortal source")

  fetched <- fetch_mutations(study_id, data_dir, suffix)
  mut_df <- fetched$mutations
  if (!nrow(mut_df)) stop("no mutation records returned")

  summary_df <- mut_df |>
    select(any_of(c("sampleId", "patientId", "entrezGeneId", "mutationType"))) |>
    mutate(entrezGeneId = as.integer(entrezGeneId)) |>
    left_join(gene_catalog, by = "entrezGeneId") |>
    filter(!is.na(gene), !is.na(mutationType), mutationType != "") |>
    count(gene, mutationType, name = "mutation_records") |>
    group_by(gene) |>
    mutate(total_records = sum(mutation_records), fraction = mutation_records / total_records) |>
    ungroup() |>
    arrange(desc(total_records), gene, desc(mutation_records))
  if (!nrow(summary_df)) stop("empty mutation summary")

  top_genes <- summary_df |>
    distinct(gene, total_records) |>
    arrange(desc(total_records), gene) |>
    slice_head(n = 8) |>
    pull(gene)
  plot_df <- summary_df |>
    filter(gene %in% top_genes) |>
    mutate(gene = factor(gene, levels = rev(top_genes)))

  summary_path <- file.path(data_dir, sprintf("%s_%s_mutation_type_summary.csv", study_id, suffix))
  metadata_path <- file.path(data_dir, sprintf("%s_%s_mutation_example_metadata.json", study_id, suffix))
  svg_path <- file.path(out_dir, sprintf("%s_%s_mutation_type_distribution.svg", study_id, suffix))
  png_path <- file.path(out_dir, sprintf("%s_%s_mutation_type_distribution.png", study_id, suffix))
  write.csv(summary_df, summary_path, row.names = FALSE, fileEncoding = "UTF-8")

  total_records <- sum(summary_df$mutation_records)
  p <- ggplot(plot_df, aes(x = mutation_records, y = gene, fill = mutationType)) +
    geom_col(width = 0.72, color = "white", linewidth = 0.25) +
    scale_fill_manual(
      values = c(
        "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f",
        "#e5c494", "#b3b3b3", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"
      ),
      name = "Mutation type"
    ) +
    labs(
      title = paste0(title, "\nselected-gene mutation records, teaching re-plot"),
      subtitle = paste0("Public cBioPortal API; ", length(top_genes), " genes shown; ", total_records, " mutation records. Not a clinical conclusion."),
      x = "Mutation records in selected public cohort",
      y = NULL,
      caption = "Teaching re-plot from public API records. For education and research training only; not for clinical diagnosis."
    ) +
    theme_minimal(base_size = 13) +
    theme(
      plot.background = element_rect(fill = "white", color = NA),
      panel.grid.major.y = element_blank(),
      panel.grid.minor = element_blank(),
      plot.title = element_text(face = "bold", size = 14, color = "#17242b"),
      plot.subtitle = element_text(size = 10.5, color = "#53636d"),
      plot.caption = element_text(size = 9, color = "#6d767c"),
      axis.text = element_text(color = "#23323a"),
      legend.position = "bottom",
      legend.title = element_text(size = 10),
      legend.text = element_text(size = 9)
    )

  ggsave(svg_path, p, width = 10.8, height = 6.6, bg = "white")
  ggsave(png_path, p, width = 10.8, height = 6.6, dpi = 200, bg = "white")

  metadata <- list(
    id = paste0(study_id, "_", suffix, "_mutation_type_distribution"),
    source_ids = list(study_id),
    source_study_id = study_id,
    title = paste0(title, "：常见基因突变类型分布教学重绘图"),
    subtitle = "公开 cBioPortal API 数据教学化重绘，不复制论文原图",
    source_platform = "cBioPortal public API",
    public_source_title = title,
    public_source_url = source_url,
    citation = citation,
    tier = tier,
    disease_area = cancer_type,
    figure_question = paste0("在 ", title, " 中，常见教学基因的突变记录和突变类型如何被整理成新手可读的图？"),
    teaching_use = list(
      "训练新手理解公开队列、基因、突变类型和图注边界之间的关系。",
      "演示如何从公开 API 记录生成可复核的教学图，而不是复制论文原图。",
      "作为方法页、图谱页和文章流程页中的公开来源示例。"
    ),
    recommended_methods = list("突变谱摘要", "公开队列入门", "图注审查", "数据来源核验"),
    recommended_plots = list("堆叠条形图", "突变类型分布图", "队列证据卡"),
    script = paste0("scripts/round57_reproduce_cbioportal_remaining_public_plots.R"),
    source_data = safe_file(file.path("data", "public_reproducible_examples", basename(summary_path))),
    metadata = safe_file(file.path("data", "public_reproducible_examples", basename(metadata_path))),
    visual_url = safe_file(file.path("outputs", "public_reproducible_examples", basename(svg_path))),
    png_url = safe_file(file.path("outputs", "public_reproducible_examples", basename(png_path))),
    reuse_boundary = "仅作为公开数据教学重绘图和来源学习示例；正式科研写作需回到 cBioPortal、原论文和许可条款核验。",
    safety_boundary = "仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。"
  )
  write_json(metadata, metadata_path, auto_unbox = TRUE, pretty = TRUE)
  metadata
}
