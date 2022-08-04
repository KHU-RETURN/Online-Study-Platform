const passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//localhost
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
  }, function (request, accessToken, refreshToken, profile, done) {
    //console.log('profile: ', profile);
    var user = profile;

    done(null, user);
  }
));

module.exports = passport;