/*globals require, module */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
    Student_ID: String,
    Assignment_ID: String,
    Assignment_Content: String,
    Assignment_Type: String
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
