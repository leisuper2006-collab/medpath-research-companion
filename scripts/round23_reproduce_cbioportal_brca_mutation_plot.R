#!/usr/bin/env Rscript

suppressPackageStartupMessages({
  library(httr2)
  library(jsonlite)
  library(dplyr)
  library(ggplot2)
})

root <- normalizePath(file.path(getwd()), winslash = "/", mustWork = TRUE)
data_dir <- file.path(root, "data", "public_reproducible_examples")
out_dir <- file.path(root, "outputs", "public_reproducible_examples")
dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

study_id <- "brca_tcga_pan_can_atlas_2018"
molecular_profile_id <- paste0(study_id, "_mutations")
sample_list_id <- paste0(study_id, "_all")
api_url <- sprintf(
  "https://www.cbioportal.org/api/molecular-profiles/%s/mutations/fetch?projection=SUMMARY",
  molecular_profile_id
)

gene_map <- tibble::tibble(
  entrezGeneId = c(7157L, 5290L, 2625L, 999L, 4214L, 5728L, 207L, 2064L, 672L, 675L),
  gene = c("TP53", "PIK3CA", "GATA3", "CDH1", "MAP3K1", "PTEN", "AKT1", "ERBB2", "BRCA1", "BRCA2")
)

raw_path <- file.path(data_dir, "brca_tcga_pan_can_atlas_2018_selected_gene_mutations_raw.json")
summary_path <- file.path(data_dir, "brca_tcga_pan_can_atlas_2018_mutation_type_summary.csv")
metadata_path <- file.path(data_dir, "brca_tcga_pan_can_atlas_2018_mutation_example_metadata.json")
svg_path <- file.path(out_dir, "brca_tcga_mutation_type_distribution.svg")
png_path <- file.path(out_dir, "brca_tcga_mutation_type_distribution.png")

fetch_mutations <- function() {
  body <- list(
    sampleListId = sample_list_id,
    entrezGeneIds = as.integer(gene_map$entrezGeneId)
  )
  req <- request(api_url) |>
    req_headers("Content-Type" = "application/json") |>
    req_body_json(body, auto_unbox = TRUE) |>
    req_timeout(60)
  resp <- req_perform(req)
  resp_body_json(resp, simplifyVector = TRUE)
}

message("Fetching public mutation summary from cBioPortal...")
mutations <- tryCatch(fetch_mutations(), error = function(e) {
  message("Fetch failed: ", conditionMessage(e))
  if (file.exists(raw_path)) {
    message("Using cached raw JSON: ", raw_path)
    fromJSON(raw_path, simplifyVector = TRUE)
  } else {
    stop("No cached raw JSON available.")
  }
})

write_json(mutations, raw_path, auto_unbox = TRUE, pretty = TRUE)

mut_df <- as_tibble(mutations) |>
  select(any_of(c("sampleId", "patientId", "entrezGeneId", "mutationType", "proteinChange", "variantType"))) |>
  mutate(entrezGeneId = as.integer(entrezGeneId)) |>
  left_join(gene_map, by = "entrezGeneId") |>
  filter(!is.na(gene), !is.na(mutationType), mutationType != "")

summary_df <- mut_df |>
  count(gene, mutationType, name = "mutation_records") |>
  group_by(gene) |>
  mutate(total_records = sum(mutation_records), fraction = mutation_records / total_records) |>
  ungroup() |>
  arrange(desc(total_records), gene, desc(mutation_records))

write.csv(summary_df, summary_path, row.names = FALSE, fileEncoding = "UTF-8")

metadata <- list(
  title = "BRCA TCGA PanCancer Atlas selected-gene mutation type distribution",
  source = "cBioPortal public REST API",
  study_id = study_id,
  molecular_profile_id = molecular_profile_id,
  sample_list_id = sample_list_id,
  source_url = sprintf("https://www.cbioportal.org/study/summary?id=%s", study_id),
  api_reference = "https://docs.cbioportal.org/web-api-and-clients/",
  genes = gene_map$gene,
  safety_boundary = "Only public API summary data are used. The figure is a teaching re-plot and must not be treated as a clinical diagnostic result.",
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

p <- ggplot(plot_df, aes(x = mutation_records, y = gene, fill = mutationType)) +
  geom_col(width = 0.72, color = "white", linewidth = 0.18) +
  geom_text(
    data = plot_df |>
      group_by(gene) |>
      summarise(total_records = sum(mutation_records), .groups = "drop"),
    aes(x = total_records, y = gene, label = total_records),
    inherit.aes = FALSE,
    hjust = -0.18,
    size = 3.2,
    color = "#334155"
  ) +
  scale_fill_brewer(palette = "Set2", name = "Mutation type") +
  scale_x_continuous(expand = expansion(mult = c(0, 0.14))) +
  labs(
    title = "BRCA TCGA PanCancer Atlas: selected-gene mutation type distribution",
    subtitle = "Public cBioPortal API teaching re-plot; counts are mutation records, not clinical conclusions",
    x = "Mutation records in selected public profile",
    y = NULL,
    caption = "Source: cBioPortal public REST API, brca_tcga_pan_can_atlas_2018. Teaching use only; not for clinical diagnosis."
  ) +
  theme_minimal(base_family = "Arial") +
  theme(
    plot.background = element_rect(fill = "white", color = NA),
    panel.grid.major.y = element_blank(),
    panel.grid.minor = element_blank(),
    plot.title = element_text(face = "bold", size = 15, color = "#102033"),
    plot.subtitle = element_text(size = 10.5, color = "#475569"),
    plot.caption = element_text(size = 8.5, color = "#64748b", hjust = 0),
    axis.text = element_text(color = "#334155"),
    axis.title.x = element_text(color = "#334155", margin = margin(t = 8)),
    legend.position = "bottom",
    legend.title = element_text(face = "bold"),
    legend.text = element_text(size = 8.6)
  )

ggsave(svg_path, p, width = 9.8, height = 6.2, units = "in")
ggsave(png_path, p, width = 9.8, height = 6.2, units = "in", dpi = 220)

message("Wrote: ", summary_path)
message("Wrote: ", svg_path)
message("Wrote: ", png_path)
