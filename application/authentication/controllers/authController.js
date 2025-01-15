const passport = require('passport');
const User = require('../models/classes/User');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/mailer');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();
        req.login(newUser, (err) => { 
            if (err) { return next(err); } 
            res.redirect('/'); 
        }); 
        
       // res.status(201).json({ message: 'Signup successful' }); 

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res, next) => {
    console.log("login called")
    try {
        passport.authenticate('local', function(err, user, info, status) {

            if (err) { return next(err) }

            if (!user) { return res.redirect('/auth/login') }

            // Handle successful login 
            console.log("Login Successful!");
            req.login(user, (err) => { 
                if (err) { return next(err); } 
                res.redirect('/'); 
            }); 
        })(req, res, next);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = (req, res, next) => {
    req.logout((err) => {  // Use Passport's logout method
      if (err) { 
        return next(err); 
      }
      res.redirect('/'); // Redirect to home page after logout
    });
  };

  const deleteAccount = async (req, res, next) => {
    try {
      const deletedAccount = await req.user.deleteAccount();

      res.redirect('/'); // Redirect to home page after deleting account

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  };

const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }

        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store the reset token and its expiration time in the user's document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Send a password reset email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({ message: 'Password reset email sent' }); 

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signup,
    login,
    logout, 
    forgotPassword,
    deleteAccount,
};