const Quiz = require('../model/quiz_model');
const pug = require('pug')
const marked = require('marked')

const getQuizData = async (req, res) => {
    let qid = req.query.qid
    let data = await Quiz.getQuizData(qid)
    data.data.question = marked(data.data.question_content)
    res.send(JSON.stringify(data))
}

const getSameTopicQuiz = async (req, res) => {
    let {qid} = req.query
    let result = await Quiz.getSameTopicQuiz(qid)
    res.send(JSON.stringify(result))
}

const getQid = async (req, res) => {
    let {code} = req.query
    let {qid} = await Quiz.getQid(code)
    res.send(JSON.stringify(qid))
}
    
module.exports = {
    getQuizData,
    getSameTopicQuiz,
    getQid,
}
