const mysql = require('mysql');
const {promisify} = require('util'); // util from native nodejs library

const mysqlConfig = {
        host: 'stylishrds.ccwoewh3wew2.us-east-2.rds.amazonaws.com',
        user: 'loooffy',
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
