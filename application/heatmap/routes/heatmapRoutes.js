const express = require('express');
const router = express.Router();
const heatmapController = require('../controllers/heatmapController');

router.get('/', (req, res) => {
    res.render('heatmap');
});


router.get('/heatmap', heatmapController.initMap);
router.post('/searchLocation', heatmapController.searchLocation);
router.post('/updatePollenLayer', heatmapController.updatePollenLayer);

module.exports = router;