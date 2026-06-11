#!/usr/bin/env Rscript

suppressPackageStartupMessages({
  library(httr2)
  library(jsonlite)
  library(dplyr)
  library(tidyr)
  library(ggplot2)
  library(stringr)
  library(purrr)
})

root <- normalizePath(file.path(getwd()), winslash = "/", mustWork = TRUE)
data_dir <- file.path(root, "data", "public_reproducible_examples")
out_dir <- file.path(root, "outputs", "public_reproducible_examples")
dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

cbio_api <- "https://www.cbioportal.org/api"

gene_catalog <- tibble::tribble(
  ~gene, ~entrezGeneId,
  "TP53", 7157L,
  "KRAS", 3845L,
  "BRAF", 673L,
  "PIK3CA", 5290L,
  "APC", 324L,
  "SMAD4", 4089L,
  "EGFR", 1956L,
  "ALK", 238L,
  "STK11", 6794L,
  "KEAP1", 9817L,
  "PTEN", 5728L,
  "IDH1", 3417L,
  "NPM1", 4869L,
  "DNMT3A", 1788L,
  "FLT3", 2322L,
  "TET2", 54790L,
  "CDKN2A", 1029L,
  "NF1", 4763L,
  "TERT", 7015L
)

studies <- list(
  list(
    id = "laml_tcga_pan_can_atlas_2018",
    title = "AML TCGA PanCancer Atlas",
    source_ids = c("laml_tcga_pan_can_atlas_2018", "laml_tcga_pub", "laml_tcga"),
    genes = c("NPM1", "FLT3", "DNMT3A", "IDH1", "TET2", "TP53"),
    question = "公开急性髓系白血病队列中，教学常用突变基因的突变记录与突变类型如何分布？",
    teaching_focus = "帮助新手把血液肿瘤突变基因表转化为队列描述图，并区分教学总结与临床分型。"
  ),
  list(
    id = "blca_tcga_pan_can_atlas_2018",
    title = "BLCA TCGA PanCancer Atlas",
    source_ids = c("blca_tcga_pan_can_atlas_2018", "blca_tcga_pub_2017", "blca_tcga_pub"),
    genes = c("TP53", "KMT2D", "KDM6A", "PIK3CA", "RB1", "FGFR3", "ERBB2"),
    question = "公开膀胱癌队列中，常见驱动基因的突变类型构成是否呈现不同教学重点？",
    teaching_focus = "用于训练学生阅读突变景观摘要、图注边界和公开数据复现流程。"
  ),
  list(
    id = "hnsc_tcga_pan_can_atlas_2018",
    title = "HNSC TCGA PanCancer Atlas",
    source_ids = c("hnsc_tcga_pan_can_atlas_2018", "hnsc_broad", "hnsc_jhu"),
    genes = c("TP53", "CDKN2A", "PIK3CA", "NOTCH1", "FAT1", "CASP8"),
    question = "公开头颈鳞癌队列中，形态学教学常关联基因的突变记录如何组织为可复核图形？",
    teaching_focus = "用于连接病理形态、分子机制导学和公开队列图表训练。"
  ),
  list(
    id = "lgg_tcga_pan_can_atlas_2018",
    title = "LGG TCGA PanCancer Atlas",
    source_ids = c("lgg_tcga_pan_can_atlas_2018", "lgg_ucsf_2014"),
    genes = c("IDH1", "TP53", "ATRX", "CIC", "FUBP1", "PIK3CA"),
    question = "公开低级别胶质瘤队列中，分子病理教学相关基因的突变类型如何分布？",
    teaching_focus = "用于展示分子病理课程中从基因事件到图表证据的训练路径。"
  )
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
    req_timeout(60) |>
    req_perform() |>
    resp_body_json(simplifyVector = TRUE)
}

pick_profile <- function(study_id) {
  profiles <- as_tibble(request_json(sprintf("/studies/%s/molecular-profiles?projection=SUMMARY", study_id)))
  profiles |>
    mutate(score = case_when(
      molecularAlterationType == "MUTATION_EXTENDED" ~ 3,
      str_detect(molecularProfileId, "mutations") ~ 2,
      TRUE ~ 0
    )) |>
    arrange(desc(score), molecularProfileId) |>
    slice(1) |>
    pull(molecularProfileId)
}

pick_sample_list <- function(study_id) {
  sample_lists <- as_tibble(request_json(sprintf("/studies/%s/sample-lists?projection=SUMMARY", study_id)))
  sample_lists |>
    mutate(score = case_when(
      sampleListId == paste0(study_id, "_all") ~ 4,
      str_detect(sampleListId, "_sequenced") ~ 3,
      str_detect(sampleListId, "_all") ~ 2,
      TRUE ~ 0
    )) |>
    arrange(desc(score), sampleListId) |>
    slice(1) |>
    pull(sampleListId)
}

fetch_study_mutations <- function(study) {
  molecular_profile_id <- pick_profile(study$id)
  sample_list_id <- pick_sample_list(study$id)
  genes <- gene_catalog |> filter(gene %in% study$genes)
  raw_path <- file.path(data_dir, sprintf("%s_selected_gene_mutations_raw.json", study$id))
  body <- list(sampleListId = sample_list_id, entrezGeneIds = as.integer(genes$entrezGeneId))
  mutations <- tryCatch(
    post_json(sprintf("/molecular-profiles/%s/mutations/fetch?projection=SUMMARY", molecular_profile_id), body),
    error = function(e) {
      message("Fetch failed for ", study$id, ": ", conditionMessage(e))
      if (file.exists(raw_path)) {
        fromJSON(raw_path, simplifyVector = TRUE)
      } else {
        tibble()
      }
    }
  )
  write_json(mutations, raw_path, auto_unbox = TRUE, pretty = TRUE)
  list(
    mutations = as_tibble(mutations),
    molecular_profile_id = molecular_profile_id,
    sample_list_id = sample_list_id,
    genes = genes
  )
}

build_plot <- function(study) {
  fetched <- fetch_study_mutations(study)
  mut_df <- fetched$mutations
  if (!nrow(mut_df)) {
    warning("No mutation records for ", study$id)
    return(NULL)
  }

  summary_df <- mut_df |>
    select(any_of(c("sampleId", "patientId", "entrezGeneId", "mutationType", "proteinChange", "variantType"))) |>
    mutate(entrezGeneId = as.integer(entrezGeneId)) |>
    left_join(fetched$genes, by = "entrezGeneId") |>
    filter(!is.na(gene), !is.na(mutationType), mutationType != "") |>
    count(gene, mutationType, name = "mutation_records") |>
    group_by(gene) |>
    mutate(total_records = sum(mutation_records), fraction = mutation_records / total_records) |>
    ungroup() |>
    arrange(desc(total_records), gene, desc(mutation_records))

  if (!nrow(summary_df)) {
    warning("Empty summary for ", study$id)
    return(NULL)
  }

  safe_id <- study$id
  summary_path <- file.path(data_dir, sprintf("%s_mutation_type_summary.csv", safe_id))
  metadata_path <- file.path(data_dir, sprintf("%s_mutation_example_metadata.json", safe_id))
  svg_path <- file.path(out_dir, sprintf("%s_mutation_type_distribution.svg", safe_id))
  png_path <- file.path(out_dir, sprintf("%s_mutation_type_distribution.png", safe_id))

  write.csv(summary_df, summary_path, row.names = FALSE, fileEncoding = "UTF-8")

  metadata <- list(
    title = paste0(study$title, ": selected-gene mutation type distribution"),
    source = "cBioPortal public REST API",
    study_id = study$id,
    molecular_profile_id = fetched$molecular_profile_id,
    sample_list_id = fetched$sample_list_id,
    source_url = sprintf("https://www.cbioportal.org/study/summary?id=%s", study$id),
    genes = fetched$genes$gene,
    safety_boundary = "Public API summary data teaching re-plot only; not a clinical diagnostic result.",
    generated_at = format(Sys.time(), "%Y-%m-%d %H:%M:%S %Z")
  )
  write_json(metadata, metadata_path, auto_unbox = TRUE, pretty = TRUE)

  gene_order <- summary_df |>
    distinct(gene, total_records) |>
    arrange(total_records) |>
    pull(gene)

  plot_df <- summary_df |>
    mutate(
      gene = factor(gene, levels = gene_order),
      mutationType = factor(mutationType)
    )

  palette <- c(
    "#3B82F6", "#14B8A6", "#F97316", "#8B5CF6", "#EF4444",
    "#84CC16", "#06B6D4", "#A855F7", "#64748B"
  )

  p <- ggplot(plot_df, aes(x = mutation_records, y = gene, fill = mutationType)) +
    geom_col(width = 0.7, color = "white", linewidth = 0.18) +
    geom_text(
      data = plot_df |>
        group_by(gene) |>
        summarise(total_records = sum(mutation_records), .groups = "drop"),
      aes(x = total_records, y = gene, label = total_records),
      inherit.aes = FALSE,
      hjust = -0.18,
      size = 3.1,
      color = "#243447"
    ) +
    scale_fill_manual(values = palette, name = "Mutation type") +
    scale_x_continuous(expand = expansion(mult = c(0, 0.16))) +
    labs(
      title = paste0(study$title, ": selected-gene mutation type distribution"),
      subtitle = "cBioPortal public API teaching re-plot; counts are mutation records, not clinical conclusions",
      x = "Mutation records in selected public profile",
      y = NULL,
      caption = paste0("Source: cBioPortal public REST API, ", study$id, ". Teaching use only; not for clinical diagnosis.")
    ) +
    theme_minimal(base_family = "Arial") +
    theme(
      plot.background = element_rect(fill = "white", color = NA),
      panel.grid.major.y = element_blank(),
      panel.grid.minor = element_blank(),
      panel.grid.major.x = element_line(color = "#E2E8F0", linewidth = 0.35),
      plot.title = element_text(face = "bold", size = 14.5, color = "#102033"),
      plot.subtitle = element_text(size = 10.2, color = "#475569"),
      plot.caption = element_text(size = 8.2, color = "#64748B", hjust = 0),
      axis.text = element_text(color = "#334155"),
      axis.title.x = element_text(color = "#334155", margin = margin(t = 8)),
      legend.position = "bottom",
      legend.title = element_text(face = "bold"),
      legend.text = element_text(size = 8.2)
    )

  ggsave(svg_path, p, width = 9.8, height = 6.0, units = "in")
  ggsave(png_path, p, width = 9.8, height = 6.0, units = "in", dpi = 220)

  list(
    id = paste0(study$id, "_mutation_type_distribution"),
    source_ids = study$source_ids,
    title = paste0(study$title, "：常见基因突变类型分布教学重绘图"),
    subtitle = "cBioPortal public REST API + R/ggplot2 reproducible teaching re-plot",
    visual_url = sprintf("/outputs/public_reproducible_examples/%s_mutation_type_distribution.svg", safe_id),
    png_url = sprintf("/outputs/public_reproducible_examples/%s_mutation_type_distribution.png", safe_id),
    source_data = sprintf("data/public_reproducible_examples/%s_mutation_type_summary.csv", safe_id),
    script = "scripts/round39_reproduce_cbioportal_multistudy_plots.R",
    source_platform = "cBioPortal public REST API",
    study_id = study$id,
    citation = "cBioPortal public API metadata; formal citation and original publication must be verified before manuscript use",
    figure_question = study$question,
    teaching_use = list(
      study$teaching_focus,
      "训练科研新手把公共API结果转成tidy表格和可复核图注。",
      "提醒读者区分mutation records、sample counts、队列描述和临床结论。",
      "用于连接方法选择、图谱解释、文章图表计划和教师复核清单。"
    ),
    recommended_methods = list(
      "公开癌症基因组队列描述",
      "突变频谱/突变景观教学分析",
      "R/ggplot2可复现实训",
      "图注边界和来源核验训练"
    ),
    recommended_plots = list(
      "堆叠条形图",
      "Oncoplot/突变瀑布图",
      "基因-突变类型热图",
      "队列摘要图"
    ),
    reuse_boundary = "本图为公开API教学重绘示例，不复制论文原图，不下载受控数据，不代表真实临床结论；正式研究需核对cBioPortal、TCGA/GDC和原论文许可。",
    safety_boundary = "仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。"
  )
}

manifest_new <- compact(map(studies, build_plot))
manifest_path <- file.path(data_dir, "round39_public_visual_manifest.json")
write_json(manifest_new, manifest_path, auto_unbox = TRUE, pretty = TRUE)

message("Wrote manifest: ", manifest_path)
message("Generated figures: ", length(manifest_new))
