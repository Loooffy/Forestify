const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQAData = async (qid) => {
    let QAQ = 
        `
            SELECT 
                QA.*,
                student.id AS owner_id,
                student.name AS owner_name,
                v.total_vote
            FROM
                QA
                    INNER JOIN
                quiz ON quiz.id = QA.quiz_id
                    INNER JOIN
                student AS student ON QA.owner_id = student.id
                    INNER JOIN
                (SELECT 
                    QA_id, SUM(vote) AS total_vote
                FROM
                    votes
                GROUP BY QA_id) AS v ON QA.id = v.QA_id
            WHERE
                quiz.id = ?
            ORDER BY QA.post_time DESC
        `

    const results = await query(QAQ, [qid])
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
