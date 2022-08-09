
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
    res.render('main/index.html');
});

module.exports = router;