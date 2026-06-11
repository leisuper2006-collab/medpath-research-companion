library(ggplot2)
library(jsonlite)

dir.create("outputs/round11_detail_plots", recursive = TRUE, showWarnings = FALSE)

safe_id <- function(x) {
  x <- gsub("[^A-Za-z0-9_-]+", "-", tolower(x))
  x <- gsub("-+", "-", x)
  gsub("^-|-$", "", x)
}

theme_medpath <- function() {
  theme_minimal(base_size = 12) +
    theme(
      plot.title = element_text(face = "bold", size = 15, color = "#102337"),
      plot.subtitle = element_text(size = 10, color = "#536b7d"),
      panel.grid.minor = element_blank(),
      panel.grid.major = element_line(color = "#e8eef5", linewidth = 0.3),
      axis.title = element_text(color = "#355067"),
      axis.text = element_text(color = "#536b7d"),
      legend.position = "bottom",
      legend.title = element_blank()
    )
}

tools <- fromJSON("data/open_source_catalog.json", simplifyVector = FALSE)

for (i in seq_along(tools)) {
  item <- tools[[i]]
  id <- item$id
  set.seed(15000 + i)
  steps <- c("Read", "Install", "Demo", "Audit", "Compare")
  df <- data.frame(
    step = factor(steps, levels = steps),
    readiness = pmin(cumsum(runif(5, 0.12, 0.22)), 1),
    risk = rev(pmin(cumsum(runif(5, 0.08, 0.18)), 1)),
    effort = runif(5, 0.2, 0.95)
  )
  p <- ggplot(df, aes(step, readiness, group = 1)) +
    geom_col(aes(fill = readiness), width = 0.62, alpha = 0.78) +
    geom_line(aes(y = risk), color = "#d06b48", linewidth = 1.0) +
    geom_point(aes(y = risk), color = "#d06b48", size = 2.4) +
    scale_fill_gradient(low = "#dff5ee", high = "#259b72") +
    scale_y_continuous(labels = scales::percent_format(), limits = c(0, 1.05)) +
    labs(
      title = paste0("Open-source learning map: ", item$name),
      subtitle = "Synthetic checklist visual; verify license, version and source data before use",
      x = NULL,
      y = "Readiness"
    ) +
    theme_medpath() +
    annotate("label", x = 4.9, y = 0.11, label = "Reference only", hjust = 1, size = 3, fill = "#fff8ee", color = "#67462c", label.size = 0.15)
  ggsave(file.path("outputs/round11_detail_plots", paste0("tool_", id, ".svg")), p, width = 7.2, height = 4.8, units = "in", device = "svg", bg = "white")
}

cat("generated_tool_svgs=", length(tools), "\n", sep = "")
