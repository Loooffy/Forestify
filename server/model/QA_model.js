const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQAData = async (quiz_id) => {
    console.log(quiz_id)
    const results = await query('SELECT QA.*, student.id as owner_id, student.name as owner_name from QA inner join quiz on quiz.id = QA.quiz_id inner join student as student on QA.owner_id = student.id where quiz.id = ?', [quiz_id])
    return {
        data: {
            QA_id: results[0].id,
            owner_id: results[0].owner_id,
            title: results[0].title,
            content: results[0].content,
            post_time: results[0].post_time,
            owner_name: results[0].owner_name,
            vote: results[0].vote
        }
    };
}

module.exports = {
    getQAData
}
