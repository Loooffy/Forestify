const QA = require('../model/QA_model');

const getQAData = async (req, res) => {
    let qid = req.query.qid
    let result = await QA.getQAData(qid)
    console.log(result)
    res.json(result)
}

const postQ = async (req ,res) => {
    let data = {
        qid: req.body.qid,
        post_time: req.body.post_time,
        title: req.body.title,
        content: req.body.content,
        head_id: req.body.head_id
    }
    data.user_id = req.user_id
    console.log('user', req.user_id)
    let result = await QA.postQ(data)
    res.send(JSON.stringify(result.insertId))
}
    
module.exports = {
    getQAData,
    postQ
}
