const forecastController = require('../controllers/forecastController');
const axios = require('axios');

jest.mock('axios'); // Mock axios for unit testing

describe('Forecast Controller', () => {
    const GOOGLE_API_KEY = 'test-key'; // Mock API Key
    const validLatitude = 40.7128;
    const validLongitude = -74.006;
    const invalidLatitude = 100;
    const invalidLongitude = 200;

    beforeAll(() => {
        process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;
    });

    test('should fetch pollen forecast data for valid coordinates', async () => {
        // Mock API response
        const mockResponse = { data: { forecast: 'sample forecast data' } };
        axios.get.mockResolvedValue(mockResponse);

        const result = await forecastController.getPollenForecast(validLatitude, validLongitude);
        expect(result).toEqual(mockResponse.data);
    });

    test('should throw an error for invalid latitude or longitude', async () => {
        await expect(forecastController.getPollenForecast(invalidLatitude, validLongitude))
            .rejects.toThrow("Enter valid Latitude and Longitude");

        await expect(forecastController.getPollenForecast(validLatitude, invalidLongitude))
            .rejects.toThrow("Enter valid Latitude and Longitude");
    });

    test('should throw an error when API request fails', async () => {
        // Mock API failure
        axios.get.mockRejectedValue(new Error("API error"));

        await expect(forecastController.getPollenForecast(validLatitude, validLongitude))
            .rejects.toThrow("Failed to fetch pollen data. Please try again later.");
    });
});
