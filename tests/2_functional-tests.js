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
    test('view issues on a project', (done) => {
        chai.request(server)
            .get('/api/issues/test')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 5. View issues on a project with one filter
    test('view project issues w/ 1 filter', (done) => {
        chai.request(server)
            .get('/api/issues/test?open=true')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 6. View issues on a project with multiple filters
    test('view project issues multiple filters', (done) => {
        chai.request(server)
            .get('/api/issues/test?open=true&assigned_to=fred')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 7. Update one field on an issue
    test('update one issue field', (done) => {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: '61f116af5e0b8e00c46e165d',
                issue_text: 'biiggg problem',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 8. Update multiple fields on an issue
    test('update multiple issue fields', (done) => {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                _id: '61f116af5e0b8e00c46e165d',
                issue_text: 'oh no',
                assigned_to: 'Wilbur',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            });
    });
    // 9. Update an issue with missing _id
    test('update an issue w/ missing _id', (done) => {
        chai.request(server)
            .put('/api/issues/test')
            .send({
                issue_text: 'hi',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"missing _id"}');
                done();
            });
    });
    // 10. Update an issue with no fields to update
    // 11. Update an issue with an invalid _id
    // 12. Delete an issue
    // 13. Delete an issue with an invalid _id
    // 14. Delete an issue with missing _id
});
