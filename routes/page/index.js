const express = require('express'),
    router = express.Router();

router.get('/accept_invitation', function (req, res, next) {
    res.render('accept_invitation/index.html', { title: 'main' })
});

router.get('/edit_group', function (req, res, next) {
    res.render('edit_group/index.html', { title: 'main' })
});

router.get('/make_group', function (req, res, next) {
    res.render('make_group/index.html', { title: 'main' })
});

module.exports = router;