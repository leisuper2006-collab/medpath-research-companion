#!/usr/bin/env Rscript

# Round 11 demo plot generator.
# All data below are synthetic teaching examples, not patient data.

required_packages <- c("ggplot2")
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]

if (length(missing_packages) > 0) {
  message("Cannot generate demo SVGs because these R packages are missing: ",
          paste(missing_packages, collapse = ", "))
  message("Install them, then rerun: Rscript scripts/generate_round11_demo_plots.R")
  quit(status = 0)
}

library(ggplot2)

set.seed(20260610)

`%||%` <- function(x, y) {
  if (is.null(x) || length(x) == 0 || is.na(x)) y else x
}

args_file <- sub("^--file=", "", commandArgs(FALSE)[grep("^--file=", commandArgs(FALSE))][1] %||% "scripts/generate_round11_demo_plots.R")
repo_root <- normalizePath(file.path(dirname(args_file), ".."), mustWork = FALSE)
if (!dir.exists(file.path(repo_root, "data"))) {
  repo_root <- getwd()
}
out_dir <- file.path(repo_root, "outputs", "round11_plots")
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

save_svg <- function(plot, filename, width = 7, height = 5) {
  path <- file.path(out_dir, filename)
  grDevices::svg(path, width = width, height = height, onefile = TRUE)
  print(plot)
  grDevices::dev.off()
  message("Wrote ", path)
}

theme_demo <- function() {
  theme_minimal(base_size = 12) +
    theme(
      panel.grid.minor = element_blank(),
      plot.title = element_text(face = "bold"),
      legend.position = "right"
    )
}

# 1. Volcano plot
n_genes <- 900
volcano <- data.frame(
  gene = paste0("GENE", seq_len(n_genes)),
  log2_fc = rnorm(n_genes, 0, 1.05),
  padj = pmin(runif(n_genes)^2, 1)
)
volcano$status <- ifelse(volcano$padj < 0.05 & volcano$log2_fc > 1, "Up",
                         ifelse(volcano$padj < 0.05 & volcano$log2_fc < -1, "Down", "Not significant"))
p_volcano <- ggplot(volcano, aes(log2_fc, -log10(padj), color = status)) +
  geom_point(alpha = 0.65, size = 1.4) +
  geom_vline(xintercept = c(-1, 1), linetype = "dashed", linewidth = 0.3) +
  geom_hline(yintercept = -log10(0.05), linetype = "dashed", linewidth = 0.3) +
  scale_color_manual(values = c("Down" = "#3B82F6", "Not significant" = "#9CA3AF", "Up" = "#DC2626")) +
  labs(title = "Synthetic volcano plot", x = "log2 fold change", y = "-log10 adjusted p-value", color = NULL) +
  theme_demo()
save_svg(p_volcano, "01_volcano_plot.svg")

# 2. Heatmap with synthetic expression modules
genes <- paste0("ModuleGene", seq_len(24))
samples <- paste0("S", sprintf("%02d", seq_len(18)))
groups <- rep(c("Control", "Treated", "Recovery"), each = 6)
heatmap_data <- expand.grid(gene = genes, sample = samples, KEEP.OUT.ATTRS = FALSE)
heatmap_data$group <- groups[match(heatmap_data$sample, samples)]
module_shift <- ifelse(heatmap_data$gene %in% genes[1:8] & heatmap_data$group == "Treated", 1.5,
                       ifelse(heatmap_data$gene %in% genes[9:16] & heatmap_data$group == "Recovery", -1.1, 0))
heatmap_data$z_score <- rnorm(nrow(heatmap_data), module_shift, 0.65)
p_heatmap <- ggplot(heatmap_data, aes(sample, gene, fill = z_score)) +
  geom_tile(color = "white", linewidth = 0.15) +
  scale_fill_gradient2(low = "#2563EB", mid = "white", high = "#DC2626", midpoint = 0) +
  labs(title = "Synthetic expression heatmap", x = "Sample", y = "Feature", fill = "z-score") +
  theme_demo() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
save_svg(p_heatmap, "02_heatmap.svg", width = 8, height = 6)

# 3. Forest plot
forest <- data.frame(
  study = paste("Study", LETTERS[1:9]),
  estimate = c(0.82, 1.14, 0.91, 1.36, 0.74, 1.05, 0.88, 1.22, 0.97),
  se = c(0.10, 0.18, 0.14, 0.20, 0.16, 0.12, 0.21, 0.17, 0.13)
)
forest$ci_low <- exp(log(forest$estimate) - 1.96 * forest$se)
forest$ci_high <- exp(log(forest$estimate) + 1.96 * forest$se)
forest$study <- factor(forest$study, levels = rev(forest$study))
p_forest <- ggplot(forest, aes(estimate, study)) +
  geom_vline(xintercept = 1, linetype = "dashed", color = "#6B7280") +
  geom_errorbarh(aes(xmin = ci_low, xmax = ci_high), height = 0.2, color = "#374151") +
  geom_point(size = 2.4, color = "#0F766E") +
  scale_x_log10() +
  labs(title = "Synthetic forest plot", x = "Effect estimate (log scale)", y = NULL) +
  theme_demo()
save_svg(p_forest, "03_forest_plot.svg")

# 4. UMAP-like embedding
centers <- data.frame(cluster = c("A", "B", "C", "D"), cx = c(-2, 0.8, 2.4, -0.8), cy = c(0.5, 1.8, -0.3, -1.7))
umap <- do.call(rbind, lapply(seq_len(nrow(centers)), function(i) {
  data.frame(
    cell_id = paste0(centers$cluster[i], "_", seq_len(120)),
    cluster = centers$cluster[i],
    UMAP_1 = rnorm(120, centers$cx[i], 0.45),
    UMAP_2 = rnorm(120, centers$cy[i], 0.45)
  )
}))
p_umap <- ggplot(umap, aes(UMAP_1, UMAP_2, color = cluster)) +
  geom_point(alpha = 0.75, size = 1.3) +
  coord_equal() +
  labs(title = "Synthetic UMAP schematic", color = "Cluster") +
  theme_demo()
save_svg(p_umap, "04_umap_schematic.svg")

# 5. Alluvial/Sankey alternative using synthetic staged counts
flows <- data.frame(
  from = c("Raw reads", "Raw reads", "QC pass", "QC pass", "Annotated", "Annotated"),
  to = c("QC pass", "QC fail", "Annotated", "Unassigned", "Report-ready", "Review-needed"),
  stage = c(1, 1, 2, 2, 3, 3),
  value = c(860, 140, 720, 140, 620, 100)
)
flows$from_y <- ave(flows$value, flows$stage, FUN = function(x) cumsum(x) - x / 2)
flows$to_y <- flows$from_y + rnorm(nrow(flows), 0, 35)
p_flow <- ggplot(flows) +
  geom_curve(aes(x = stage, y = from_y, xend = stage + 0.85, yend = to_y, linewidth = value, color = to),
             curvature = 0.18, alpha = 0.55) +
  geom_text(aes(stage, from_y, label = from), hjust = 1.05, size = 3) +
  geom_text(aes(stage + 0.9, to_y, label = to), hjust = -0.05, size = 3) +
  scale_linewidth(range = c(1.2, 8), guide = "none") +
  coord_cartesian(clip = "off") +
  labs(title = "Synthetic alluvial-style flow", x = "Pipeline stage", y = "Synthetic count position", color = "Target") +
  theme_demo() +
  theme(axis.text.y = element_blank(), panel.grid.major.y = element_blank())
save_svg(p_flow, "05_alluvial_alternative.svg", width = 8, height = 5)

# 6. Kaplan-Meier schematic, generated without survival package dependency
km_steps <- function(group, hazard, censor_shift = 0) {
  event_times <- sort(rexp(70, rate = hazard))
  event_times <- pmin(event_times, 24)
  event <- event_times < 24
  tab <- aggregate(event ~ event_times, data = data.frame(event_times, event), FUN = sum)
  at_risk <- length(event_times) - c(0, cumsum(tab$event[-length(tab$event)]))
  surv <- cumprod(1 - tab$event / pmax(at_risk, 1))
  data.frame(group = group, time = c(0, tab$event_times + censor_shift), survival = c(1, surv))
}
km <- rbind(km_steps("Low synthetic risk", 0.045), km_steps("High synthetic risk", 0.085))
p_km <- ggplot(km, aes(time, survival, color = group)) +
  geom_step(linewidth = 0.9) +
  scale_y_continuous(limits = c(0, 1), labels = function(x) paste0(round(x * 100), "%")) +
  labs(title = "Synthetic Kaplan-Meier schematic", x = "Follow-up time (months)", y = "Survival probability", color = NULL) +
  theme_demo()
save_svg(p_km, "06_kaplan_meier_schematic.svg")

# 7. ROC curve
roc <- data.frame(
  fpr = seq(0, 1, length.out = 120)
)
roc$tpr <- pmin(1, sqrt(roc$fpr) + rnorm(nrow(roc), 0, 0.015))
roc$tpr <- cummax(pmax(roc$tpr, 0))
p_roc <- ggplot(roc, aes(fpr, tpr)) +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", color = "#9CA3AF") +
  geom_line(color = "#0F766E", linewidth = 1.1) +
  coord_equal() +
  labs(title = "Synthetic ROC curve", x = "False positive rate", y = "True positive rate") +
  theme_demo()
save_svg(p_roc, "07_roc_curve.svg")

# 8. Precision-recall curve
pr <- data.frame(recall = seq(0, 1, length.out = 120))
pr$precision <- pmax(0.35, 0.95 - 0.45 * pr$recall + rnorm(nrow(pr), 0, 0.015))
p_pr <- ggplot(pr, aes(recall, precision)) +
  geom_line(color = "#2563EB", linewidth = 1.1) +
  scale_y_continuous(limits = c(0, 1)) +
  labs(title = "Synthetic precision-recall curve", x = "Recall", y = "Precision") +
  theme_demo()
save_svg(p_pr, "08_precision_recall_curve.svg")

# 9. Confusion matrix
cm <- expand.grid(predicted = c("Class A", "Class B", "Class C"), truth = c("Class A", "Class B", "Class C"))
cm$count <- c(52, 7, 3, 6, 44, 9, 2, 8, 39)
p_cm <- ggplot(cm, aes(predicted, truth, fill = count)) +
  geom_tile(color = "white", linewidth = 0.7) +
  geom_text(aes(label = count), fontface = "bold", color = "#111827") +
  scale_fill_gradient(low = "#E0F2FE", high = "#0369A1") +
  labs(title = "Synthetic confusion matrix", x = "Predicted label", y = "True label", fill = "Count") +
  theme_demo()
save_svg(p_cm, "09_confusion_matrix.svg", width = 6, height = 5)

# 10. PCA scatter
pca <- data.frame(
  PC1 = c(rnorm(60, -1.2, 0.45), rnorm(60, 1.1, 0.55), rnorm(60, 0, 0.5)),
  PC2 = c(rnorm(60, 0.8, 0.45), rnorm(60, 0.2, 0.50), rnorm(60, -1.0, 0.45)),
  group = rep(c("Control", "Disease", "Recovery"), each = 60)
)
p_pca <- ggplot(pca, aes(PC1, PC2, color = group)) +
  geom_point(alpha = 0.78, size = 2) +
  stat_ellipse(linewidth = 0.7) +
  labs(title = "Synthetic PCA scatter", x = "PC1 (synthetic variance)", y = "PC2 (synthetic variance)", color = NULL) +
  theme_demo()
save_svg(p_pca, "10_pca_scatter.svg")

# 11. Enrichment dot plot
enrich <- data.frame(
  term = factor(paste("Pathway", LETTERS[1:10]), levels = rev(paste("Pathway", LETTERS[1:10]))),
  gene_ratio = sort(runif(10, 0.05, 0.35)),
  padj = sort(runif(10, 0.001, 0.08), decreasing = TRUE),
  count = sample(8:42, 10)
)
p_enrich <- ggplot(enrich, aes(gene_ratio, term, size = count, color = -log10(padj))) +
  geom_point(alpha = 0.82) +
  scale_color_gradient(low = "#38BDF8", high = "#DC2626") +
  labs(title = "Synthetic enrichment dot plot", x = "Gene ratio", y = NULL, size = "Count", color = "-log10(adj.P)") +
  theme_demo()
save_svg(p_enrich, "11_enrichment_dotplot.svg", width = 7, height = 5.3)

# 12. Lollipop plot
lollipop <- data.frame(
  feature = factor(paste0("Feature_", seq_len(14)), levels = paste0("Feature_", seq_len(14))),
  score = sort(runif(14, 0.15, 0.95))
)
p_lollipop <- ggplot(lollipop, aes(score, feature)) +
  geom_segment(aes(x = 0, xend = score, yend = feature), color = "#CBD5E1", linewidth = 1.1) +
  geom_point(color = "#0F766E", size = 3) +
  labs(title = "Synthetic lollipop feature ranking", x = "Importance score", y = NULL) +
  theme_demo()
save_svg(p_lollipop, "12_lollipop_ranking.svg")

# 13. Correlation scatter with trend
cor_data <- data.frame(
  marker_a = rnorm(160, 6, 1.2)
)
cor_data$marker_b <- 0.72 * cor_data$marker_a + rnorm(160, 0, 0.9) + 1
p_cor <- ggplot(cor_data, aes(marker_a, marker_b)) +
  geom_point(color = "#2563EB", alpha = 0.55, size = 1.8) +
  geom_smooth(method = "lm", se = TRUE, color = "#0F766E", fill = "#99F6E4") +
  labs(title = "Synthetic correlation scatter", x = "Marker A", y = "Marker B") +
  theme_demo()
save_svg(p_cor, "13_correlation_scatter.svg")

# 14. Density overlay
density <- data.frame(
  value = c(rnorm(220, 0, 0.85), rnorm(220, 1.1, 0.95), rnorm(220, -0.7, 0.75)),
  group = rep(c("Control", "Disease", "Treatment"), each = 220)
)
p_density <- ggplot(density, aes(value, fill = group, color = group)) +
  geom_density(alpha = 0.22, linewidth = 0.8) +
  labs(title = "Synthetic density overlay", x = "Measured value", y = "Density", fill = NULL, color = NULL) +
  theme_demo()
save_svg(p_density, "14_density_overlay.svg")

# 15. Paired line plot
paired <- data.frame(
  subject = rep(paste0("ID", sprintf("%02d", 1:34)), each = 2),
  timepoint = rep(c("Before", "After"), 34)
)
baseline <- rnorm(34, 5.5, 0.9)
paired$value <- as.vector(rbind(baseline, baseline + rnorm(34, 0.65, 0.55)))
p_paired <- ggplot(paired, aes(timepoint, value, group = subject)) +
  geom_line(color = "#94A3B8", alpha = 0.65) +
  geom_point(aes(color = timepoint), size = 2) +
  scale_color_manual(values = c("Before" = "#3B82F6", "After" = "#DC2626")) +
  labs(title = "Synthetic paired line plot", x = NULL, y = "Teaching metric") +
  theme_demo()
save_svg(p_paired, "15_paired_line_plot.svg")

# 16. Missingness map
miss <- expand.grid(sample = paste0("S", sprintf("%02d", 1:28)), variable = paste0("Var", sprintf("%02d", 1:14)))
miss$missing <- rbinom(nrow(miss), 1, prob = ifelse(miss$variable %in% paste0("Var", sprintf("%02d", 1:4)), 0.18, 0.05))
p_missing <- ggplot(miss, aes(sample, variable, fill = factor(missing))) +
  geom_tile(color = "white", linewidth = 0.2) +
  scale_fill_manual(values = c("0" = "#E5E7EB", "1" = "#F97316"), labels = c("Observed", "Missing")) +
  labs(title = "Synthetic missingness map", x = "Sample", y = "Variable", fill = NULL) +
  theme_demo() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
save_svg(p_missing, "16_missingness_map.svg", width = 8, height = 5)

# 17. Coefficient plot
coef_data <- data.frame(
  term = factor(paste("Covariate", LETTERS[1:10]), levels = rev(paste("Covariate", LETTERS[1:10]))),
  estimate = rnorm(10, 0, 0.35),
  se = runif(10, 0.08, 0.18)
)
coef_data$low <- coef_data$estimate - 1.96 * coef_data$se
coef_data$high <- coef_data$estimate + 1.96 * coef_data$se
p_coef <- ggplot(coef_data, aes(estimate, term)) +
  geom_vline(xintercept = 0, linetype = "dashed", color = "#6B7280") +
  geom_errorbarh(aes(xmin = low, xmax = high), height = 0.2, color = "#475569") +
  geom_point(color = "#7C3AED", size = 2.5) +
  labs(title = "Synthetic coefficient plot", x = "Model coefficient", y = NULL) +
  theme_demo()
save_svg(p_coef, "17_coefficient_plot.svg")

# 18. Waterfall plot
waterfall <- data.frame(
  sample = factor(paste0("Sample_", seq_len(42)), levels = paste0("Sample_", seq_len(42))),
  change = sort(rnorm(42, 0, 22))
)
waterfall$direction <- ifelse(waterfall$change >= 0, "Increase", "Decrease")
p_waterfall <- ggplot(waterfall, aes(sample, change, fill = direction)) +
  geom_col(width = 0.82) +
  geom_hline(yintercept = 0, linewidth = 0.3) +
  scale_fill_manual(values = c("Increase" = "#DC2626", "Decrease" = "#2563EB")) +
  labs(title = "Synthetic waterfall plot", x = "Sample", y = "Percent change", fill = NULL) +
  theme_demo() +
  theme(axis.text.x = element_blank(), axis.ticks.x = element_blank())
save_svg(p_waterfall, "18_waterfall_plot.svg", width = 8, height = 5)

message("Done. SVG outputs are in: ", out_dir)
