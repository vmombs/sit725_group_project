// heatmapController.js
const HeatmapModel = require('../models/heatmapModel');
const HeatmapView = require('../views/heatmapView');

class HeatmapController {
    constructor() {
        this.heatmapModel = new HeatmapModel();
        this.heatmapView = new HeatmapView();
        this.currentPollenType = 'GRASS_UPI'; // Default pollen type
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY; // Get API key from environment variables

    }

    renderHeatmapPage(req, res) {
        this.heatmapView.render(req, res);
    }

    searchLocation(map, query) { // Add map parameter
        this.heatmapModel.searchLocation(query)
            .then(location => {
                if (location) {
                    this.heatmapView.updateMapCenter(map, location.lat, location.lon, 13);
                } else {
                    this.heatmapView.showLocationNotFound(map);
                }
            })
            .catch(error => this.heatmapView.showSearchError(map, error));
    }

    setPollenType(map, pollenType) { // Add map parameter
        this.currentPollenType = pollenType;
        this.updatePollenLayer(map);
    }

    updatePollenLayer(map) { // Add map parameter
        this.heatmapModel.fetchPollenData(this.currentPollenType, this.apiKey)
            .then(url => {
                if (url) { // Only update if URL is valid (API key present)
                    this.heatmapView.updatePollenLayer(map, url);
                }
            })
            .catch(error => {
                this.heatmapView.showPollenError(map, error);
            });
    }

    // Initialize map and set up event listeners (called from client-side map.js)
    initialize(mapElement) {
        const map = this.heatmapView.initializeMap(mapElement);

        // Event listeners (using the map instance)
        document.getElementById('search-button').addEventListener('click', () => {
          const query = document.getElementById('search-input').value;
          this.searchLocation(map, query);
        });

        document.getElementById('button-1').addEventListener('click', () => this.setPollenType(map, 'GRASS_UPI'));
        document.getElementById('button-2').addEventListener('click', () => this.setPollenType(map, 'WEED_UPI'));
        document.getElementById('button-3').addEventListener('click', () => this.setPollenType(map, 'TREE_UPI'));

        if (this.apiKey) { // Only fetch pollen data if API key is available
            this.updatePollenLayer(map); // Initial pollen layer
        } else {
            console.warn("Google Maps API Key is missing. Pollen heatmap will not be displayed.");
        }

        return map; // Return the map instance for other uses if needed
    }
}

module.exports = HeatmapController;