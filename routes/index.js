var express = require('express');
var path = require('path');

var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(path.join(__dirname, '../data/activity.db'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

module.exports = router;
