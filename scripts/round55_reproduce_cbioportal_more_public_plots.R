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
  "TERT", 7015L,
  "CTNNB1", 1499L,
  "MEN1", 4221L,
  "PRKAR1A", 5573L,
  "ZNRF3", 84133L,
  "ATRX", 546L,
  "RB1", 5925L,
  "MDM2", 4193L,
  "CDK4", 1019L,
  "FBXW7", 55294L,
  "ARID1A", 8289L,
  "MYD88", 4615L,
  "CD79B", 974L,
  "BCL2", 596L,
  "PIM1", 5292L,
  "EZH2", 2146L,
  "VHL", 7428L,
  "PBRM1", 55193L,
  "SETD2", 29072L,
  "BAP1", 8314L,
  "MTOR", 2475L,
  "NRAS", 4893L,
  "KIT", 3815L,
  "RNF43", 54894L,
  "GNAS", 2778L
)

studies <- list(
  list(
    id = "acc_tcga_pan_can_atlas_2018",
    title = "ACC TCGA PanCancer Atlas",
    zh_title = "肾上腺皮质癌TCGA PanCancer Atlas",
    source_ids = c("acc_tcga_pan_can_atlas_2018", "acc_tcga", "acc_tcga_gdc"),
    genes = c("TP53", "CTNNB1", "MEN1", "PRKAR1A", "ZNRF3"),
    question = "公开肾上腺皮质癌队列中，教学常用驱动基因的突变记录与类型构成如何分布？",
    teaching_focus = "用于训练科研新手把罕见肿瘤公开队列转化为可复核突变摘要图，并保留样本量和临床解释边界。"
  ),
  list(
    id = "sarc_tcga_pub",
    title = "Sarcoma TCGA Cell 2017",
    zh_title = "软组织肉瘤TCGA Cell 2017",
    source_ids = c("sarc_tcga_pub", "sarcoma_mskcc_2022"),
    genes = c("TP53", "ATRX", "RB1", "MDM2", "CDK4", "NF1"),
    question = "公开软组织肉瘤队列中，不同机制相关基因的突变记录如何组织为教学图？",
    teaching_focus = "用于连接病理亚型、分子机制和公开队列图表训练，提醒不要把描述性统计写成诊断结论。"
  ),
  list(
    id = "cesc_tcga_pan_can_atlas_2018",
    title = "CESC TCGA PanCancer Atlas",
    zh_title = "宫颈鳞癌TCGA PanCancer Atlas",
    source_ids = c("cesc_tcga_pan_can_atlas_2018"),
    genes = c("PIK3CA", "TP53", "PTEN", "FBXW7", "ARID1A", "KRAS"),
    question = "公开宫颈癌队列中，常见通路基因的突变类型构成是否适合用于课堂图表训练？",
    teaching_focus = "用于展示从通路相关基因到突变类型分布图的公开数据整理过程。"
  ),
  list(
    id = "dlbc_tcga_pan_can_atlas_2018",
    title = "DLBC TCGA PanCancer Atlas",
    zh_title = "弥漫大B细胞淋巴瘤TCGA PanCancer Atlas",
    source_ids = c("dlbc_tcga_pan_can_atlas_2018"),
    genes = c("MYD88", "CD79B", "BCL2", "PIM1", "TP53", "EZH2"),
    question = "公开弥漫大B细胞淋巴瘤队列中，免疫/信号通路相关基因的突变记录如何分布？",
    teaching_focus = "用于训练血液肿瘤分子病理教学中的公共数据检索、图注边界和复核表达。"
  ),
  list(
    id = "coadread_tcga_pub",
    title = "COADREAD TCGA Nature 2012",
    zh_title = "结直肠腺癌TCGA Nature 2012",
    source_ids = c("coadread_tcga_pub", "coadread_genentech", "coadread_cass_2020"),
    genes = c("APC", "TP53", "KRAS", "PIK3CA", "SMAD4", "BRAF"),
    question = "公开结直肠癌队列中，经典通路基因的突变记录与类型构成如何分布？",
    teaching_focus = "用于训练从经典通路知识到公开队列图谱的转译，强调mutation records不等于临床结论。"
  ),
  list(
    id = "ccrcc_dfci_2019",
    title = "ccRCC DFCI Science 2019",
    zh_title = "透明细胞肾癌DFCI Science 2019",
    source_ids = c("ccrcc_dfci_2019"),
    genes = c("VHL", "PBRM1", "SETD2", "BAP1", "MTOR", "TP53"),
    question = "公开透明细胞肾癌队列中，经典分子病理基因的突变记录如何用于教学解读？",
    teaching_focus = "用于训练Science公开来源页面的图表复现、来源核验和病理机制解释边界。"
  ),
  list(
    id = "luad_mskcc_2015",
    title = "LUAD MSK Science 2015",
    zh_title = "肺腺癌MSK Science 2015",
    source_ids = c("luad_mskcc_2015", "bm_nsclc_mskcc_2023", "nsclc_mskcc_2015"),
    genes = c("EGFR", "KRAS", "ALK", "BRAF", "TP53", "STK11", "KEAP1"),
    question = "公开肺腺癌队列中，靶向治疗和机制教学常见基因的突变类型如何分布？",
    teaching_focus = "用于训练精准医学教学中的突变摘要图，明确公开图表不构成个体治疗建议。"
  ),
  list(
    id = "skcm_dfci_2015",
    title = "SKCM DFCI Science 2015",
    zh_title = "转移性黑色素瘤DFCI Science 2015",
    source_ids = c("skcm_dfci_2015"),
    genes = c("BRAF", "NRAS", "NF1", "TP53", "KIT", "PTEN"),
    question = "公开转移性黑色素瘤队列中，驱动基因突变记录如何用于科研图谱入门？",
    teaching_focus = "用于训练靶向治疗背景下的公开队列图表阅读，但不生成真实治疗建议。"
  ),
  list(
    id = "paad_utsw_2015",
    title = "PAAD UTSW Nat Commun 2015",
    zh_title = "胰腺癌UTSW Nature Communications 2015",
    source_ids = c("paad_utsw_2015", "paac_jhu_2014"),
    genes = c("KRAS", "TP53", "CDKN2A", "SMAD4", "RNF43", "GNAS"),
    question = "公开胰腺癌队列中，经典驱动基因突变记录如何整理为教学重绘图？",
    teaching_focus = "用于连接病理机制、公开队列和文章图表计划，避免把教学重绘图写成实测新结果。"
  ),
  list(
    id = "ccle_broad_2019",
    title = "CCLE Broad 2019",
    zh_title = "癌症细胞系百科CCLE Broad 2019",
    source_ids = c("ccle_broad_2019", "cellline_ccle_broad", "ccle_genentech_2014"),
    genes = c("TP53", "KRAS", "BRAF", "PIK3CA", "EGFR", "PTEN", "ALK"),
    question = "公开癌症细胞系队列中，常用教学基因的突变记录如何用于方法入门？",
    teaching_focus = "用于训练细胞系资源与公开数据库图谱的区别，不把细胞系摘要图写成患者队列结论。"
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

fetch_study_mutations <- function(study) {
  molecular_profile_id <- pick_profile(study$id)
  sample_list_id <- pick_sample_list(study$id)
  if (is.na(molecular_profile_id) || is.na(sample_list_id)) {
    stop("no mutation molecular profile or sample list")
  }
  genes <- gene_catalog |> filter(gene %in% study$genes)
  if (!nrow(genes)) stop("no valid genes in catalog")
  raw_path <- file.path(data_dir, sprintf("%s_selected_gene_mutations_raw.json", study$id))
  body <- list(sampleListId = sample_list_id, entrezGeneIds = as.integer(genes$entrezGeneId))
  mutations <- post_json(sprintf("/molecular-profiles/%s/mutations/fetch?projection=SUMMARY", molecular_profile_id), body)
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
  if (!nrow(mut_df)) stop("no mutation records returned")

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
  if (!nrow(summary_df)) stop("empty mutation summary")

  safe_id <- study$id
  summary_path <- file.path(data_dir, sprintf("%s_mutation_type_summary.csv", safe_id))
  metadata_path <- file.path(data_dir, sprintf("%s_mutation_example_metadata.json", safe_id))
  svg_path <- file.path(out_dir, sprintf("%s_mutation_type_distribution.svg", safe_id))
  png_path <- file.path(out_dir, sprintf("%s_mutation_type_distribution.png", safe_id))
  write.csv(summary_df, summary_path, row.names = FALSE, fileEncoding = "UTF-8")

  metadata <- list(
    title = paste0(study$title, ": selected-gene mutation type distribution"),
    zh_title = study$zh_title,
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
    mutate(gene = factor(gene, levels = gene_order), mutationType = factor(mutationType))

  palette <- c(
    "#2563EB", "#0F766E", "#D97706", "#7C3AED", "#DC2626",
    "#65A30D", "#0891B2", "#9333EA", "#64748B", "#BE123C"
  )

  p <- ggplot(plot_df, aes(x = mutation_records, y = gene, fill = mutationType)) +
    geom_col(width = 0.7, color = "white", linewidth = 0.18) +
    geom_text(
      data = plot_df |> group_by(gene) |> summarise(total_records = sum(mutation_records), .groups = "drop"),
      aes(x = total_records, y = gene, label = total_records),
      inherit.aes = FALSE,
      hjust = -0.16,
      size = 3.15,
      color = "#243447"
    ) +
    scale_fill_manual(values = palette, name = "Mutation type") +
    scale_x_continuous(expand = expansion(mult = c(0, 0.17))) +
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
      legend.text = element_text(size = 8.1)
    )

  ggsave(svg_path, p, width = 9.8, height = 6.0, units = "in")
  ggsave(png_path, p, width = 9.8, height = 6.0, units = "in", dpi = 220)

  list(
    id = paste0(study$id, "_mutation_type_distribution"),
    source_ids = study$source_ids,
    title = paste0(study$zh_title, "：常见基因突变类型分布教学重绘图"),
    subtitle = "cBioPortal public REST API + R/ggplot2 reproducible teaching re-plot",
    visual_url = sprintf("/outputs/public_reproducible_examples/%s_mutation_type_distribution.svg", safe_id),
    png_url = sprintf("/outputs/public_reproducible_examples/%s_mutation_type_distribution.png", safe_id),
    source_data = sprintf("data/public_reproducible_examples/%s_mutation_type_summary.csv", safe_id),
    script = "scripts/round55_reproduce_cbioportal_more_public_plots.R",
    source_platform = "cBioPortal public REST API",
    study_id = study$id,
    citation = "cBioPortal public API metadata; formal citation and original publication must be verified before manuscript use",
    figure_question = study$question,
    teaching_use = c(
      study$teaching_focus,
      "帮助科研新手把公共API结果转成tidy表格和可复核图注。",
      "提醒读者区分mutation records、sample counts、队列描述和临床结论。",
      "用于连接方法选择、图谱解释、文章图表计划和教师复核清单。"
    ),
    recommended_methods = c(
      "公开癌症基因组队列描述",
      "突变频谱/突变景观教学分析",
      "R/ggplot2可复现实训",
      "图注边界和来源核验训练"
    ),
    recommended_plots = c("堆叠条形图", "Oncoplot/突变瀑布图", "基因-突变类型热图", "队列摘要图"),
    reuse_boundary = "本图为公开API教学重绘示例，不复制论文原图，不下载受控数据，不代表真实临床结论；正式研究需核对cBioPortal和原论文许可。",
    safety_boundary = "仅用于教学与科研训练，不替代临床诊断，不用于真实患者处置。"
  )
}

results <- list()
skipped <- list()
for (study in studies) {
  message("Building public replot: ", study$id)
  item <- tryCatch(
    build_plot(study),
    error = function(e) {
      message("Skipped ", study$id, ": ", conditionMessage(e))
      skipped[[length(skipped) + 1]] <<- list(id = study$id, title = study$title, reason = conditionMessage(e))
      NULL
    }
  )
  if (!is.null(item)) results[[length(results) + 1]] <- item
}

manifest_path <- file.path(data_dir, "round55_more_public_visual_manifest.json")
skipped_path <- file.path(data_dir, "round55_more_public_visual_skipped.json")
write_json(results, manifest_path, auto_unbox = TRUE, pretty = TRUE)
write_json(skipped, skipped_path, auto_unbox = TRUE, pretty = TRUE)

message("Generated visuals: ", length(results))
message("Skipped studies: ", length(skipped))
message("Manifest: ", manifest_path)
