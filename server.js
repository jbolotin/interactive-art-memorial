'use strict';

const express = require('express');
const app = express();
const engine = require('ejs-locals');
const getPixels = require("get-pixels");
const path = require('path');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('views'));

app.get('/', function (req, res) {
  res.render('photo-art');
})

app.get('/pixels/:filename', function (req, res) {
  let filename = req.params.filename;
  getPixels("views/images/" + filename, function(err, pixels) {
    if(err) {
      console.log("Bad image path");
      return;
    }
    res.status('200').send(JSON.stringify(pixels));
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
