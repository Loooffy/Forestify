const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQAData = async (quiz_id) => {
    console.log(quiz_id)
    const results = await query('SELECT QA.*, student.id as owner_id, student.name as owner_name, v.total_vote from QA inner join quiz on quiz.id = QA.quiz_id inner join student as student on QA.owner_id = student.id inner join (select QA_id, sum(vote) as total_vote from votes group by QA_id) as v on QA.id = v.QA_id where quiz.id = ? order by QA.post_time DESC', [quiz_id])
    return {data: results}
    }

const postQ = async (data) => {
    console.log(data)
    const results = await query('INSERT INTO QA SET ?', [data])
    await query('INSERT INTO votes(giver_id, QA_id, vote, quiz_id) values(0, ?, 0, ?)', [results.insertId, data.quiz_id])
    return results
}

module.exports = {
    getQAData,
    postQ
}
