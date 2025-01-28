// heatmapController.js

const fetch = require('node-fetch');
const heatmapView = require('../views/heatmapView');
const L = require('leaflet');

let map;
let pollen = "GRASS_UPI";
let apiKey; // Add environmental apikey variable

function initMap(req, res) {
  map = L.map('map', {
    center: [-37.8136, 144.9631], // Center of Melbourne
    zoom: 6,
    minZoom: 4,
    maxBounds: L.latLngBounds(L.latLng(-44.261, 112.596), L.latLng(-10.460, 154.512)),  // Set the maximum bounds to Melbourne
    maxBoundsViscosity: 1.0  // Optional
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  updatePollenLayer();
  res.render('heatmapView', { pollen });
}

function updatePollenLayer() {
  console.log(`Updating layer to: ${pollen}`);
  const tileLayer = L.tileLayer(`https://pollen.googleapis.com/v1/mapTypes/${pollen}/heatmapTiles/{z}/{x}/{y}?key=${apiKey}`, {
    attribution: 'Google Pollen Heatmap',
    opacity: 0.5
  });
  map.addLayer(tileLayer);
}


module.exports = {
  initMap,
  searchLocation,
  updatePollenLayerController
};