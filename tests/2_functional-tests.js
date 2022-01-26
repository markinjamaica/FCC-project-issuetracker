const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// all requests to /api/issues/{project}
suite('Functional Tests', function () {
    // 1. Create an issue with every field
    test('create an issue with every field', (done) => {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Problem',
                issue_text: 'its real bad',
                created_by: 'Mark',
                assigned_to: 'Someone Else',
                status_text: 'needs review',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 2. Create an issue with only required fields
    test('create an issue with only required fields', (done) => {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Another problem',
                issue_text: 'its real bad',
                created_by: 'Mark',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 3. Create an issue with missing required fields
    test('create an issue with missing required fields', (done) => {
        chai.request(server)
            .post('/api/issues/test')
            .send({
                issue_title: 'Only have a title',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"required field(s) missing"}');
                done();
            });
    });
    // 4. View issues on a project
    // 5. View issues on a project with one filter
    // 6. View issues on a project with multiple filters
    // 7. Update one field on an issue
    // 8. Update multiple fields on an issue
    // 9. Update an issue with missing _id
    // 10. Update an issue with no fields to update
    // 11. Update an issue with an invalid _id
    // 12. Delete an issue
    // 13. Delete an issue with an invalid _id
    // 14. Delete an issue with missing _id
});
