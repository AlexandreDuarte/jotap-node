var express = require('express');

var pool = require('../db/db');

var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obra WHERE id = $1', [req.query.id])
  
  res.render('imageoverlay', { obra: rows[0] });
});

router.get('/', async function (req, res, next) {

  let qfilter = "";

  const query;

  if (req.query.filter) {
    if (req.query.filter === "other") {
      qfilter = "WHERE category != 'canvas' AND category != 'murals'";
    } else {
      qfilter = "WHERE category = '" + req.query.filter + "'";
    }
    query = await pool.query('SELECT * FROM obra $1 ORDER BY year FETCH FIRST 5 ROW ONLY;', [qfilter]);
  }
  
  const { rows } = query;

  res.render('portfolio', { obras: rows });

});

router.get('/griditems', async function (req, res, next) {

  let qfilter = "";

  const query;

  if (req.query.filter) {
    if (req.query.filter === "other") {
      qfilter = "WHERE category != 'canvas' AND category != 'murals'";
    } else {
      qfilter = "WHERE category = '" + req.query.filter + "'";
    }
    query = await pool.query('SELECT * FROM obra $1 ORDER BY year FETCH FIRST 5 ROW ONLY;', [qfilter]);
  }
  
  const { rows } = query;

  if (rows) {
    res.render('griditem-batch', { obras: rows });
  } else {
    res.send('');
  }

});



module.exports = router;
