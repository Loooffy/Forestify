const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getQuizData = async (quiz_id) => {
    let quizQ = 
        `
            SELECT 
                quiz.*,
                JSON_OBJECTAGG(IFNULL(images.image_number, 0),
                        IFNULL(images.image, '')) AS images,
                JSON_ARRAYAGG(choices.choice_content) AS choices
            FROM
                quiz
                    LEFT JOIN
                images ON quiz.qid = images.qid
                    INNER JOIN
                choices ON quiz.qid = choices.qid
            WHERE
                quiz.id = ?
            GROUP BY quiz.id    
        `

    const results = await query(quizQ, [quiz_id])
    return {
        data: {
            title: results[0].title,
            code: results[0].code,
            question_content: results[0].question_content,
            images: results[0].images,
            choices: results[0].choices,
            answer: results[0].answer
        }
    };
}

async function getSameTopicQuiz(qid) {
    let quizQ = 
    `
        select 
            code_quiz.code, code_title.title
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

module.exports = {
    getQuizData,
    getSameTopicQuiz,
}
