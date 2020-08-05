const {query, transaction, commit, rollback} = require('../../util/mysqlCon.js');

const signUp = async (email, name, password) => {
  try {
    const student = await query(`insert into student(email, name, password) values('${email}', '${name}', '${password}')`);
    return student;
  } catch (err) {
    if (err.code) {
      return {err: err.code};
    }
  }
};

const getUser = async (email) => {
  try {
    const studentQ = 'select id from student where email = ?';
    const student = await query(studentQ, [email]);
    return student[0];
  } catch (err) {
    console.log(err);
    if (err.code) {
      return {err: err.code};
    }
  }
};

const nativeSignIn = async (email, password) => {
  const studentQ = 'select email, name from student where email = ? and password = ?';
  const student = await query(studentQ, [email, password]);
  console.log(student);
  return student[0];
};

const facebookSignIn = async (email) => {
  const student = await query(`select id, name, email from student where email = '${email}'`);
  return student;
};

const isLogged = async (email) => {
  const student = await query('select exists(select email from student where email = ?) as valid', [email]);
  return student[0].valid;
};

const getStatus = async (user_id) => {
  const statusQ =
        `
            SELECT 
                qsc.code,
                qsc.user_id,
                qsc.time,
                qsc.correct,
                code_quiz.quiz_title,
                code_topic.topic AS lv1_topic,
                lv2.topic as lv2_topic,
                lv3.topic as lv3_topic
            FROM
                code_topic
                    INNER JOIN
                (SELECT 
                    qs.qid, qs.user_id, qs.time, qs.correct, quiz.code
                FROM
                    quiz_solving AS qs
                INNER JOIN quiz ON qs.qid = quiz.qid
                WHERE
                    user_id = ?) AS qsc ON LEFT(qsc.code, 3) = code_topic.code
                    INNER JOIN
                code_topic AS lv2 ON LEFT(qsc.code, 5) = lv2.code
                    INNER JOIN
                code_topic AS lv3 ON LEFT(qsc.code, 7) = lv3.code
                inner join code_quiz on code_quiz.code = qsc.code
            ORDER BY time DESC
        `;
  const status = await query(statusQ, [user_id]);
  return status;
};

const getTreePoint = async (user_id) => {
  const treePointQ = 'SELECT count(id) as treePoint from quiz_solving where user_id = ? and correct = 1';
  const treePoint = await query(treePointQ, [user_id]);
  return treePoint[0];
};

const getMyQA = async (user_id) => {
  const myQAQ =
        `
            SELECT 
                allQA.content,
                allQA.owner_name,
                allQA.total_votes,
                allQA.title,
                lv1.topic as topic1,
                lv2.topic as topic2,
                lv3.topic as topic3

            FROM
                (SELECT 
                    QA.*,
                    student.name AS owner_name,
                    v.total_vote as total_votes,
                    quiz.code,
                    cq.lv1_topic_code,
                    cq.lv2_topic_code,
                    cq.lv3_topic_code
                FROM
                    QA
                INNER JOIN quiz ON quiz.qid = QA.qid
                INNER JOIN student AS student ON QA.user_id = student.id
                INNER JOIN (SELECT 
                    QA_id, SUM(vote) AS total_vote
                FROM
                    votes
                GROUP BY QA_id) AS v ON QA.id = v.QA_id
                INNER JOIN code_quiz AS cq ON cq.code = quiz.code) 
            AS allQA

            INNER JOIN
                code_topic AS lv1 ON LEFT(allQA.code, 3) = lv1.code
            INNER JOIN
                code_topic AS lv2 ON LEFT(allQA.code, 5) = lv2.code
            INNER JOIN
                code_topic AS lv3 ON LEFT(allQA.code, 7) = lv3.code

            WHERE
                user_id = ?
            ORDER BY allQA.post_time DESC
        `;
  const myQA = await query(myQAQ, [user_id]);
  return myQA;
};

module.exports = {
  signUp,
  getUser,
  nativeSignIn,
  facebookSignIn,
  isLogged,
  getStatus,
  getTreePoint,
  getMyQA,
};
