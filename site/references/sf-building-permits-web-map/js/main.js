/* eslint-disable dot-notation */
const apiHost = 'http://localhost:3000';
// const apiHost = 'https://github.com/nelmsal/sf-building-permits-web-map'

/**
 This map is a companion piece to my capstone project:
 https://nelmsal.github.io/PermitMetrics_FinalReport.html

 Which evalues the housing units added between 2015-19 in San Francisco. I contemplate if the new units are (1) relieving the housing shortage, and/or (2) continuing to displacement many low-income, long-term renters.

 There isn't a set answer. But this web map can help display metrics suggesting that units are primarily being added to low-income areas but cater to high-income, transplants.
*/

/**
 My map is loaded by
 1. Setting up leaflet map & mapbox tiles
 2. Add buttons to select metrics to visualize
 3. Colors & Bins to visualize data
 4. Number functions
 5. Tool Tips & Info bar
 6. Load Chloropleth map
 7. Legend
 8. Units Hot Spot Outline
*/


// 1. SET UP MAP
const map = L.map('map').setView([37.758667, -122.440071], 12.25);
let metricsLayer = L.layerGroup().addTo(map);
// MAPBOX TILES
// STYLE IS LIGHT GREY WITH SOME CUSTOM NEIGHBORHOOD LABELS
let mbAccessToken = 'pk.eyJ1IjoibmVsbXMiLCJhIjoiY2wycWZldnQ0MDA0cTNscGE0bmdwZW1qNiJ9.WAtQnoSeY6VaN38L5X-lEA';
let mbID = 'nelms';
let mbStyle = 'cl2qgn76n000r15och2qhmsw8';
L.tileLayer(`https://api.mapbox.com/styles/v1/${mbID}/${mbStyle}/tiles/256/{z}/{x}/{y}?access_token=${mbAccessToken}`, {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// 2. COLUMN BUTTONS
// FIND TITLE OF BUTTONS
let titleFocus = (valueColumn) => {
  const valArray = valueColumn.split(".");
  // i was too pressed to change my colorBins.json
  // to hold actual titles instead of changing them
  // on the fly
  var focusTitle = `${valArray[0]}`.replace('poc_linc', 'Change in<br>Low-Income<br>People of Color').replace('pop_dens_res', 'Population per<br>Residential Sq.Mi.').replace('occ_own', 'Owner Occupied').replace('wht', 'Change in<br>White Pop').replace("units", "New Housing Units")
  focusTitle = focusTitle.charAt(0).toUpperCase() + focusTitle.slice(1)
  return focusTitle
}
// TURN COLUMN STRING TO TITLE
let titleColumn = (valueColumn) => {
  const valArray = valueColumn.split(".");
  focusTitle = titleFocus(valueColumn);
  var focusNum = valArray[1].replace('tot', 'Total').replace('pct', 'Percent');
  focusYears = `(20${valArray[2].replace('_','-')})`
  return focusNum + ' ' + focusTitle + ' ' + focusYears
}
// COLUMN STRING & TITLE TO VISUALZIE
let valueColumn = "units.tot.15_19";
let valueTitle = titleColumn(valueColumn);
// COLUMNS AVAILIBLE IN valueBins.js
let columnOptions = Object.keys(valueBins);
// FUNCTION WHEN NEW COLUMN IS SELECTED
let chooseColumn = (choiceColumn) => {
  valueColumn = choiceColumn;
  valueTitle = titleColumn(valueColumn);
  metricsLayer.clearLayers();
  loadMetrics();
  loadHotSpot()
  info.addTo(map);
  legend.addTo(map);
}
// AREA TO ADD BUTTONS
var buttonColumns = L.control({position: 'bottomleft'});
// FOR EACH COLUMN IN valueBins.js ADD A BUTTON
buttonColumns.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info button');
  let buttonLabels = [];
  columnOptions.forEach(function (choiceColumn, index) {
    choiceFocus = titleFocus(choiceColumn)
    buttonString = `<button class="button" onClick="chooseColumn('${choiceColumn}')">${choiceFocus}</button>`
    div.innerHTML += buttonLabels.push(
      buttonString);
  });
  div.innerHTML = buttonLabels.join('<br>');
  return div;
};
buttonColumns.addTo(map);

// 3. COLOR & BINS
// COLOR & LAYER STYLE FUNCTIONS
var colors;
var bins;
// GET COLOR ARRAY FROM colorbrewer.js
let getColors = (cmap, n) => colorbrewer[cmap][n];
// GET CMAP STRING FROM valueBins.js
let getColorBins = (column, binLength, cmap) => {
    cmap = cmap || valueBins[column].cmap;
    colors = getColors(cmap, binLength);
    return colors;
};
// GET A FEATURE'S COLOR BASED ON WHICH BIN THE VALUE IS IN
let getBinIndex = (bins, value) => {
    for (let i = 0; i <= bins.length; i++) {
      if (bins[i] > value) {
        return i-1;
      }
    }
    return 0;
  };
// THE FEATURE'S BIN'S INDEX IS PASSED TO THE COLOR ARRAY
let getValueColor = (value, column) => {
    bins = valueBins[column].bins;
    colors = getColorBins(column, bins.length-1);
    let binIndex = getBinIndex(bins, value);
    return colors[binIndex];
};
// ASSIGNS COLORS
let metricStyle = (feature) => ({
  weight: 1,
  opacity: 0.1,
  fillOpacity: 0.7,
  color: '#000000',
  fillColor: getValueColor(
    feature.properties[valueColumn], valueColumn),
});

// 4. NUMBER FORMAT FUNCTIONS
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function percentage(partialValue) {
  return `${Math.round(partialValue)}%`;
}
function checkNumber(value) {
  if (Number.isFinite(value)) {
    if (valueColumn.includes('pct')) {
      value = percentage(value);
    } else if (value > 1000) {
      value = numberWithCommas(value)
    }
  }
  return value
}

// 5. TOOL TIP & INFO BAR
// ADD INFO
var info = L.control();
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
info.update = function (props) {
  this._div.innerHTML = '<h4>San Francisco</h4>' +  (props ?
    '<b>' + valueTitle + '</b><br />' + checkNumber(props[valueColumn]) + '' : 'Hover over a Block Group');
};
info.addTo(map);
// tool tip bar in the top right
const loadToolTip = (layer) => {
  ToolTipValue = layer.feature.properties[valueColumn];
  ToolTipValue = checkNumber(ToolTipValue);
  ToolTipValue = `${ToolTipValue}`
  return ToolTipValue;
}
// highlight & zoom to feature
// (highlights stopped working)
function highlightFeature(e) {
  var layer = e.target;
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
  info.update(layer.feature.properties);
}
function resetHighlight(e) {
  var layer = e.target;
  layer.setStyle(metricStyle(e.target));
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      // mouseout: metricStyle,
      click: zoomToFeature
  });
}

// 6. LOAD CHLOROPLETH MAP
function loadMetrics() {
  fetch(`${apiHost}/data/sf_permit_metrics.geojson`, {mode: 'cors'})
    .then(resp => resp.json())
    .then(data => {
      metricsLayer = L.geoJSON(data, {
        style: metricStyle,
        onEachFeature: onEachFeature,
        riseOnHover: true
      });
      metricsLayer.bindTooltip(layer => loadToolTip(layer), { sticky: true });
      metricsLayer.addTo(map).bringToBack();
    });
}
loadMetrics()

// 7. LEGEND
// ADD LEGEND TO VIEW COLUMN VALUE BINS
var legend = L.control({position: 'bottomright'});
// CYCLES THROUGH BINS, COLORS, AND VALUE RANGES
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    let labels = [`<strong>${valueTitle}</strong>`];
    var from;
    var to;

    bins = valueBins[valueColumn].bins
    binLabels = valueBins[valueColumn].labels
    colors = getColorBins(valueColumn, bins.length-1);

    for (var i = 0; i < bins.length-1; i++) {
			from = checkNumber(bins[i]);
			to = checkNumber(bins[i + 1]);
      toFrom = `${from} - ${to}`
      color = colors[i]
      if (binLabels.length > 0){
        toFrom = binLabels[i]
      }

      div.innerHTML += labels.push(
				`<i class="circle" style="background:${color}"></i> ${toFrom}`);
		}

		div.innerHTML = labels.join('<br>');
		return div;
};
legend.addTo(map);

// 8. UNITS HOT SPOT
// Local Spatial Autocorrelation of Units
// Areas of high significance p<.001
function loadHotSpot() {
  fetch(`${apiHost}/data/sf_units_hotspots.geojson`, {mode: 'cors'})
    .then(resp => resp.json())
    .then(data => {
      hotspotLayer = L.geoJSON(data, {
        style: {
          weight: 3,
          opacity: 0.75,
          fillOpacity: 0,
          color: '#000000',
          fillColor: '#FFFFFF',
        },
        interactive: false
      });
      hotspotLayer.addTo(map).bringToFront();
    });
}
loadHotSpot()