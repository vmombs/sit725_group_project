const express = require('express');
const router = express.Router();
const axios = require("axios");

// Load Google API Key from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/', (req, res) => {
    res.render('forecast');
});

// Endpoint to fetch the 5-day pollen forecast
router.get("/api", async (req, res) => {
  const { latitude, longitude } = req.query;
  console.log('longitude = ',longitude)
  console.log('latitude = ',latitude)
  // Validate input
  if (!((latitude >= -90 && latitude <= 90) && (longitude >=-180 && longitude <=180))) {
    return res.status(400).json({ error: "Enter valid Latitude and Longtitude" });
  }

  try {
    const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyANWNr_rZKHj8hqKt8UP-M6hEIB_rw6zl4&location.latitude=${latitude}&location.longitude=${longitude}&days=5`;
    console.log("Request URL:", url);
    const response = await axios.get(url);
    console.log('Backend response',response.data)
    res.json(response.data); // Send the API response to the client
  } catch (error) {
    console.error("Error fetching pollen data:", error.message);
    res.status(500).json({ error: "Failed to fetch pollen data. Please try again later." });
  }
});

module.exports = router;