const User = require('../../authentication/models/classes/User'); 

const myAccount = async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findById(req.user._id); 
        const userHistory = ["User Logs Here", "Still To Do"]; // sample only, to replace later
        res.render('my_account', { user, userHistory }); 
      } else {
        res.redirect('/login'); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Internal Server Error'); 
    }
  };

module.exports = {
    myAccount,
};