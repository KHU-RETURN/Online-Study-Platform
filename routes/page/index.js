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
        const { id } = req.query;
        req.session.groupId = id;
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

router.get("/todo", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("todo/index.html", { user: req.session.user });
    }
});

router.get("/schedule", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("schedule/index.html", { user: req.session.user });
    }
});

router.get("/chat", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("chat/index.html", { user: req.session.user });
    }
});

router.get("/storage", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("storage/index.html", { user: req.session.user });
    }
});

router.get("/storage_detail", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("storage_detail/index.html", { user: req.session.user });
    }
});

router.get("/fine", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("fine/index.html", { user: req.session.user });
    }
});

router.get("/goal", async function (req, res, next) {
    if (!req.session.user) res.render("before_login/index.html");
    else {
        var dbUser = await userModel.findOne({ id: req.session.user.id });
        req.session.user = dbUser;
        res.render("goal/index.html", { user: req.session.user });
    }
});


module.exports = router;