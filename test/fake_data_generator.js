require('dotenv').config();
const {NODE_ENV} = process.env;
const {
    students,
} = require('./fake_data');
const {transaction, commit, query, end} = require('../util/mysqlcon.js');

function _createFakeStudents() {
    return query('INSERT INTO students (email, password, name) VALUES ?', [students]);
}

function createFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    return createFakeStudents()
        .catch(console.log);
}

function truncateFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    console.log('truncate fake data');
    const setForeignKey = (status) => {
        return query('SET FOREIGN_KEY_CHECKS = ?', status);
    };

    const truncateTable = (table) => {
        return query(`TRUNCATE TABLE ${table}`);
    };

    return setForeignKey(0)
        .then(truncateTable('student'))
        .then(setForeignKey(1))
        .catch(console.log);
}

function closeConnection() {
    return end();
}

// execute when called directly.
if (require.main === module) {
    console.log('main');
    truncateFakeData()
        .then(createFakeData)
        .then(closeConnection);
}

module.exports = {
    createFakeData,
    truncateFakeData,
    closeConnection,
};
