const express = require('express'),
  router = express.Router(),
  passport = require('../../config/passport.js'),
  userModel = require('../../models/users.js'),
  imageToBase64 = require('image-to-base64');

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google/callback',
  passport.authenticate('google'), authSuccess
);

async function authSuccess(req, res) {
  const alreadyUser = await userModel.findOne({ id: req.user.id });
  const image = await imageToBase64(req.user.photos[0].value);
  if (alreadyUser == null) await userModel({
    id: req.user.id,
    displayName: req.user.displayName,
    photos: image,
    groups: {
      id: "62eb35a0e5c95b341ff322f9",
      owner: true,
    }
  }).save();
  var dbUser = await userModel.findOne({ id: req.user.id });
  req.session.user = dbUser;
  res.redirect('/');
}

module.exports = router;