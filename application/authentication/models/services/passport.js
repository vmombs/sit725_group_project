const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../classes/User');

module.exports = function (passport) {

    passport.use('local',
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Invalid email' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid password' });
                }

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        })
    );

    // This function determines what user information gets stored in the session 
    // after successful authentication. It essentially "serializes" the user object 
    // into a simpler form, typically just the user ID.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // This function retrieves the full user object from the database based on 
    // the information stored in the session by serializeUser. It "deserializes" 
    // the session data back into a user object.
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};