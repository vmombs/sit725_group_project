const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup page
});

router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); // Render the forgot password view
});

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;