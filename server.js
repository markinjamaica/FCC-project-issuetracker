'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongoose = require('mongoose');

let app = express();

// Connect to database
mongoose.connect(process.env['MONGO_URI']);

// Define schemas
const { Schema, model } = mongoose;

const issueSchema = new Schema({
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String,
});

const projectSchema = new Schema({
    issues: [issueSchema],
});

// Define models
const Project = model('Project', projectSchema);
const Issue = model('Issue', issueSchema);

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
    res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
            } catch (e) {
                console.log('Tests are not valid:');
                console.error(e);
            }
        }, 3500);
    }
});

module.exports = app; //for testing
