function clearPage() {
    $('div.question_field').empty()
    $('div.QA_field').empty()
    $('div.same_topic_quiz_field').empty()
    $('div.tree_point').empty()
}

function alertToggle() {
    $(document)
        .click((event) => {
            if (!$(event.target).hasClass('answer_button')) {
                $('div.feedback').remove()
                return
            } 
        })
}

async function showPage(qid) {
    window.qid = qid
    window.voted = new Set()
    window.statusBoxOn = false
    window.myQABoxOn = false
    window.treePlanted = window.treePlanted ? window.treePlanted : {}
    window.curr_code = window.curr_code ? window.curr_code : 'mjnzs'
    window.constraints = {
        all: false,
        none: false,
        correct: [],
        grade: [],
    }
    await clearPage()
    showTreePoint()
    showQuiz(qid)
    showQA(qid)
    showSameTopicQuiz(qid)
    alertToggle()
    $('div.topic_field').ready(() => {
        if ($('div.topic_field').html().length === 0) {
            showTopic()
        }
    })
    refreshQuizColor(window.quiz_code, 'quiz')
    $('svg.hexMap').ready(() => {
        mapInit()
    })
    if (window.treeDrawed != true) {
        await treeMapInit()
    }
    if (window.hinted != true) {
        showMap()
    }
}
