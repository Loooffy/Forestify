const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQuizData = async (quiz_id) => {
    const results = await query('SELECT * FROM quiz where id = ?', [quiz_id])
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

module.exports = {
    getQuizData
}
