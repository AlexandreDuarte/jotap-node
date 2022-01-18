var express = require('express');

var pool = require('../db/db');

var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {

  const { rows } = await pool.query('SELECT * FROM obras WHERE id = $1', [req.query.id])
  
  res.render('imageoverlay', { obra: rows[0] });
});

router.get('/', async function (req, res, next) {

  let qfilter = "";

  if (req.query.id) {
    const { rows } = await pool.query('SELECT * FROM obras WHERE id = $1', [req.query.id])
    res.render('imageoverlay', { obra: rows[0] });
  } 

  if (req.query.filter) {
    if (req.query.filter === "other") {
      const { rows } = await pool.query('SELECT * FROM obras WHERE category!=$1::text AND category!=$2::text ORDER BY year DESC, id DESC FETCH FIRST 5 ROW ONLY;', ['canvas', 'mural']);
      
      res.render('portfolio', { obras: rows, activefilter: [false, false, false, true] });
    } else {
      qfilter = req.query.filter;
      const { rows } = await pool.query('SELECT * FROM obras WHERE category=$1::text ORDER BY year DESC, id DESC FETCH FIRST 5 ROW ONLY;', [qfilter]);
      
      res.render('portfolio', { obras: rows, activefilter: [false, qfilter === "canvas", qfilter === "mural", false] });
    }
    
  } else {
    const { rows } = await pool.query('SELECT * FROM obras ORDER BY year DESC, id DESC FETCH FIRST 5 ROW ONLY;');
    
    res.render('portfolio', { obras: rows, activefilter: [true, false, false, false] });
  }



});

router.get('/griditems', async function (req, res, next) {

  let qfilter = "";

  if (req.query.filter) {
    if (req.query.filter === "other") {
      const { rows } = await pool.query('SELECT * FROM obras WHERE category!=$1::text AND category!=$2::text ORDER BY year DESC, id DESC OFFSET $3 FETCH FIRST 5 ROW ONLY;', ['canvas', 'mural', req.query.page]);
      
      if (rows) {
        res.render('griditem-batch', { obras: rows });
      } else {
        res.send('');
      }
    } else {
      qfilter = req.query.filter;
      const { rows } = await pool.query('SELECT * FROM obras WHERE category=$1::text ORDER BY year DESC, id DESC OFFSET $2 FETCH FIRST 5 ROW ONLY;', [qfilter, req.query.page]);
      
      if (rows) {
        res.render('griditem-batch', { obras: rows });
      } else {
        res.send('');
      }
    }
    
  } else {
    const { rows } = await pool.query('SELECT * FROM obras ORDER BY year DESC, id DESC OFFSET $1 FETCH FIRST 5 ROW ONLY;', [req.query.page]);
    
    if (rows) {
      res.render('griditem-batch', { obras: rows });
    } else {
      res.send('');
    }
  }


  

});



module.exports = router;
