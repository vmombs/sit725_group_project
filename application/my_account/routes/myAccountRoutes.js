const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/myAccountController');

router.get('/', (req, res) => {
    // Sample user data only (to replace with actual data from the database)
    const userData = {
        username: "Sneezer",
        email: "sneezer@sneezl.org",
        userHistory: ["User Logs Here", "Still To Do"], // sample only, to replace later
    };
    res.render('my_account', userData); // Render the view and send user data
});

module.exports = router;