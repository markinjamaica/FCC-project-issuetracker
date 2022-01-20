const mongoose = require('mongoose');

module.exports = () => {
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

    return [Project, Issue];
};
