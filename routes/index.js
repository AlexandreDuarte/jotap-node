var express = require('express');
var pool = require('../db/db');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/about', function(req, res, next) {
    res.render('index');
});

router.get('/expositions', function(req, res, next) {
    res.render('index');
})

router.get('/portfolio', async function(req, res, next) {
    if (req.query.id) {
        try {
            const { rows } = await pool.query('SELECT * FROM obras WHERE id = $1', [req.query.id]);
            if (rows) {
                res.render('index-image-id', { obra: rows[0], url: (new URL(req.url, `https://${req.headers.host}`)).href });
            }
        } catch(err) {
            res.render('index');
        }
        return;
    }
    res.render('index');
    
});

router.get('/aboutpage', function(req, res, next) {
    res.render('about');
});

router.get('/expositionspage', function(req, res, next) {
    res.render('expositions');
});

router.get('/homepage', function(req, res, next) {
    res.render('homepage');
});

module.exports = router;