library(ggplot2)
dat <- read.csv("example_data.csv")
ggplot(dat, aes(effect_size, standard_error)) + geom_point() + scale_y_reverse() + theme_minimal()
