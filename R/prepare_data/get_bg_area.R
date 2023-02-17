library(tigris)
library(tidyverse)
library(tidycensus)

GITHUB_DIR = "C:/Users/nelms/OneDrive - PennO365/Penn/Wharton/NLURI/landuse_PROD"
setwd(GITHUB_DIR)

# get clean geoid functions
helper_path = "R/help.R"
source(helper_path)

### STATES

get_proj = function(state_name){
    crsuggest::crs_sf %>%
      filter(str_detect(crs_name, "NAD83\\(HARN\\)"),
             crs_units == "m") %>%
      filter(str_detect(crs_name, state_name)) %>%
      slice(1) %>%
      pull(crs_proj4)
}
get_projs = function(states) sapply(states, function(st) get_proj(st)) %>% unname()

vars <- load_variables(year = 2019,
                      dataset = "acs5")
vars %>%
    filter(geography=='block group') %>%
    filter(grepl("_001",name)) %>%
    filter(grepl('HOUSING',concept))

states = fips_codes %>%
    select(state, state_code, state_name) %>%
    unique() %>%
    filter(state_code < 60) %>%
    select(state, state_code)

bg_df =
    tibble(
        GEOID = character(),
        hu = numeric(),
        area = numeric()
    )
vars = c("B25001_001")
for (state in states$state) {
    bg_df =
        bg_df %>%
        rbind(
            get_acs(
                geography = "block group",
                variables = vars,
                state = state,
                geometry = TRUE, year = 2019,
                keep_geo_vars = TRUE, output = 'wide'
            ) %>%
            st_drop_geometry() %>%
            transmute(
                GEOID = GEOID %>% as.character(),
                hu = B25001_001E,
                area = ALAND
            ))
}
blockg_df = bg_df

bg_df =
    bg_df %>%
    mutate(
        GEOID = GEOID %>%
            format_geoid_col(., 12),
        trtid10 = GEOID %>%
            sapply(., function(t) substr(t, 1, 11)) %>%
            format_geoid_col(., 11) %>%
            fix_geoid(.)
    )