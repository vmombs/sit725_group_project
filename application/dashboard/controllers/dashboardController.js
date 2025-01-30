const Medication = require('../../diary/models/Medication');
const Symptom = require('../../diary/models/Symptom');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

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
const pollenInput = [1, 2, 4, 3, 3, 5, 4, 2, 1, 0, 1, 2, 4, 4, 0, 0, 0];

const mean = JSON.parse(fs.readFileSync('model/scaler_mean.json', 'utf8'));
const std = JSON.parse(fs.readFileSync('model/scaler_std.json', 'utf8'));

function scaleData(input) {
  return input.map((value, index) => (value - mean[index]) / std[index]);
}

function preprocessInput(input) {
  const pollenValues = Object.values(input);
  const scaledValues = scaleData(pollenValues);
  return tf.tensor([scaledValues]);
}

const getPredictions = async (req, res) => {
  try {

    const model = await loadModel();
    const processedInput = preprocessInput(pollenInput);

    const prediction = model.predict(processedInput);
    const predictionArray = await prediction.array();

    console.log("Raw Predicted Symptoms & Medications:", predictionArray);

    predictionData = {
      symptoms: {
        congestion: Math.round(predictionArray[0][0]),
        watery_eyes: Math.round(predictionArray[0][1]),
        itchy_eyes: Math.round(predictionArray[0][2]),
        sinus_pressure: Math.round(predictionArray[0][3]),
        sneezing: Math.round(predictionArray[0][4]),
      },
      medications: {
        azelastine: Math.round(predictionArray[0][5]),
        ketotifen: Math.round(predictionArray[0][6]),
        olopatadine: Math.round(predictionArray[0][7]),
        cetirizine: Math.round(predictionArray[0][8]),
        loratadine: Math.round(predictionArray[0][9]),
        fexofenadine: Math.round(predictionArray[0][10]),
        desloratadine: Math.round(predictionArray[0][11]),
        mometasone: Math.round(predictionArray[0][12]),
        fluticasone: Math.round(predictionArray[0][13]),
        ciclesonide: Math.round(predictionArray[0][14]),
        loteprednol: Math.round(predictionArray[0][15]),
        prednisolone_1: Math.round(predictionArray[0][16]),
        prednisolone_2: Math.round(predictionArray[0][17]),
        methylprednisolone: Math.round(predictionArray[0][18]),
      }
    }

    res.json({ statusCode: 200, data: predictionData });
  }

  catch (error) {
    console.error('Failed to make a prediction:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }

};

module.exports = {
  getSymptoms,
  getMedications,
  getUser,
  getPredictions,
};