const express = require('express'),
  router = express.Router(),
  passport = require('../../config/passport.js'),
  userModel = require('../../models/users.js'),
  groupModel = require('../../models/groups.js'),
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
  if (alreadyUser == null) {
    await userModel({
      id: req.user.id,
      displayName: req.user.displayName,
      photos: image,
    }).save();
    // -------------- test 그룹 --------------
    var user = await userModel.findOne({ id: req.user.id });
    var group = await groupModel.findOne({ _id: "62eb35a0e5c95b341ff322f9" });
    group.groupMember.push({ id: user.id });
    await groupModel.findByIdAndUpdate("62eb35a0e5c95b341ff322f9", group);

    user.groups.push({ id: "62eb35a0e5c95b341ff322f9", owner: false, });
    await userModel.findOneAndUpdate({ id: req.user.id }, user);
    // -------------------------------------
  }
  var dbUser = await userModel.findOne({ id: req.user.id });
  req.session.user = dbUser;
  res.redirect('/');
}

module.exports = router;