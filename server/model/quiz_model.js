const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQuizData = async (qid) => {
    let quizQ = 
        `
            SELECT 
                q.*, code_quiz.quiz_title
            FROM
                code_quiz
                    INNER JOIN
                (SELECT 
                    quiz.*,
                        JSON_OBJECTAGG(IFNULL(images.image_number, 0), IFNULL(images.image, '')) AS images,
                        JSON_ARRAYAGG(choices.choice_content) AS choices
                FROM
                    quiz
                LEFT JOIN images ON quiz.qid = images.qid
                INNER JOIN choices ON quiz.qid = choices.qid
                WHERE
                    quiz.qid = ?
                GROUP BY quiz.id) AS q ON q.code = code_quiz.code
        `

    const results = await query(quizQ, [qid])
    return {
        data: {
            code: results[0].code,
            quiz_title: results[0].quiz_title,
            question_content: results[0].question_content,
            images: results[0].images,
            choices: results[0].choices,
            answer: results[0].answer
        }
    };
}

const getSameTopicQuiz = async (qid) => {
    let quizQ = 
        `
            select 
                code_quiz.code, code_quiz.quiz_title
            from
                code_quiz
            where
                code_quiz.code
            like concat(
                '%', 
                (
                    select 
                        left(quiz.code, 7)
                    from 
                        quiz
                    where 
                        qid = ?
                ),
                '%'
            )
        `
    let result = await query(quizQ, [qid])
    return result
}

async function getQid(code) {
    let qidQ = `select qid from quiz where code like concat('%', ? '%')`
    let result = await query(qidQ, [code])
    return result[0]
}

module.exports = {
    getQuizData,
    getSameTopicQuiz,
    getQid,
}
