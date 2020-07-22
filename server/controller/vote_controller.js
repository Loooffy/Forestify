const Vote = require('../model/vote_model')

const giveVote = async (req, res) => {
    let data = {
        giver_id: req.body.giver_id,
        QA_id: req.body.QA_id,
        quiz_id: req.body.quiz_id
    }
    let result = await Vote.giveVote(data)
    res.send(JSON.stringify(result))
    console.log('give')
}

const removeVote = async (req, res) => {
    let QA_id = req.body.QA_id
    let giver_id = req.body.giver_id
    let result = await Vote.removeVote(giver_id, QA_id)
    res.send(JSON.stringify(result))
}

const getVote = async (req, res) => {
    let QA_id = req.query.QA_id
    let giver_id = req.query.giver_id
    let result = await Vote.getVote(giver_id, QA_id)
    res.send(JSON.stringify(result))
}

const voteBack = async (req, res) => {
    let QA_id = req.body.QA_id
    let giver_id = req.body.giver_id
    let result = await Vote.voteBack(giver_id, QA_id)
    res.send(JSON.stringify(result))
}
    
module.exports = {
    giveVote,
    removeVote,
    getVote,
    voteBack
}
