const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');

router.get('/', (req, res) => {
    res.render('heatmap');
});

module.exports = router;