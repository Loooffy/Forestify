const Topic = require('../model/topic_model')

async function getTopic(req, res) {
    let result = await Topic.getTopic()
    res.send(JSON.stringify(result))
}

module.exports = {
    getTopic,
}
