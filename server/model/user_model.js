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
        let student = await query(`select id, email, name from student where email = '${email}'`)
        return student[0]
    } catch (err) {
        console.log(err)
        if (err.code) { 
            return { err: err.code }
        }
    }
}

const nativeSignIn = async (email, password) => {
    let student = await query(`select exists(select id from student where email='${email}' and password='${password}') as valid`)
    return student[0].valid
}

const facebookSignIn = async (email) => {
    let student = await query(`select id, name, email from student where email = '${email}'`)
    return student
}

const isLogged = async (email) => {
    let student = await query('select exists(select email from student where email = ?) as valid', [email])
    return student[0].valid
}

module.exports = {
    signUp,
    getUser,
    nativeSignIn,
    facebookSignIn,
    isLogged
}
