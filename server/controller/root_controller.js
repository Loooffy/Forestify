const marked = require('marked')
const Quiz = require('../model/quiz_model');
const QA = require('../model/QA_model');

const renderQuizPage = async (req, res) => {
    let quiz_id = req.query.quiz_id
    //let result = await Quiz.getQuizData()
    let result = await QA.getQAData(quiz_id)
    //result.data.options = JSON.parse(result.data.options)
    //result.data.question = marked(result.data.question)
    //res.render('index', result.data)
    res.render('quiz', {quiz_id: quiz_id})
}
    
module.exports = {
    renderQuizPage
}
