'use strict';

module.exports = function (app, Issue) {
    app.route('/api/issues/:project')

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
                status_text: req.body.status_text || '',
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
                        // update values
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

        .delete(function (req, res) {
            const id = req.body._id;
            if (!id) {
                return res.json({ error: 'missing _id' });
            }

            Issue.findById(id)
                .deleteOne()
                .then((object) => {
                    if (object.deletedCount !== 1) {
                        throw new Error('Not deleted');
                    }
                    res.json({
                        result: 'successfully deleted',
                        _id: id,
                    });
                })
                .catch((error) =>
                    res.json({ error: 'could not delete', _id: id })
                );
        });
};
