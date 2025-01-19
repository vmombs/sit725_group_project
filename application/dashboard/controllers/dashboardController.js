const Medication = require('../../diary/models/Medication');
const Symptom = require('../../diary/models/Symptom');

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

module.exports = {
  getSymptoms,
  getMedications,
  getUser,
};