const Quiz = require('../model/quiz_model');
const pug = require('pug')
const marked = require('marked')

const getQuizData = async (req, res) => {
    let quiz_id = req.query.quiz_id
    let content = "$\ 6$ 個一，$\ 2$ 個十，$24$ 個百和 $1$ 個千合起來是多少？ ![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Windows_Settings_app_icon.png/1024px-Windows_Settings_app_icon.png)"
    let data = await Quiz.getQuizData(quiz_id)
    data.data.question = marked(data.data.question)
    res.send(JSON.stringify(data))
}
    
module.exports = {
    getQuizData
}
