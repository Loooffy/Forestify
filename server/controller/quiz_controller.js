const Quiz = require('../model/quiz_model');
const pug = require('pug')
const marked = require('marked')

const getQuizData = async (req, res) => {
    let {qid} = req.query
    qid = req.query.qid ? req.query.qid : 41882
    let data = await Quiz.getQuizData(qid)
    data.data.question = marked(data.data.question_content)
    res.send(JSON.stringify(data))
}

const getSameTopicQuiz = async (req, res) => {
    let {qid} = req.query
    qid = req.query.qid ? req.query.qid : 41882
    let result = await Quiz.getSameTopicQuiz(qid)
    res.send(JSON.stringify(result))
}

const getQid = async (req, res) => {
    let {code} = req.query
    let {qid} = await Quiz.getQid(code)
    res.send(JSON.stringify(qid))
}

const postAnswer = async (req, res) => {
    try {
        let {qid, correct} = req.body
        let result = await Quiz.postAnswer(qid, req.user_id, correct)
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
}
    
module.exports = {
    getQuizData,
    getSameTopicQuiz,
    getQid,
    postAnswer,
}
