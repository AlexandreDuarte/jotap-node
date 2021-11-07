var express = require('express');
var mongoose = require('mongoose');
var Obra = require('../models/obraschema');
var router = express.Router();


router.get('/', async function (req, res, next) {

  let obras = [];

  const cursor = Obra.find().cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    obras.push(doc);
  }

  res.render('portfolio', { obras: obras });
});

module.exports = router;
