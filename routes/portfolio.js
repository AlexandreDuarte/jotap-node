var express = require('express');
var mongoose = require('mongoose');
var Obra = require('../models/obraschema');
var router = express.Router();

router.get('/imageoverlay', async function (req, res, next) {
  let obra = await Obra.findById({ _id: req.query.id }).exec();
  res.render('imageoverlay', { obra: obra });
});

router.get('/', async function (req, res, next) {

  let obras = [];

  const cursor = Obra.find().cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    obras.push(doc);
  }

  res.render('portfolio', { obras: obras });
});



module.exports = router;
