var express = require('express');
var path = require('path');

var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(path.join(__dirname, '../data/activity.db'));

//var chart = require('../public/javascripts/create_chart.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});

  /*db.serialize(function () {

      db.all('SELECT platform, count(*) AS freq FROM activity GROUP BY platform', [], function(err, rows) {
          console.log(rows);
          rows.forEach(function (row) {
              console.log(row.platform + ': ' + row.freq);
          });
          db.close();

          //res.json(rows);
          //var sF = rows.map(function(d) {return [d.platform, d.freq];});
          //chart.dashboard('#dashboard', sF);
      });
  });*/
});

module.exports = router;
