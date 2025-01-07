const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', (req, res) => {
  const userData = {
    username: "Sneezel",
    email: "sneezer@sneezl.org",
  };

  const dashboardData = {
    symptoms: [
      { name: "Mild Sneezing", image: "sneezing.jpg" },
      { name: "Severe Congestion", image: "congestion.jpg" },
      { name: "Mild Watery Eyes", image: "watery-eyes.jpg" },
    ],

    antihistamines: [
      { name: "Zyrtec (20mg)", image: "zyrtec.jpg" },
      { name: "Claritin", image: "claritin.jpg" },
      { name: "Allegra", image: "allegra.jpg" },
    ],
  };

  res.render('dashboard', { user: userData, data: dashboardData });
});

module.exports = router;