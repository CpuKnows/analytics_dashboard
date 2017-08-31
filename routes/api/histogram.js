var express = require('express');
var path = require('path');

var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(path.join(__dirname, '../../data/activity.db'));

/* GET home page. */
router.get('/', function(req, res, next) {
    var apiString = '';

    if(req.query.start !== undefined && req.query.end !== undefined) {
        apiString = 'SELECT ' + groupbyVar + ', count(*) AS freq FROM activity' +
            ' WHERE date BETWEEN \'' + req.query.start + '\' AND \'' + req.query.end + '\' GROUP BY ' + groupbyVar;
    } else {
        apiString = 'SELECT ' + req.query.variable + ', count(*) AS freq FROM activity GROUP BY ' + req.query.variable;
    }

    db.serialize(function () {
        db.all(apiString, [], function(err, rows) {
            //db.close();
            res.json(rows);
        });
    });
});

module.exports = router;
