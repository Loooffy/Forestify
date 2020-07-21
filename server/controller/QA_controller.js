const QA = require('../model/QA_model');

const getQAData = async (req, res) => {
    let quiz_id = req.query.quiz_id
    let result = await QA.getQAData(quiz_id)
    res.send(JSON.stringify(result))
}

const postQ = async (req ,res) => {
    let data = {
        quiz_id: req.body.quiz_id,
        owner_id: req.body.owner_id,
        post_time: req.body.post_time,
        title: req.body.title,
        content: req.body.content,
        head_id: req.body.head_id
    }
    let result = await QA.postQ(data)
    res.send(JSON.stringify(result.insertId))
}
    
module.exports = {
    getQAData,
    postQ
}
