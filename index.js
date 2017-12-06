// require server, bodyparser, db, schema
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Assignment = require('./assignment');

// instantiate express
const app = express();

// instantiate mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds159344.mlab.com:59344/test_db96');
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

// set our port
var port = process.env.PORT || 8080;
// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.json({ message: 'welcome to our api!' });
});

router.route('/assignments')
    // get all the assignments
    .get(function (req, res) {
        Assignment.find(function (err, assignments) {
            if (err) { res.send(err); }
            res.json(assignments);
        });
    })
    .post(function (req, res) {
        // create a new instance of the Bear model
        var assign = new Assignment();
        // set the bears name (comes from the request)
        assign.Assignment_ID = req.body.Assignment_ID;
        assign.Student_ID = req.body.Student_ID;
        assign.Assignment_Content = req.body.Assignment_Content;
        assign.Assignment_Type = req.body.Assignment_Type;
        // save the bear and check for errors
        assign.save(function (err) {
            if (err) { res.send(err); }
            res.json(assign);
        });

    });
    // route /assignments/assignment
router.route('/assignments/:assignment_id')

    // get the assignment with that id
    .get(function (req, res) {
        var query = {};
        query.Assignment_ID = req.params.assignment_id;
        Assignment.find(query, function (err, assignment) {
            if (err) { res.send(err); }
            res.json(assignment);
        });
    })

    // update the assignment with this id
    .put(function (req, res) {
        // use our bear model to find the bear we want
        var query = {};
        query.Assignment_ID = req.params.assignment_id;
        Assignment.find(query, function (err, assign) {
            if (err) { res.send(err); }
            // update the assignment content
            assign.Assignment_Content = req.body.Assignment_Content;
            assign.Assignment_Type = req.body.Assignment_Type;
            // save the change
            assign.save(function (err) {
                if (err) { res.send(err); }
                res.json({ message: 'Successfully modified'});
            });

        });
    })

    // delete the assignment with this id
    .delete(function (req, res) {
        Assignment.remove({
            Assignment_ID: req.params.assignment_id
        }, function (err, assignment) {
            if (err) { res.send(err); }
            res.json({ message: 'Successfully deleted' });
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
