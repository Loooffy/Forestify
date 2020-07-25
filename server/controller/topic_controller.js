const Topic = require('../model/topic_model')

async function getTopic(req, res) {
    let {topic1, topic2} = req.params
    console.log(req.params)
    let result = await Topic.getTopic(topic1, topic2)
    res.send(JSON.stringify(result))
}

module.exports = {
    getTopic,
}
