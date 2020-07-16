const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getVote = async (owner_id) => {
    const results = await query('INSERT INTO votes * FROM quiz where id = ?', [quiz_id])
    return {
        data: {
            title: results[0].title,
            code: results[0].code,
            question: results[0].question,
            images: results[0].image,
            options: results[0].options,
            answer: results[0].answer
        }
    };
}

const giveVote = async (quiz_id, QA_id) => {
    voteData = {
        quiz_id: quiz_id,
        QA_id: QA_id,
        vote: 1
    }
    console.log(voteData)
    const results = await query('INSERT INTO votes SET ?', voteData)
}

module.exports = {
    getVote,
    giveVote
}
