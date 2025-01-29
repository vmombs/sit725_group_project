const Medication = require('../../diary/models/Medication');
const Symptom = require('../../diary/models/Symptom');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

// [VM] Added this function to return the user object so it can be used for displaying the username

const getUser = async (req, res) => {

  const user = req.user;
  if (!req.user || !req.user.email) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
  }

  try {
    res.json({ statusCode: 200, user: user });
  }

  catch (error) {
    console.error('Failed to get symptoms:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  };
};

const getSymptoms = async (req, res) => {

  if (!req.user || !req.user.email) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
  }

  try {
    const allRecords = await Symptom.getRecords(req.user.email);
    console.log('Records:', allRecords);

    res.json({ statusCode: 200, data: allRecords });
  }

  catch (error) {
    console.error('Failed to get symptoms:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  };
};

const getMedications = async (req, res) => {

  if (!req.user || !req.user.email) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
  }

  try {
    const allRecords = await Medication.getRecords(req.user.email);
    console.log('Records:', allRecords);
    res.json({ statusCode: 200, data: allRecords });
  }

  catch (error) {
    console.error('Failed to get medication:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  };
};

async function loadModel() {
  const handler = tf.io.fileSystem("model/tfjs_model/model.json");
  const model = await tf.loadLayersModel(handler);
  console.log("Model loaded successfully");
  return model;
}

// TODO: real pollen input
const pollenInput = [ 0.30122508,  1.4705943,   0.28796168, -1.4553582,   0.8609464,   1.45584234,
  -1.46873242,  0.29142204,  1.47742723,  0.28215821, -1.46459973, -0.90322569,
   0.87851482,  0.88808203,  1.43907028, -0.87274583, 0.87912694];


function preprocessInput(input) {
  const pollenValues = Object.values(input);
  return tf.tensor([pollenValues]);
}

const getPredictions = async (req, res) => {

  const model = await loadModel();
  const processedInput = preprocessInput(pollenInput);

  const prediction = model.predict(processedInput);
  const predictionArray = await prediction.array();

  console.log("Predicted Symptoms & Medications:", predictionArray);

};

module.exports = {
  getSymptoms,
  getMedications,
  getUser,
  getPredictions,
};