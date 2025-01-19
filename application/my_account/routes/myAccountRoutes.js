const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/myAccountController');

router.get('/', myAccountController.myAccount);

module.exports = router;