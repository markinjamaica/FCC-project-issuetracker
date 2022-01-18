'use strict';

// TODO: create project database, figure out schema...sub-schemas...

// Each PROJECT may have:
// multiple issues (object)

// Each ISSUE will have:
// _id (auto-created)
// issue_title (string)
// issue_text (string)
// created_on (date object)
// updated_on (date object)
// created_by (string)
// assigned_to (string)
// open (bool)
// status_text (string)

module.exports = function (app) {
    app.route('/api/issues/:project')

        // Must be able to...
        // -view issues on a project
        // -view issues on a project with one filter
        // -view issues on a project with multiple filters
        .get(function (req, res) {
            let project = req.params.project;
        })

        // Must be able to...
        // -create an issue with every field
        // -create an issue with only required fields (title, text, created by)
        // -create an issue with missing required fields (error)
        .post(function (req, res) {
            let project = req.params.project;
        })

        // Must be able to...
        // -update one field on an issue
        // -update multiple fields on an issue
        // -update an issue with missing _id (error)
        // -update an issue with no fields to update (error)
        // -update an issue with an invalid _id (error)
        .put(function (req, res) {
            let project = req.params.project;
        })

        // Must be able to...
        // -delete an issue
        // -delete an issue with an invalid _id (error)
        // -delete an issue with missing _id (error)
        .delete(function (req, res) {
            let project = req.params.project;
        });
};
