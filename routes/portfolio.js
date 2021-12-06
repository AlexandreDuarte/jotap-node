var express = require('express');

var pool = require('../db/db');

var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obra WHERE id = $1', [req.query.id])
  
  res.render('imageoverlay', { obra: rows[0] });
});

router.get('/', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obra ORDER BY year FETCH FIRST 5 ROW ONLY;');

  res.render('portfolio', { obras: rows });

});

router.get('/griditems', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obra ORDER BY year OFFSET $1 FETCH FIRST 5 ROW ONLY;', [req.query.page]);

  res.render('griditem-batch', { obras: rows });

});



module.exports = router;
