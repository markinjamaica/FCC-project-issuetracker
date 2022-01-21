const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    // 1. Create an issue with every field
    // 2. Create an issue with only required fields
    // 3. Create an issue with missing required fields
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
