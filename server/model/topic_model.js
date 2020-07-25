const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

async function getTopic(topic1, topic2) {
    let code = `${topic1}${topic2}`
    let result = await query("select * from category where code like concat('%', ?, '%')", [code])
    console.log(result)
    return result
}

module.exports = {
    getTopic,
}
