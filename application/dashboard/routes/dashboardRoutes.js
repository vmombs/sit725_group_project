const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

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


router.get('/user', ensureAuthenticated, dashboardController.getUser);

module.exports = router;