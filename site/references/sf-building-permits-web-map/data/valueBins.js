const valueBins = {
    "units.tot.15_19": {
        "value": "units.tot.15_19",
        "bins": [0,1,10,25,50,200,1000,4000],
        "cmap": "Greens",
        "labels":[]
    },
    "pop_dens_res.tot.18": {
        "value": "pop_dens_res.tot.18",
        "bins": [0,300,600,900,2000,5000],
        "cmap": "Reds",
        "labels":[]
    },
    "occ_own.pct.18": {
        "value": "occ_own.pct.18",
        "bins": [0,25,50,75,100],
        "cmap": "Purples",
        "labels":["0 to 24%", "25% to 49%", "50 to 74%" ,"75 to 100%"]
    },
    "evictions.tot.10_19": {
        "value": "evictions.tot.10_19",
        "bins": [0,1,50,75,100,150,200,500,1000],
        "cmap": "YlOrBr",
        "labels":[]
    },
    /**
    "rent_ch.pct.12_18": {
        "value": "rent_ch.pct.12_18",
        "bins":[0, .10, .50, 1.00, 10000.00],
        "cmap": "RdYlGn",
        "labels":['+1 to 9', '+10 to 49', '+50 to 99', '+100 & up']
    },
    */
    'poc_linc.pct.10_15': {
        "value": "poc_linc.pct.10_15",
        "bins":[-1000000000, -100, -50, -10, 0, 10, 50, 100, 1000],
        "cmap": "RdYlGn",
        "labels":['-100','-99 to -50','-49 to -10', '-9 to 0', '+1 to 9', '+10 to 49', '+50 to 99', '+100 & up']
    },
    "wht.pct.10_15": {
        "value": "wht.pct.10_15",
        "bins":[-1000000000, -100, -50, -10, 0, 10, 50, 100, 1000],
        "cmap": "PiYG",
        "labels":['-100','-99 to -50','-49 to -10', '-9 to 0', '+1 to 9', '+10 to 49', '+50 to 99', '+100 & up']
    },
}
