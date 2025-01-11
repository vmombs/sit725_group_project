const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

router.get('/', (req, res) => {
    res.render('diary');
});

router.post('/add-medication', diaryController.addMedication);

module.exports = router;