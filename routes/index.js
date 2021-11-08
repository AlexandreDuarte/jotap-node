var express = require('express');
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

router.get('/portfolio', function(req, res, next) {
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
