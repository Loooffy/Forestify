const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

async function getTopic() {
    let result = await query("select * from code_topic")
    return result
}

module.exports = {
    getTopic,
}
