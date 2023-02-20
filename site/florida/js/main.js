import { initializeMap, polygonLayerfun } from "./map.js";
import { changeFilter } from "./mapcolors.js";

let Map = initializeMap();
polygonLayerfun(Map);

function downloadInv() {
    const fpath = '../../data/national_results/FL_bg_20230117.geojson';
    fetch(fpath)
    .then(resp => resp.json())
    .then(data => {
        Map.polygonLayer.addData(data);
    });
}

downloadInv();



let overlayDropdown = document.querySelector('#overlay');

overlayDropdown.addEventListener('click', () => {
        let value = event.target.value;
        changeFilter(value);
});

window.Map = Map;
