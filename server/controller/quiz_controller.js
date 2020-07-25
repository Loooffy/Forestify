const Quiz = require('../model/quiz_model');
const pug = require('pug')
const marked = require('marked')

const getQuizData = async (req, res) => {
    let quiz_id = req.query.quiz_id
    let data = await Quiz.getQuizData(quiz_id)
    console.log(data)
    data.data.question = marked(data.data.question_content)
    res.send(JSON.stringify(data))
}

const getSameTopicQuiz = async (req, res) => {
    let {qid} = req.query
    let result = await Quiz.getSameTopicQuiz(qid)
    console.log(result)
    res.send(JSON.stringify(result))
}
    
module.exports = {
    getQuizData,
    getSameTopicQuiz
}
