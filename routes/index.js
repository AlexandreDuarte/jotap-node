var express = require('express');
var pool = require('../db/db_local');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/about', function(req, res, next) {
    res.render('index');
});

router.get('/exhibitions', function(req, res, next) {
    res.render('index');
})

router.get('/portfolio', async function(req, res, next) {
    if (req.query.id) {
        const { rows } = await pool.query('SELECT * FROM obras WHERE id = $1', [req.query.id]);
        if (rows) res.render('index-image-id', { obra: rows[0], url: (new URL(req.url, `https://${req.headers.host}`)).href });
        return;
    }

    res.render('index');
});

router.get('/aboutpage', function(req, res, next) {
    res.render('sobre');
});

router.get('/exhibitionspage', function(req, res, next) {
    res.render('exposicoes');
});

router.get('/homepage', function(req, res, next) {
    res.render('homepage');
});

module.exports = router;