var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/freelancer");

autoIncrement.initialize(connection);
// create a schema
var homeProject = new Schema({


    emp_username: {type: String},
    title: {type: String},
    description: {type: String},
    budget_range: {type: String},
    skills_req: {type: String},
    status: {type: String},
    complete_by: {type: String},
    filenames: {type: String},
    freelancer_username: {type: String},


});

homeProject.set('versionKey', false);

homeProject.plugin(autoIncrement.plugin,  { model: 'projects', field: 'project_id' });

module.exports = mongoose.model('projects', homeProject, 'projects');