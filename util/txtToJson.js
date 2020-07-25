const fs = require('fs')
const { query, transaction, commit, rollback } = require('./mysqlCon.js');


function readTxt (fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, quiz) => {
            if (err) {
                reject(err)
            } else {
                resolve(quiz.toString('utf8'))
            }
        })
    })
}

async function parseTopic() {
    let object = await readTxt('../crawler/allTopics.txt')//.then(r => {return JSON.parse(r)})
    let arr = await object.split('\n')
    let topicCode = {}
    arr.slice(0,3).map(obj => Object.assign(topicCode, JSON.parse(obj)))
    let topicData = []
    Object.keys(topicCode).map(key => topicData.push([key, topicCode[key]]))
    let result = await query('insert into category(code, topic) values ?', [topicData])
}

async function parseQuiz() {
    let obj= await readTxt('../crawler/isSelection.txt').then(r => JSON.parse(r))
    console.log(JSON.stringify(obj, null, 2))
}

async function extractQuiz(start, end) {
    let obj= await readTxt('crawler/allQuiz.txt').then(r => JSON.parse(r))
    let allQuiz = []
    let allImages = []
    let allChoices = []
    obj.slice(start,end).map(data => {
        let content = data.question.content
        let regex = /\[\[☃ (.*)?\]\]/g
        let widgets = [...content.matchAll(regex)].map(r => r[1])
        let quiz = {
            qid: 0,
            title: '',
            question_content: '',
        }
        quiz.title = data.quizTitle
        quiz.qid = data.qid
        quiz.question_content = content.replace(/\[\[☃ radio 1\]\]/g, '')

        widgets.map(widget => {
            if (widget.includes('image')) {
                try {
                    let image = JSON.stringify(data.question.widgets[widget].options.backgroundImage)
                    image = image ? image : ''
                    allImages.push([data.qid, widget, image])
                    //console.log(data.qid, widget, data.question.widgets[widget].options.backgroundImage)
                } catch (err) {
                    images = ''
                    console.log(err)
                }
            } 
            if (widget.includes('radio')) {
                try {
                    //console.log(data.question.widgets[widget].options.choices)
                    data.question.widgets[widget].options.choices.map(choice => {
                        choice = choice ? choice : ''
                        allChoices.push([data.qid, JSON.stringify(choice)])
                    })
                    //console.log(data.qid, widget, data.question.widgets[widget].options.choices)
                } catch (err) {
                    quiz.options = ''
                    console.log(err)
                    }
                }
            if (!widget.includes('radio') && !widget.includes('image')) {
                console.log(widget)
            }
        })
        allQuiz.push([
            quiz.qid,
            quiz.title,
            quiz.question_content,
        ])
    })
    //console.log(allImages.slice(-2,-1))
    //console.log(JSON.stringify(obj.slice(3260,3265),null,2))
    //console.log(JSON.stringify(allChoices, null, 2))
    await query('insert into quiz(qid, title, question_content) values ?', [allQuiz])
    await query('insert into images(qid, image_number, image) values ?', [allImages])
    await query('insert into choices(qid, choice_content) values ?', [allChoices])
    //console.log(allQuiz.map(data => data.length))
    //console.log(allQuiz)
    console.log('done')
}


//let quiz = isSelection.filter(quiz => quiz.qid === 14123)
//parseTopic()
//parseQuiz()
extractQuiz(0, 9100)
