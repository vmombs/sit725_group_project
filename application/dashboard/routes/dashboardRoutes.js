const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const medicationController = require('../controllers/medicationController');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

router.get('/', (req, res) => {
  res.render('dashboard');
});

router.get('/symptoms', ensureAuthenticated, dashboardController.getSymptoms);

router.get('/medications', ensureAuthenticated, dashboardController.getMedications);

router.get('/predictions', ensureAuthenticated, dashboardController.getPredictions);

router.get('/user', ensureAuthenticated, dashboardController.getUser);

// Pharmacy Medication Routes (new)
router.get('/medications/all', ensureAuthenticated, medicationController.getAllMedications); // Get all medications
router.get('/medications/:id', ensureAuthenticated, medicationController.getMedicationById); // Get medication by ID
router.post('/medications/updatePrice', ensureAuthenticated, medicationController.updateMedicationPrice); // Update medication price

module.exports = router;