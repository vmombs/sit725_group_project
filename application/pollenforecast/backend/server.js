const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Load Google API Key from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Enable CORS
app.use(cors());

// Endpoint to fetch the 5-day pollen forecast
app.get("/api/forecast", async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/forecast`);
});
