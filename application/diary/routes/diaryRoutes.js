const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/diaryController');

router.get('/', (req, res) => {
    res.render('diary');
});

module.exports = router;