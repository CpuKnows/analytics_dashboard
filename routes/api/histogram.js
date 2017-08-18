var express = require('express');
var path = require('path');

var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(path.join(__dirname, '../../data/activity.db'));

/* GET home page. */
router.get('/', function(req, res, next) {
    db.serialize(function () {

        db.all('SELECT ' + req.query.variable + ', count(*) AS freq FROM activity GROUP BY ' + req.query.variable, [], function(err, rows) {
            //db.close();
            res.json(rows);
        });
    });
});

module.exports = router;
