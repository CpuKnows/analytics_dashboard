var express = require('express');
var path = require('path');

var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(path.join(__dirname, '../data/activity.db'));

/* GET home page. */
router.get('/', function(req, res, next) {
    var apiString = '';

    if(req.query.variable === undefined || req.query.variable === '') {
        groupbyVar = 'id';
    } else {
        groupbyVar = req.query.variable;
    }

    if(req.query.start !== undefined && req.query.end !== undefined && req.query.start !== '' && req.query.end !== '') {
        apiString = 'SELECT ' + groupbyVar + ', count(*) AS freq FROM activity' +
            ' WHERE date BETWEEN \'' + req.query.start + '\' AND \'' + req.query.end + '\' GROUP BY ' + groupbyVar;
    } else {
        apiString = 'SELECT ' + groupbyVar + ', count(*) AS freq FROM activity GROUP BY ' + groupbyVar;
    }

    db.serialize(function () {
        db.all(apiString, [], function(err, rows) {
            //db.close();
            res.render('index', {histogramJson: rows,
                                 groupbyVar: req.query.variable});
        });
    });
});

module.exports = router;
