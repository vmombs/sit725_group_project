import sinon from 'sinon';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as forecastController from '../controllers/forecastController.js';
import axios from 'axios';

chai.use(chaiAsPromised);

describe('Forecast Controller', () => {
  const GOOGLE_API_KEY = 'test-key'; // Mock API Key
  const validLatitude = 40.7128;
  const validLongitude = -74.006;
  const invalidLatitude = 100;
  const invalidLongitude = 200;

  let mockAxios;

  before(() => {
    process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;
  });

  beforeEach(() => {
    mockAxios = {
      get() { return new Error("API error") }
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should fetch pollen forecast data for valid coordinates', async () => {
    // Mock API response
    const mockResponse = {
      data: "test"
    };
    mockAxios = {
      get(url) { return mockResponse }
    };

    const result = await forecastController.getPollenForecast(validLatitude, validLongitude, mockAxios);
    chai.expect(result).to.deep.equal(mockResponse.data);
  });

  it('should throw an error for invalid latitude or longitude', async () => {
    await chai.expect(forecastController.getPollenForecast(invalidLatitude, validLongitude, mockAxios))
      .to.be.rejectedWith("Enter valid Latitude and Longitude");

    await chai.expect(forecastController.getPollenForecast(validLatitude, invalidLongitude, mockAxios))
      .to.be.rejectedWith("Enter valid Latitude and Longitude");
  });

  it('should throw an error when API request fails', async () => {
    console.log(forecastController.getPollenForecast(validLatitude, validLongitude, mockAxios));

    await chai.expect(forecastController.getPollenForecast(validLatitude, validLongitude))
      .to.be.rejectedWith("Failed to fetch pollen data. Please try again later.");
  });
});
