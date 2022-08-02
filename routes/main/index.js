const express = require('express'),
    router = express.Router();

router.get('/', async function (req, res) {
    res.render('main/index.html');
});

module.exports = router;