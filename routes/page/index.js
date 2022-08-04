const express = require('express'),
    router = express.Router(),
    userModel = require('../../models/users.js');

router.get('/accept_invitation', async function (req, res) {
    if(!req.session.user)
        res.render('main/index.html');
    else{
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('accept_invitation/index.html', {user: req.session.user});
    }
});

router.get('/edit_group/:code', async function (req, res) {
    if(!req.session.user || !req.params.code)
        res.render('main/index.html');
    else{
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('edit_group/index.html', {user: req.session.user});
    }
});

router.get('/make_group', async function (req, res) {
    if(!req.session.user)
        res.render('main/index.html');
    else{
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('make_group/index.html', {user: req.session.user});
    }
});

module.exports = router;