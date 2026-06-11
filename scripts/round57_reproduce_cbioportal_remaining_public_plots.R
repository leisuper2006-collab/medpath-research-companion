#!/usr/bin/env Rscript

root <- normalizePath(getwd(), winslash = "/", mustWork = TRUE)
source(file.path(root, "scripts", "cbioportal_public_visual_utils.R"), encoding = "UTF-8")

data_dir <- file.path(root, "data", "public_reproducible_examples")
out_dir <- file.path(root, "outputs", "public_reproducible_examples")
dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

public_sources <- as_tibble(fromJSON(file.path(root, "data", "public_example_sources.json"), simplifyVector = TRUE))
visuals <- fromJSON(file.path(root, "data", "public_source_visual_examples.json"), simplifyVector = FALSE)
covered_ids <- unique(unlist(lapply(visuals, function(item) {
  ids <- item$source_ids
  if (is.null(ids)) return(character(0))
  as.character(ids)
})))

targets <- public_sources |>
  filter(!id %in% covered_ids, source_platform == "cBioPortal public API") |>
  pull(id)

message("Round57 uncovered cBioPortal targets: ", length(targets))
results <- list()
skipped <- list()
for (study_id in targets) {
  message("Processing ", study_id)
  item <- tryCatch(
    build_public_mutation_plot(study_id, public_sources, data_dir, out_dir, suffix = "round57"),
    error = function(e) {
      skipped[[length(skipped) + 1]] <<- list(id = study_id, reason = conditionMessage(e))
      NULL
    }
  )
  if (!is.null(item)) results[[length(results) + 1]] <- item
}

manifest_path <- file.path(data_dir, "round57_remaining_public_visual_manifest.json")
skipped_path <- file.path(data_dir, "round57_remaining_public_visual_skipped.json")
write_json(results, manifest_path, auto_unbox = TRUE, pretty = TRUE)
write_json(skipped, skipped_path, auto_unbox = TRUE, pretty = TRUE)

message("Round57 generated: ", length(results), " visuals; skipped: ", length(skipped))
if (length(skipped)) {
  message("Skipped studies:")
  print(skipped)
}
