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
                return res.json({ error: 'required field(s) missing' });
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

        // TODO: change responses <---------------------------------
        .put(function (req, res) {
            const id = req.body._id;

            // Check for missing id
            if (!id) {
                return res.json({ error: 'missing _id' });
            }

            // Update issue
            Issue.findById(id)
                .select('-project_name -__v')
                .then((issue) => {
                    let propValues = 0;
                    for (const property in req.body) {
                        if (req.body[property] !== '' && property !== '_id') {
                            issue[property] = req.body[property];
                            propValues++;
                        }
                    }

                    // Check if no properties updated
                    if (propValues === 0) {
                        return res.json({
                            error: 'no update field(s) sent',
                            _id: id,
                        });
                    }

                    issue.save().then((issue) =>
                        res.json({
                            result: 'successfully updated',
                            _id: issue._id,
                        })
                    );
                })
                .catch((error) =>
                    res.json({ error: 'could not update', _id: id })
                );
        })

        // Must be able to...
        // CHECK -delete an issue
        // CHECK -delete an issue with an invalid _id (error)
        // CHECK -delete an issue with missing _id (error)
        .delete(function (req, res) {
            let project = req.params.project;

            Issue.deleteOne({ _id: req.body._id })
                .select('-project_name -__v')
                .then(() =>
                    res.json({
                        result: 'successfully deleted',
                        _id: req.body._id,
                    })
                )
                .catch((error) => res.json({ error: error.message }));
        });
};
