var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/sobre', function(req, res, next) {
  res.render('index');
});

router.get('/exposicoes', function(req, res, next) {
  res.render('index');
});

router.get('/contactos', function(req, res, next) {
  res.render('index');
});

router.get('/portfolio', function(req, res, next) {
  res.render('index');
});

router.get('/sobrepage', function(req, res, next) {
  res.render('sobre');
});

router.get('/exposicoespage', function(req, res, next) {
  res.render('exposicoes');
});

router.get('/contactospage', function(req, res, next) {
  res.render('contactos');
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage');
});

module.exports = router;
