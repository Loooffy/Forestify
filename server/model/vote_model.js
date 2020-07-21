const { query, transaction, commit, rollback } = require('../../util/mysqlCon.js');

const getVote = async (giver_id, QA_id) => {
    try {
        const results = await query('SELECT * FROM votes WHERE giver_id = ? AND QA_id = ?', [giver_id, QA_id])
        return {
            data: {
                vote: results.length === 0 ? null : results[0].vote
            }
        }
    } catch (err) {
        console.log(err)
        //await rollback()
        return err
    }
}

const giveVote = async (data) => {
    voteData = {
        quiz_id: data.quiz_id,
        giver_id: data.giver_id,
        QA_id: data.QA_id,
        vote: 1
    }
    const results = await query('INSERT INTO votes SET ?', voteData)
}

const removeVote = async (giver_id, QA_id) => {
    voteData = {
        giver_id: giver_id,
        QA_id: QA_id
    }
    const results = await query('update votes SET vote = 0 where giver_id = ? AND QA_id = ?', [giver_id, QA_id])
}

const voteBack = async (giver_id, QA_id) => {
    voteData = {
        giver_id: giver_id,
        QA_id: QA_id,
    }
    const results = await query('update votes SET vote = 1 where giver_id = ? AND QA_id = ?', [giver_id, QA_id])
}


module.exports = {
    getVote,
    giveVote,
    removeVote,
    voteBack
}
