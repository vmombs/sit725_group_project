// Load Google API Key from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Function to render the forecast page
exports.renderForecastPage = (req, res) => {
    res.render('forecast', { title: '5-Day Pollen Forecast' });
};

// Function to fetch the pollen forecast data
exports.getPollenForecast = async (latitude, longitude, axios) => {
    // Validate input
    if (!((latitude >= -90 && latitude <= 90) && (longitude >= -180 && longitude <= 180))) {
        throw new Error("Enter valid Latitude and Longitude");
    }

    try {
        const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=AIzaSyANWNr_rZKHj8hqKt8UP-M6hEIB_rw6zl4&location.latitude=${latitude}&location.longitude=${longitude}&days=5`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch pollen data. Please try again later.");
    }
};
