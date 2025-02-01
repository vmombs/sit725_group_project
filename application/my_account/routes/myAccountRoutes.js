const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/myAccountController');

router.get('/', myAccountController.myAccount);

router.get('/export-history', myAccountController.exportHistory);

module.exports = router;