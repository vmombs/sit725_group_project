const express = require('express');
const router = express.Router();
const heatmapController = require('./heatmapController');

router.get('/', heatmapController.renderHeatmap);
router.post('/search', heatmapController.searchLocation);
router.post('/updatePollen', heatmapController.updatePollenLayer);

module.exports = router;