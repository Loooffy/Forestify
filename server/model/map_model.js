const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getTree = async (user_id) => {
    let treeQ = 'SELECT code, amount, xy, text FROM tree where user_id = ?'
    const results = await query(treeQ, [user_id])
    console.log(results)
    return results
}

const postTree = async (user_id, code, correct) => {

    console.log('model', user_id)

    let treeQ = ''

    if (correct === 1) {
        treeQ = 
        `
            insert into tree(user_id, code)
                values(?, ?)
            on duplicate key update
                amount = amount + 1
        `
    } else {
        treeQ = 
        `
            insert into tree(user_id, code)
                values(?, ?)
            on duplicate key update
                amount = amount - 1
        `
    }

    let result = await query(treeQ, [user_id, code])
    return result
}

const postMap = async (user_id, code, xy, text) => {
    console.log(user_id, code, xy, text)
    let mapQ = 
        `
            insert into tree(user_id, code, amount,  xy, text) 
                values(?, ?, 0, ?, ?)
        `
    let result = await query(mapQ, [user_id, code, xy, text])
    return result
}

module.exports = {
    getTree,
    postTree,
    postMap,
}
