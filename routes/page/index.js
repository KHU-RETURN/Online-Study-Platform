const express = require('express'),
    router = express.Router(),
    userModel = require('../../models/users.js');

router.get('/', async function (req, res) {
    if (!req.session.user)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('after_login/index.html', { user: req.session.user });
    }
});

router.get('/accept_invitation', async function (req, res) {
    if (!req.session.user)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('accept_invitation/index.html', { user: req.session.user });
    }
});

router.get('/edit_group/:code', async function (req, res) {
    if (!req.session.user || !req.params.code)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('edit_group/index.html', { user: req.session.user });
    }
});

router.get('/make_group', async function (req, res) {
    if (!req.session.user)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('make_group/index.html', { user: req.session.user });
    }
});

router.get("/group", async function (req, res, next) {
    if (!req.session.user)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('check_group/index.html', { user: req.session.user });
    }
});

router.get("/user_setting", async function (req, res, next) {
    if (!req.session.user)
        res.render('before_login/index.html');
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render('user_set/index.html', { user: req.session.user });
    }
});


module.exports = router;