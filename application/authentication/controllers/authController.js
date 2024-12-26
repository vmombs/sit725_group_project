const passport = require('passport');
const User = require('../models/classes/User');

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

        res.status(201).json({ message: 'Signup successful' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res, next) => {
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

        // Send a password reset email (implement email sending logic here)
        // ... (send email with reset link: `http://your-domain/reset-password/${resetToken}`)

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
};