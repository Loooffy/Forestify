const marked = require('marked')
const Quiz = require('../model/quiz_model');
const QA = require('../model/QA_model');

const renderQuizPage = async (req, res) => {
    let qid = req.query.qid
    //let result = await Quiz.getQuizData()
    let result = await QA.getQAData(qid)
    //result.data.options = JSON.parse(result.data.options)
    //result.data.question = marked(result.data.question)
    //res.render('index', result.data)
    res.render('quiz', {qid: qid})
}
    
module.exports = {
    renderQuizPage
}
