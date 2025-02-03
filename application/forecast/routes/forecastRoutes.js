const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const axios = require('axios');

// Route to render the forecast page
router.get('/', forecastController.renderForecastPage);

// Endpoint to fetch the 5-day pollen forecast
router.get('/api', async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const forecastData = await forecastController.getPollenForecast(latitude, longitude, axios);
        res.json(forecastData); // Send the API response to the client
    } catch (error) {
        console.error("Error fetching pollen data:", error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
