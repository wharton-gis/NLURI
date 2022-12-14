# National Land Use Regulatory Index

This repository reproduces a workflow to predict land use with a combination of satellite imagery, administrative data, street topology. The imagery used in the model comes from Google Earth Engine, and [this](https://colab.research.google.com/drive/1-7TeNduO6VmV0bmN0bgeHnWZ_DEwMpqK?usp=sharing) script produces the files.  

- `help.R` constains a function to create spatially lagged variables
- `extract.R` allows us to convert raster imagery into tabular data
- `osmnx.ipynb` constructs variables from the street network
- `left.R` blends it all together to produce the left side of the regression
- `lag.R` runs a lasso for feature selection and random forest for prediction

![](viz/protected_lines_redux.png)


#### [Variable List](https://docs.google.com/spreadsheets/d/1N32jq1qFINVKTSFCJixLgSJDprpNQzP4Q-nVV60xw08/edit?usp=sharing)
