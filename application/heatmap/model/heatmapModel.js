const heatmapView = require('../views/heatmapView');

let map;

exports.initMap = () => {
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
};


let pollen = "GRASS_UPI";

function updatePollenLayer() {
  console.log(`Updating layer to: ${pollen}`);
  const tileLayer = L.tileLayer(`https://pollen.googleapis.com/v1/mapTypes/${pollen}/heatmapTiles/{z}/{x}/{y}?key=${apiKey}`, {
    attribution: 'Google Pollen Heatmap',
    opacity: 0.5
  });
  map.addLayer(tileLayer);
}


exports.searchLocation = (req, res) => {
  const query = req.body.query;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        map.setView([lat, lon], 13);
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Location not found!" });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      res.json({ success: false, message: "An error occurred while searching for the location." });
    });
};


exports.renderHeatmap = (req, res) => {
  res.render('heatmapView', { pollen });
};

exports.updatePollenLayer = (req, res) => {
  pollen = req.body.pollen;
  updatePollenLayer();
  res.json({ success: true });
};