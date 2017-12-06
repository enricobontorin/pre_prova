// require server, bodyparser, db, schema
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Assignment = require('./assignment');

// instantiate mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// instantiate express
const app = express();
// set our port
var port = process.env.PORT || 8080;
// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.json({ message: 'welcome to our api!' });
});

router.route('/assignment')
    // get all the assignments
    .get(function (req, res) {
        Assignment.find(function (err, assignments) {
            if (err) { res.send(err); }
            res.json(assignments);
        });
    });

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});
// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
