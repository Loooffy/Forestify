const Vote = require('../model/vote_model');

const giveVote = async (req, res) => {
    let quiz_id = req.body.quiz_id
    let QA_id = req.body.QA_id
    let getter_id = req.body.getter_id
    let result = await Vote.giveVote(quiz_id, QA_id)
    res.send(JSON.stringify(result))
}
    
module.exports = {
    giveVote
}
