const mysql = require('mysql');
const {promisify} = require('util'); // util from native nodejs library

const mysqlConfig = {
        host: '127.0.0.1',
        user: 'Loooffy',
        password: 'Loooffy11!',
        database: 'han_academy'
};

const mysqlCon = mysql.createConnection(mysqlConfig, true);

const promiseQuery = promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction = promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit = promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback = promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd = promisify(mysqlCon.end).bind(mysqlCon);

module.exports={
	core: mysql,
    query: promiseQuery,
    transaction: promiseTransaction,
    commit: promiseCommit,
    rollback: promiseRollback,
    end: promiseEnd,
};
