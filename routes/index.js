var express = require('express');
var pool = require('../db/db');
var router = express.Router();

const renderIndex = (request, response) => {
    if (new URL(request.url, `http://${request.headers.host}`).hash === "en") {
        response.render('index', { lang: "en" });
    } else {
        response.render('index', { lang: "pt" });
    }
}

router.get('/', renderIndex);

router.get('/about', renderIndex);

router.get('/expositions', renderIndex);

router.get('/portfolio', async function(req, res, next) {
    if (req.query.id) {
        try {
            const { rows } = await pool.query('SELECT * FROM obras WHERE id = $1', [req.query.id]);
            if (rows) {
                res.render('index-image-id', { obra: rows[0], url: (new URL(req.url, `https://${req.headers.host}`)).href });
            }
        } catch (err) {
            renderIndex(req, res);
        }
        return;
    }
    renderIndex(req, res);

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