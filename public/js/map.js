document.addEventListener('DOMContentLoaded', function () {
  // Define the geographical bounds for Melbourne
  var southWest = L.latLng(-44.261, 112.596),
    northEast = L.latLng(-10.460, 154.512);
  var bounds = L.latLngBounds(southWest, northEast);

  // Initialize the map and set its view to Melbourne, and set maxBounds
  var map = L.map('map', {
    center: [-37.8136, 144.9631], // Center of Melbourne
    zoom: 15,
    minZoom: 9,
    maxZoom: 16, // Set maximum zoom level to 19
    maxBounds: bounds, // Set the maximum bounds to Melbourne
    maxBoundsViscosity: 1.0 // Optional: make the bounds more "sticky"
  });

  // Add the base tile layer from OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Set maximum zoom level to 19
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Function to search for a location and move the map
  document.getElementById('search-button').onclick = function () {
    var query = document.getElementById('search-input').value;
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;
          map.setView([lat, lon], 13);
        } else {
          alert("Location not found!");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while searching for the location.");
      });
  };

  // Initialize pollen layer and update based on selected button
  var apiKey = ''; 
  let pollen = "GRASS_UPI"; // Default pollen type
  let pollenLayer; // Variable to hold the current pollen layer

  function updatePollenLayer() {
    if (pollenLayer) {
      map.removeLayer(pollenLayer); // Remove the previous pollen layer if it exists
    }
    console.log(`Updating layer to: ${pollen}`);
    const url = `https://pollen.googleapis.com/v1/mapTypes/${pollen}/heatmapTiles/{z}/{x}/{y}?key=${apiKey}`;
    console.log(`Fetching URL: ${url}`); 
    pollenLayer = L.tileLayer(url, {
      attribution: 'Google Pollen Heatmap',
      opacity: 0.5,
      maxZoom: 16,  // Set maximum zoom level to 19
      bounds: bounds // Restrict tiles to the defined bounds
    }).addTo(map);
  }

  // Initial layer
  updatePollenLayer();

  // Add event listeners to update the pollen type
  document.getElementById('button-3').addEventListener("click", function () {
    pollen = "TREE_UPI";
    console.log('Tree button clicked');
    updatePollenLayer();
  });

  document.getElementById('button-1').addEventListener("click", function () {
    pollen = "GRASS_UPI";
    console.log('Grass button clicked');
    updatePollenLayer();
  });

  document.getElementById('button-2').addEventListener("click", function () {
    pollen = "WEED_UPI";
    console.log('Weed button clicked');
    updatePollenLayer();
  });
});
