const express = require('express');
const { registerRequest, registerVerification, login, registerWithFacebook, passwordreset, forgot, forgotreset } = require('../controllers/userController');
const userRouter = express.Router();

// User routes
userRouter.post('/register-request', registerRequest);
userRouter.post('/register-verification', registerVerification);
userRouter.post('/login', login);
userRouter.post('/password-reset', passwordreset);
userRouter.post('/password-forgot', forgot);
userRouter.post('/forgot-reset', forgotreset);

// Facebook login route
userRouter.post('/auth/facebook/register', registerWithFacebook);


const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          const token = jwt.sign({ userId: existingUser._id }, 'mysecretkey');
          done(null, token);
        } else {
          const user = {
            username: profile.displayName,
            email: profile.emails[0].value,
            accessToken,
          };

          // Handle the registration process for the new user
          registerWithFacebook({ body: user }, done);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Facebook login routes
// userRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// userRouter.get(
//   '/auth/facebook/callback',
//   passport.authenticate('facebook', { session: false }),
//   function (req, res) {
//     // Successful authentication, redirect or respond with the JWT token
//     const token = req.user;
//     res.redirect('http://localhost:3000/login?token=' + token);
//   }
// );


userRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

userRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = userRouter;
