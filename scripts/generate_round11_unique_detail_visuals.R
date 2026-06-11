library(ggplot2)
library(jsonlite)

dir.create("outputs/round11_detail_plots", recursive = TRUE, showWarnings = FALSE)

safe_id <- function(x) {
  x <- gsub("[^A-Za-z0-9_-]+", "_", x)
  x <- gsub("_+", "_", x)
  x
}

save_svg_plot <- function(plot, path, width = 7.2, height = 4.8) {
  ggsave(path, plot = plot, width = width, height = height, units = "in", device = "svg", bg = "white")
}

theme_medpath <- function() {
  theme_minimal(base_size = 12) +
    theme(
      plot.title = element_text(face = "bold", size = 15, color = "#0f2537"),
      plot.subtitle = element_text(size = 10.5, color = "#4b6477"),
      panel.grid.minor = element_blank(),
      panel.grid.major = element_line(color = "#e7eef4", linewidth = 0.35),
      legend.position = "bottom",
      legend.title = element_blank(),
      axis.title = element_text(color = "#31485a"),
      axis.text = element_text(color = "#4b6477")
    )
}

make_plot_visual <- function(i, item) {
  set.seed(9000 + i)
  id <- item$id %||% paste0("plot_", i)
  title <- item$en_name %||% item$name %||% paste0("Plot ", i)
  kind <- i %% 8
  n <- 90
  group <- factor(rep(c("Control", "Treatment", "Review"), length.out = n))
  df <- data.frame(
    x = rnorm(n, rep(c(-0.8, 0.15, 0.95), length.out = n), 0.45),
    y = rnorm(n, rep(c(0.2, 0.75, 1.25), length.out = n), 0.5),
    group = group,
    label = paste0("F", seq_len(n)),
    value = abs(rnorm(n, 1, 0.6)),
    rank = seq_len(n)
  )
  palette <- c("Control" = "#58a6ff", "Treatment" = "#2fbf71", "Review" = "#f59f6b")

  if (kind == 0) {
    p <- ggplot(df, aes(x, y, color = group)) +
      geom_point(size = 2.2, alpha = 0.82) +
      geom_smooth(method = "lm", se = FALSE, linewidth = 0.7) +
      scale_color_manual(values = palette) +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic pattern for field checking and interpretation practice", x = "Prepared feature", y = "Observed signal")
  } else if (kind == 1) {
    mat <- expand.grid(row = paste0("Gene ", 1:9), col = paste0("Sample ", 1:8))
    mat$z <- rnorm(nrow(mat), rep(seq(-1.5, 1.5, length.out = 9), each = 8), 0.7)
    p <- ggplot(mat, aes(col, row, fill = z)) +
      geom_tile(color = "white", linewidth = 0.35) +
      scale_fill_gradient2(low = "#2867a8", mid = "white", high = "#e26d5c") +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic heat-pattern; not a measured result", x = NULL, y = NULL)
  } else if (kind == 2) {
    df$value <- df$x + df$y + rnorm(n, 0, 0.35)
    p <- ggplot(df, aes(group, value, fill = group)) +
      geom_violin(alpha = 0.35, color = NA) +
      geom_boxplot(width = 0.18, outlier.shape = NA, alpha = 0.75) +
      geom_jitter(width = 0.08, size = 0.9, alpha = 0.35) +
      scale_fill_manual(values = palette) +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic distribution comparison for teaching", x = NULL, y = "Training value")
  } else if (kind == 3) {
    top <- head(df[order(-df$value), ], 18)
    p <- ggplot(top, aes(reorder(label, value), value, fill = group)) +
      geom_col(width = 0.72) +
      coord_flip() +
      scale_fill_manual(values = palette) +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Ranked synthetic features; review source data before interpretation", x = NULL, y = "Relative score")
  } else if (kind == 4) {
    curve <- data.frame(
      t = rep(seq(0, 12, length.out = 70), 3),
      group = rep(c("Control", "Treatment", "Review"), each = 70)
    )
    curve$signal <- 1 / (1 + exp(-(curve$t - rep(c(6.6, 5.4, 7.4), each = 70)))) + rnorm(nrow(curve), 0, 0.025)
    p <- ggplot(curve, aes(t, signal, color = group)) +
      geom_line(linewidth = 1) +
      scale_color_manual(values = palette) +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic trajectory; use only for workflow explanation", x = "Pseudo time", y = "Signal")
  } else if (kind == 5) {
    ci <- data.frame(
      term = paste("Feature", LETTERS[1:9]),
      est = rnorm(9, 0, 0.55)
    )
    ci$lo <- ci$est - runif(9, 0.15, 0.45)
    ci$hi <- ci$est + runif(9, 0.15, 0.45)
    p <- ggplot(ci, aes(est, reorder(term, est))) +
      geom_vline(xintercept = 0, color = "#9fb3c8", linetype = 2) +
      geom_errorbarh(aes(xmin = lo, xmax = hi), height = 0.16, color = "#426b8a") +
      geom_point(size = 2.4, color = "#d06b48") +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic interval display; estimates are placeholders", x = "Effect estimate", y = NULL)
  } else if (kind == 6) {
    df$score <- pmin(pmax(seq(0.02, 0.98, length.out = n) + rnorm(n, 0, 0.04), 0), 1)
    df$truth <- as.integer(df$score + rnorm(n, 0, 0.18) > 0.55)
    p <- ggplot(df, aes(score, after_stat(density), fill = factor(truth))) +
      geom_density(alpha = 0.38) +
      scale_fill_manual(values = c("#58a6ff", "#ef7d6a"), labels = c("Class 0", "Class 1")) +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic model-score distribution; not a validation result", x = "Model score", y = "Density")
  } else {
    flow <- data.frame(
      step = factor(rep(c("Input", "QC", "Model", "Review"), each = 5), levels = c("Input", "QC", "Model", "Review")),
      item = rep(paste0("Item ", 1:5), 4),
      value = abs(rnorm(20, 1, 0.3))
    )
    p <- ggplot(flow, aes(step, value, group = item, color = item)) +
      geom_line(alpha = 0.65, linewidth = 0.8) +
      geom_point(size = 1.8) +
      guides(color = "none") +
      labs(title = paste0("Teaching redraw: ", title), subtitle = "Synthetic workflow profile; designed for beginner explanation", x = NULL, y = "Relative value")
  }

  p + theme_medpath() +
    annotate("label", x = Inf, y = -Inf, label = "Synthetic teaching visual", hjust = 1.04, vjust = -0.5, size = 3, fill = "#f7fbff", color = "#345", label.size = 0.15)
}

make_article_visual <- function(i, item) {
  set.seed(12000 + i)
  id <- item$id %||% paste0("article_", i)
  title <- item$type %||% paste0("Article ", i)
  steps <- c("Question", "Materials", "Method", "Figures", "Review")
  df <- data.frame(
    step = factor(steps, levels = steps),
    readiness = pmax(pmin(cumsum(runif(5, 0.12, 0.22)), 1), 0.1),
    risk = rev(pmax(pmin(cumsum(runif(5, 0.08, 0.17)), 1), 0.1))
  )
  p <- ggplot(df, aes(step, readiness, group = 1)) +
    geom_col(aes(fill = readiness), width = 0.62, alpha = 0.72) +
    geom_line(aes(y = risk), color = "#d06b48", linewidth = 1, group = 1) +
    geom_point(aes(y = risk), color = "#d06b48", size = 2.3) +
    scale_fill_gradient(low = "#d9f3ea", high = "#2fbf71") +
    scale_y_continuous(labels = scales::percent_format(), limits = c(0, 1.05)) +
    labs(
      title = paste0("Workflow map: ", title),
      subtitle = "Synthetic article-planning visual; real manuscripts need source data and mentor review",
      x = NULL,
      y = "Template readiness"
    ) +
    theme_medpath() +
    annotate("label", x = 4.9, y = 0.12, label = "No fabricated results", hjust = 1, size = 3, fill = "#fff8ee", color = "#67462c", label.size = 0.15)
  p
}

`%||%` <- function(a, b) if (!is.null(a) && length(a) > 0 && !is.na(a)) a else b

plots <- fromJSON("data/plot_gallery_taxonomy.json", simplifyVector = FALSE)
articles <- fromJSON("data/article_skill_workflows.json", simplifyVector = FALSE)

for (i in seq_along(plots)) {
  id <- safe_id(plots[[i]]$id %||% paste0("plot_", i))
  path <- file.path("outputs/round11_detail_plots", paste0("plot_", id, ".svg"))
  save_svg_plot(make_plot_visual(i, plots[[i]]), path)
}

for (i in seq_along(articles)) {
  id <- safe_id(articles[[i]]$id %||% paste0("article_", i))
  path <- file.path("outputs/round11_detail_plots", paste0("article_", id, ".svg"))
  save_svg_plot(make_article_visual(i, articles[[i]]), path)
}

cat("generated_plot_svgs=", length(plots), "\n", sep = "")
cat("generated_article_svgs=", length(articles), "\n", sep = "")
