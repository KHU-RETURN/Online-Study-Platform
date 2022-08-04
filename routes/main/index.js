const express = require('express'),
    router = express.Router(),
    userModel = require('../../models/users.js');

router.get('/', async function(req, res) {
    if(!req.session.user)
        res.render('main/index.html');
    else{
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('main/second.html', {user: req.session.user});
    }
});

module.exports = router;