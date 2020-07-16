const QA = require('../model/QA_model');

const getQAData = async (req, res) => {
    let quiz_id = req.query.quiz_id
    let result = await QA.getQAData(quiz_id)
    res.send(JSON.stringify(result))
}
    
module.exports = {
    getQAData
}
