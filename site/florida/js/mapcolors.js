import { initstyle } from "./map.js";


function changeFilter(value) {
    if(value === 'off' ) {
        Map.polygonLayer.eachLayer(layer => { layer.setStyle(initstyle(layer)) });
    }
    if(value === 'r_index' ) {
        Map.polygonLayer.eachLayer(layer => { layer.setStyle(r_index_style(layer)) });
    }
    if(value === 'source' ) {
        Map.polygonLayer.eachLayer(layer => { layer.setStyle(source_style(layer)) });
    }
}

function r_index_style(feature) {
    return {
        fillColor: 'red'/*  feature => {
        if(feature.source > 1) return 'green';
        return 'blue';
        } */,
        
        weight: 2,
        opacity: 1,
        color: 'NA',  //Outline color
        fillOpacity: 1,
    };
}

function source_cols(p){
    if(p == "Observation") return 'green';
    if(p == "Observation") return 'green';

    return 'blue';
}

function source_style(layer) {
    return {
        fillColor: source_cols(layer.source),        
        weight: 2,
        opacity: 1,
        color: 'NA',  //Outline color
        fillOpacity: 1,
    };
}

export{ changeFilter };