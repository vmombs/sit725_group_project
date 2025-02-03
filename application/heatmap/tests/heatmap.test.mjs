
import axios  from 'axios';
import { expect }  from 'chai';


// Sample tests for Google Pollen heatmap tile retrieval
describe('Google Pollen Heatmap Tiles API', function () {
  
  const apiKey = process.env.GOOGLE_API_KEY || '';;
  const baseURL = 'https://pollen.googleapis.com/v1/mapTypes';
  const bounds = {
    z: 10,
    x: 123, 
    y: 456, 
  };

  // Test for the GRASS_UPI pollen layer
  it.skip('should fetch GRASS_UPI heatmap tiles successfully', async function () {
    const pollenType = 'GRASS_UPI';
    const url = `${baseURL}/${pollenType}/heatmapTiles/${bounds.z}/${bounds.x}/${bounds.y}?key=${apiKey}`;
    
    const response = await axios.get(url);
    expect(response.status).to.equal(200); 
    expect(response.data).to.be.an('object'); 
    
  });

  // Test for the TREE_UPI pollen layer
  it.skip('should fetch TREE_UPI heatmap tiles successfully', async function () {
    const pollenType = 'TREE_UPI';
    const url = `${baseURL}/${pollenType}/heatmapTiles/${bounds.z}/${bounds.x}/${bounds.y}?key=${apiKey}`;

    const response = await axios.get(url);
    expect(response.status).to.equal(200); 
    expect(response.data).to.be.an('object'); 
  });

  // Test for the WEED_UPI pollen layer
  it.skip('should fetch WEED_UPI heatmap tiles successfully', async function () {
    const pollenType = 'WEED_UPI';
    const url = `${baseURL}/${pollenType}/heatmapTiles/${bounds.z}/${bounds.x}/${bounds.y}?key=${apiKey}`;

    const response = await axios.get(url);
    expect(response.status).to.equal(200); 
    expect(response.data).to.be.an('object'); 
  });

  // Negative test: Invalid pollen type
  it.skip('should return an error for an invalid pollen type', async function () {
    const invalidPollenType = 'INVALID_TYPE';
    const url = `${baseURL}/${invalidPollenType}/heatmapTiles/${bounds.z}/${bounds.x}/${bounds.y}?key=${apiKey}`;

    try {
      await axios.get(url);
      throw new Error('Request should have failed');
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 404]); 
    }
  });
});


