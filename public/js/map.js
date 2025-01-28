document.addEventListener('DOMContentLoaded', function () {
  // Define the geographical bounds for Melbourne
  var bounds = [[-39.0, 141.0], [-34.5, 150.0]];

  // Initialize the map and set its view to Melbourne, and set maxBounds
  var map = L.map('map', {
    center: [-37.8136, 144.9631], // Center of Melbourne
    zoom: 18,
    minZoom: 9,
    maxZoom: 13, 
    maxBounds: bounds, // Set the maximum bounds to Melbourne
    maxBoundsViscosity: 1.0 
  });

  // Add the base tile layer from OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15, // Set maximum zoom level to 15
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Function to search for a location and move the map
  document.getElementById('search-button').onclick = function () {
    var query = document.getElementById('search-input').value;
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

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

  // Fetch data from the Google Pollen API 
  var apiKey = ''; // Temporaraily disabled 
  var pollen = "GRASS_UPI"; // Default pollen type
  var pollenLayer; 

  function updatePollenLayer() {
    if (pollenLayer) {
      map.removeLayer(pollenLayer); // Remove the previous pollen layer if it exists
    }

    // Create the tile layer with the appropriate pollen data
    const url = `https://pollen.googleapis.com/v1/mapTypes/${pollen}/heatmapTiles/{z}/{x}/{y}?key=${apiKey}`;
    console.log(`Fetching URL: ${url}`); 

    // Create the tile layer for pollen data
    pollenLayer = L.tileLayer(url, {
      attribution: 'Google Pollen Heatmap',
      opacity: 0.5,
      maxZoom: 15,  // Set maximum zoom level to 15 for pollen tiles
      noWrap: true,  // Ensure tiles are not wrapped around the world
      tileSize: 256,  // Default tile size
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