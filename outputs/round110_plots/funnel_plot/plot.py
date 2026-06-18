import pandas as pd
import matplotlib.pyplot as plt
df = pd.read_csv("example_data.csv")
plt.scatter(df.effect_size, df.standard_error)
plt.gca().invert_yaxis()
plt.show()
