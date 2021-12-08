var express = require('express');

var pool = require('../db/db');

var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obra WHERE id = $1', [req.query.id])
  
  res.render('imageoverlay', { obra: rows[0] });
});

router.get('/', async function (req, res, next) {

  let qfilter = "";

  if (req.query.filter) {
    if (req.query.filter === "other") {
      const { rows } = await pool.query('SELECT * FROM obra WHERE category!=$1::text AND category!=$2::text ORDER BY year FETCH FIRST 5 ROW ONLY;', ['canvas', 'mural']);
      console.log(rows);
      res.render('portfolio', { obras: rows });
    } else {
      qfilter = req.query.filter;
      const { rows } = await pool.query('SELECT * FROM obra WHERE category=$1::text ORDER BY year FETCH FIRST 5 ROW ONLY;', [qfilter]);
      console.log(rows);
      res.render('portfolio', { obras: rows });
    }
    
  } else {
    const { rows } = await pool.query('SELECT * FROM obra ORDER BY year FETCH FIRST 5 ROW ONLY;');
    console.log(rows);
    res.render('portfolio', { obras: rows });
  }



});

router.get('/griditems', async function (req, res, next) {

  let qfilter = "";

  if (req.query.filter) {
    if (req.query.filter === "other") {
      const { rows } = await pool.query('SELECT * FROM obra WHERE category!=$1::text AND category!=$2::text ORDER BY year OFFSET $3 FETCH FIRST 5 ROW ONLY;', ['canvas', 'murals', req.query.page]);
      console.log(rows);
      if (rows) {
        res.render('griditem-batch', { obras: rows });
      } else {
        res.send('');
      }
    } else {
      qfilter = req.query.filter;
      const { rows } = await pool.query('SELECT * FROM obra WHERE category=$1::text ORDER BY year OFFSET $2 FETCH FIRST 5 ROW ONLY;', [qfilter, req.query.page]);
      console.log(rows);
      if (rows) {
        res.render('griditem-batch', { obras: rows });
      } else {
        res.send('');
      }
    }
    
  } else {
    const { rows } = await pool.query('SELECT * FROM obra ORDER BY year OFFSET $1 FETCH FIRST 5 ROW ONLY;', [req.query.page]);
    console.log(rows);
    if (rows) {
      res.render('griditem-batch', { obras: rows });
    } else {
      res.send('');
    }
  }


  

});



module.exports = router;
