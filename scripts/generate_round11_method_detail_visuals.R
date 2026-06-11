library(jsonlite)

dir.create("outputs/round11_method_plots", recursive = TRUE, showWarnings = FALSE)

safe_id <- function(x) {
  x <- gsub("[^A-Za-z0-9_-]+", "-", tolower(x))
  x <- gsub("-+", "-", x)
  gsub("^-|-$", "", x)
}

methods <- fromJSON("data/method_universe.json", simplifyVector = FALSE)

palette <- c("#2fbf71", "#58a6ff", "#f59f6b", "#d06b48", "#7c6ee6")

`%||%` <- function(a, b) if (!is.null(a) && length(a) > 0 && !is.na(a)) a else b

for (i in seq_along(methods)) {
  item <- methods[[i]]
  id <- item$id
  path <- file.path("outputs/round11_method_plots", paste0("method_", safe_id(id), ".svg"))
  set.seed(20000 + i)
  svg(path, width = 7.2, height = 4.8, bg = "white")
  par(mar = c(4.4, 4.6, 3.2, 1.2), family = "sans", fg = "#102337", col.axis = "#536b7d", col.lab = "#355067")
  kind <- i %% 6
  main_title <- paste0("Method learning map: ", sprintf("M%03d", i))
  if (kind == 0) {
    x <- seq(0, 1, length.out = 80)
    y1 <- pmin(pmax(cumsum(rnorm(80, 0.006, 0.025)) + 0.35, 0), 1)
    y2 <- pmin(pmax(cumsum(rnorm(80, 0.004, 0.022)) + 0.48, 0), 1)
    plot(x, y1, type = "l", lwd = 3, col = palette[1], main = main_title, xlab = "Workflow progress", ylab = "Readiness", ylim = c(0, 1))
    lines(x, y2, lwd = 3, col = palette[2])
    legend("bottomright", legend = c("data prepared", "review confidence"), col = palette[1:2], lwd = 3, bty = "n", cex = 0.8)
  } else if (kind == 1) {
    m <- matrix(rnorm(48), nrow = 6)
    image(t(m[nrow(m):1, ]), col = colorRampPalette(c("#2867a8", "white", "#e26d5c"))(40), axes = FALSE, main = main_title)
    axis(1, at = seq(0, 1, length.out = 8), labels = paste0("S", 1:8), cex.axis = 0.75)
    axis(2, at = seq(0, 1, length.out = 6), labels = paste0("F", 6:1), cex.axis = 0.75)
    box(col = "#d7e2ec")
  } else if (kind == 2) {
    vals <- abs(rnorm(10, 0.7, 0.25))
    barplot(vals, horiz = TRUE, col = colorRampPalette(c("#dff5ee", "#2fbf71"))(10), border = NA, main = main_title, xlab = "Relative teaching score", names.arg = paste0("Step ", 1:10), las = 1)
  } else if (kind == 3) {
    x <- rnorm(90, rep(c(-0.8, 0.2, 0.9), each = 30), 0.42)
    y <- rnorm(90, rep(c(0.1, 0.7, 1.1), each = 30), 0.45)
    grp <- rep(1:3, each = 30)
    plot(x, y, pch = 19, col = adjustcolor(palette[grp], 0.72), main = main_title, xlab = "Prepared feature", ylab = "Training signal")
    abline(lm(y ~ x), col = "#102337", lwd = 2, lty = 2)
  } else if (kind == 4) {
    vals <- replicate(3, rnorm(40, runif(1, -0.4, 0.8), 0.45))
    boxplot(vals, col = adjustcolor(palette[1:3], 0.45), border = palette[1:3], main = main_title, xlab = "Teaching groups", ylab = "Synthetic value", names = c("A", "B", "C"))
    stripchart(vals, vertical = TRUE, method = "jitter", add = TRUE, pch = 19, col = adjustcolor("#102337", 0.25))
  } else {
    theta <- seq(0, 2 * pi, length.out = 7)
    r <- c(runif(6, 0.35, 0.95), NA)
    plot(cos(theta), sin(theta), type = "n", axes = FALSE, xlab = "", ylab = "", main = main_title)
    polygon(cos(theta[-7]), sin(theta[-7]), border = "#d7e2ec")
    for (k in seq(0.2, 1, by = 0.2)) polygon(k * cos(theta[-7]), k * sin(theta[-7]), border = "#eef3f7")
    polygon(r[-7] * cos(theta[-7]), r[-7] * sin(theta[-7]), col = adjustcolor("#58a6ff", 0.28), border = "#2f6ca3", lwd = 2)
    text(1.15 * cos(theta[-7]), 1.15 * sin(theta[-7]), labels = c("Data", "Code", "QC", "Model", "Plot", "Review"), cex = 0.78, col = "#536b7d")
  }
  mtext("Synthetic teaching visual | not a measured research result", side = 1, line = 3, cex = 0.72, col = "#536b7d")
  dev.off()
}

cat("generated_method_svgs=", length(methods), "\n", sep = "")
