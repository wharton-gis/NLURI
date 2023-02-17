import { initializeMap, polygonLayerfun } from "./map.js";

let Map = initializeMap();
polygonLayerfun(Map);

function downloadInv() {
    const fpath = '../../data/national_results/FL_results_20230117.geojson';
    console.log(fpath);
    fetch(fpath)
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        Map.polygonLayer.addData(data);
        console.log('added');
    });
    Map.fitBounds(Map.polygonLayer.getBounds());
}

downloadInv();

window.Map = Map;
export{ Map }