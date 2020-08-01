const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');
const { getTime } = require('../../util/util.js')

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
            SELECT
                code_quiz.code, code_quiz.quiz_title, code_topic.topic
            FROM
                code_quiz
                    INNER JOIN
                code_topic ON LEFT(code_quiz.code, 7) = code_topic.code
            WHERE
                code_quiz.code LIKE CONCAT('%',
                        (SELECT
                                LEFT(quiz.code, 7)
                            FROM
                                quiz
                            WHERE
                                qid = ?),
                        '%')

        `
    let result = await query(quizQ, [qid])
    return result
}

async function getQid(code) {
    let qidQ = `select qid from quiz where code like concat('%', ? '%')`
    let result = await query(qidQ, [code])
    return result[0]
}

async function postAnswer(qid, user_id, correct) {
    let time = getTime()
    let historyQ = 'select correct from quiz_solving where qid = ? and user_id = ?'
    let history = await query(historyQ, [qid, user_id])
    let currentQ = 'replace into quiz_solving(qid, user_id, correct, time) values(?, ?, ?, ?)'
    let current = await query(currentQ, [qid, user_id, correct, time])

    console.log(history)

    return {
        history: history.length ? history[0].correct : 0, 
        inserted: current.affectedRows
    }
}

module.exports = {
    getQuizData,
    getSameTopicQuiz,
    getQid,
    postAnswer,
}
