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

module.exports = function (app, Issue) {
    app.route('/api/issues/:project')

        // Must be able to...
        // CHECK -view issues on a project
        // CHECK -view issues on a project with one filter
        // CHECK -view issues on a project with multiple filters
        .get(function (req, res) {
            let obj = {};

            // populate object with properties to search for
            obj.project_name = req.params.project;
            for (const property in req.query) {
                obj[property] = req.query[property];
            }

            Issue.find(obj)
                .select('-project_name -__v')
                .then((issues) => res.send(issues))
                .catch((error) => console.log(error));
        })

        // Must be able to...
        // CHECK -create an issue with every field
        // CHECK -create an issue with only required fields (title, text, created by)
        // CHECK -create an issue with missing required fields (error)
        .post(function (req, res) {
            let project = req.params.project;
            const title = req.body.issue_title;
            const text = req.body.issue_text;
            const creator = req.body.created_by;

            if (!title || !text || !creator) {
                res.send('error');
            }
            let date = new Date();

            const issue = new Issue({
                project_name: project,
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to,
                open: true,
                status_text: req.body.status_text,
                created_on: date,
                updated_on: date,
            });
            issue
                .save()
                .then((issue) => {
                    Issue.findOne({ _id: issue._id })
                        .select('-project_name -__v')
                        .then((issue) => res.send(issue));
                })
                .catch((error) => console.log(error));
        })

        // Must be able to...
        // CHECK -update one field on an issue
        // CHECK -update multiple fields on an issue
        // CHECK -update an issue with missing _id (error)
        // CHECK -update an issue with no fields to update (error)
        // CHECK -update an issue with an invalid _id (error)
        .put(function (req, res) {
            // Update issue
            Issue.findById(req.body._id)
                .select('-project_name -__v')
                .then((issue) => {
                    for (const property in req.body) {
                        if (req.body[property]) {
                            issue[property] = req.body[property];
                        }
                    }
                    issue.save().then((issue) => res.send(issue));
                })
                .catch((error) => res.json({ error: error.message }));
        })

        // Must be able to...
        // -delete an issue
        // -delete an issue with an invalid _id (error)
        // -delete an issue with missing _id (error)
        .delete(function (req, res) {
            let project = req.params.project;
        });
};
