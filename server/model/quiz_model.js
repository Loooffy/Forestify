const {query, transaction, commit, rollback} = require('../../util/mysqlCon.js');
const {getTime} = require('../../util/util.js');

const getQuizData = async (qid, user_id) => {
  const quizQ =
        `
            SELECT
                q.*, code_quiz.quiz_title, quiz_solving.correct
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
                    LEFT JOIN
                quiz_solving ON q.qid = quiz_solving.qid
                    AND user_id = ?
        `;

  const result = await query(quizQ, [qid, user_id]);
  console.log(result, 'user_id' + user_id)
  return result
};

const getSameTopicQuiz = async (qid) => {
  const quizQ =
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

        `;
  const result = await query(quizQ, [qid]);
  return result;
};

async function getQid(code) {
  const qidQ = 'select qid from quiz where code like concat(\'%\', ? \'%\')';
  const result = await query(qidQ, [code]);
  console.log(result)
  return result;
}

async function postAnswer(qid, user_id, correct) {
  const time = getTime();
  const historyQ = 'select correct from quiz_solving where qid = ? and user_id = ?';
  const history = await query(historyQ, [qid, user_id]);
  const currentQ = 'replace into quiz_solving(qid, user_id, correct, time) values(?, ?, ?, ?)';
  const current = await query(currentQ, [qid, user_id, correct, time]);

  console.log(history);

  return {
    history: history.length ? history[0].correct : 0,
    inserted: current.affectedRows,
  };
}

module.exports = {
  getQuizData,
  getSameTopicQuiz,
  getQid,
  postAnswer,
};
