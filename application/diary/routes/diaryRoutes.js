const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};


router.get('/', (req, res) => {
    res.render('diary');
});

router.post('/add-medication', ensureAuthenticated, (req, res) => {
    diaryController.addMedication(req, res)
});

router.post('/add-symptom', diaryController.addSymptom);

module.exports = router;