var express = require('express');
const { Pool } = require('pg');

const pool = new Pool();

var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {


  req.query.id;
  res.render('imageoverlay', { obra: obra });
});

router.get('/', async function (req, res, next) {

  let obras = [];

  await pool.query('SELECT * FROM obra;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      print(row);
      obras.push(row);
    }
  });


  res.render('portfolio', { obras: obras });
});



module.exports = router;
