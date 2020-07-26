const marked = require('marked')
const Quiz = require('../model/quiz_model');
const QA = require('../model/QA_model');
const hexMap = require('../../util/hexMapCreator')

const renderQuizPage = async (req, res) => {
    let qid = req.query.qid
    //let result = await Quiz.getQuizData()
    let result = await QA.getQAData(qid)
    //result.data.options = JSON.parse(result.data.options)
    //result.data.question = marked(result.data.question)
    //res.render('index', result.data)
    let allHex = hexMap.createHexMap(120, 0, 40)
    let renderData = {
        qid: qid,
        hexData: allHex
    }
    res.render('quiz', renderData)
}
    
module.exports = {
    renderQuizPage
}
