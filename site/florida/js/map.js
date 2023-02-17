
function initializeMap () {
    //const southWest = L.latLng(39.960774719794294, -75.14086971621691),
    //northEast = L.latLng(39.9825160929394, -75.11223550383296),
    //bounds = L.latLngBounds(southWest, northEast);

    let Map = L.map('florida-map' /*,{ maxBounds: bounds, maxZoom: 25, minZoom: 14.4 }*/).setView([28.7956876, -82.36908], 6.5);

    const mapboxAccount = 'mapbox';
    const mapboxStyle = 'light-v10';
    const mapboxToken = 'pk.eyJ1IjoieWVzZW5pYW8iLCJhIjoiY2tlZjAyM3p5MDNnMjJycW85bmpjenFkOCJ9.TDYe7XRNP8CnAto0kLA5zA';
    L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {
    maxZoom: 19,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
}).addTo(Map);
return Map;
}



function highlightFeature(e) {
    e.target.setStyle({ weight: 5, color: "yellow" });
}

function initstyle(feature) {
    return {
        fillColor: 'orange',
        weight: 2,
        opacity: 1,
        color: 'NA',
        fillOpacity: 1,
    };
}


function polygonLayerfun(Map){
    Map.polygonLayer = L.geoJSON(null, {
        style: initstyle,
        onEachFeature: function(feature, layer) {
            layer.geoid = feature.properties.GEOID;
            layer.county = feature.properties.county_nm;
            layer.r_index = feature.properties.r_index;
            layer.source = feature.properties.source;
            layer.addEventListener("click", highlightFeature);
        },
    }).addTo(Map);
}

export {
    initializeMap,
    polygonLayerfun,
    initstyle
};