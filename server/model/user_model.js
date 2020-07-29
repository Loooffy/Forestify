const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const signUp = async (email, name, password) => {
    try {
        let student = await query(`insert into student(email, name, password) values('${email}', '${name}', '${password}')`)
        return student
    } catch (err) {
        if (err.code) { 
            return { err: err.code }
        }
    }
}

const getUser = async (email) => {
    try {
        let studentQ = 'select id from student where email = ?'
        let student = await query(studentQ, [email])
        return student[0]
    } catch (err) {
        console.log(err)
        if (err.code) { 
            return { err: err.code }
        }
    }
}

const nativeSignIn = async (email, password) => {
    let studentQ = 'select email, name from student where email = ? and password = ?'
    let student = await query(studentQ, [email, password])
    console.log(student)
    return student[0]
}

const facebookSignIn = async (email) => {
    let student = await query(`select id, name, email from student where email = '${email}'`)
    return student
}

const isLogged = async (email) => {
    let student = await query('select exists(select email from student where email = ?) as valid', [email])
    return student[0].valid
}

const getStatus = async (user_id) => {
    let statusQ = 
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
        `
    let status = await query(statusQ, [user_id])
    return status
}

const getTreePoint = async (user_id) => {
    let treePointQ = 'SELECT count(id) as treePoint from quiz_solving where user_id = ? and correct = 1'
    let treePoint = await query(treePointQ, [user_id])
    return treePoint[0]
}

module.exports = {
    signUp,
    getUser,
    nativeSignIn,
    facebookSignIn,
    isLogged,
    getStatus,
    getTreePoint,
}
