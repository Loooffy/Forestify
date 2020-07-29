function showFeedBack(className, content, correct) {
    let feedBackBox = $('<div>')
        .addClass(className)
        .html(content)
        .append(
            $('<div>')
                .addClass('ok')
                .click(ok)
                .html('好喔')
        )
        .appendTo($('body'))

    if (correct) {
        feedBackBox
            .prepend(
                $('<div>')
                    .addClass('feedback_tree')
                    .html('🌲')
            )
            .append(
                $('<div>')
                    .addClass('ok')
                    .click((event) => {
                        $(event.target)
                            .parent()
                            .remove()
                        $(`div[code="${window.quiz_code}"]`)
                            .next()
                            .trigger('click')
                    })
                    .html('下一題')
        )
    }
}

async function checkAnswer() {
    let formData = {
        qid: window.qid,
        token: getToken()
    }

    let feedback = {
        message: '',
        correct: false
    }

    if ($('button.option_on').attr('correct') === "true") {
        feedback.correct = true
        feedback.message = '答對囉！你剛種下了一棵新的小樹～'
        formData.correct = true
    } else {
        feedback.correct = false
        feedback.message = '答案不對，再試試看喔！'
        formData.correct = false
    }

    let result = await $.ajax({
        url: '/api/quiz/postAnswer',
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
    })

    console.log(result)

    if (result === 'answered' && feedback.correct) {
        feedback.message = '恭喜你又答對這題囉！可以去看看你的小樹～'
    } else if (result === 'inserted' && feedback.correct) {
        let treePoint = parseInt($('div.tree_point span').text())
        treePoint += 1
        $('div.tree_point span')
            .html((Array(4).join('0') + treePoint.toString()).slice(-4))
    }

    showFeedBack('feedback', feedback.message, feedback.correct)
}

function saveAnswer(e) {
    for (child of e.target.parentNode.children)
        {
            if ($(child).hasClass('option')) {
                $(child).removeClass("option_on")
            }
        }
    $(e.target).removeClass("option_off")
    $(e.target).addClass("option_on")
}

function ok() {
    $(this).parent().remove()
}

const getTemplate = function (tempClass){
  const html = $(`template.${tempClass}`).html();
  return $(html).clone();
}

function matchWrapper (group0, group1) {
    imageData = window.question_images[group1]
    let imageObj = JSON.parse(imageData)
    let {url, width, height} = imageObj
    let image = `<img src="${url}" style="width:${width}px;height:${height}px">`
    return image
}

async function showQuiz(qid) {
    let quizUrl = `/api/quiz/getQuizData?qid=${qid}`
    let data = await $.get(quizUrl, (res) => {
        return res
    })
        .then(res => JSON.parse(res))
        .then(resObj => resObj.data)
   
    window.quiz_code = data.code
    let temp = getTemplate('quiz')
    let mix = ''

    choices = JSON.parse(data.choices)
    $.each(choices, function (key, ele){
        temp[0].innerHTML = JSON.parse(ele).content
        $(temp[0]).attr('correct', JSON.parse(ele).correct)
        mix += temp[0].outerHTML
    })
    mix += temp[2].outerHTML
    window.question_images = JSON.parse(data.images)
    data.question = data.question.replace(/\[\[☃ (image [0-9])\]\]/g, matchWrapper)
    $('<div>').attr('id', 'quiz_title').html(data.quiz_title).appendTo($('div.question_field'))
    $('<div>').attr('id', 'question').html(data.question).appendTo($('div.question_field'))
    $('<div>').addClass('squirrel_wrapper').appendTo($('div.question_field'))
    $('<img>')
        .attr('src', '/static/image/squirrel.png')
        .attr('id', 'squirrel')
        .appendTo($('div.squirrel_wrapper'))
    $('div.answer_field').attr('id', 'answer').html(mix)
    $('img').attr('width', '30px')
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'answer'])
}

async function showQA(qid) {
    let QA = await $.get(`/api/QA/getQAData?qid=${qid}`, (res) => {
        return res
    })
    console.log(QA)
    let temp = getTemplate('QA')
    let mix = ''
  
    $.each(QA.data, function (key, ele){
        temp.find(".post_status").attr({
            qa_id: ele.id,
            qid: ele.qid,
            getter_id: ele.owner_id
        })
        temp.find(".post_title").text(ele.title)
        temp.find(".post_content").text(ele.content)
        temp.find(".post_time").text(ele.post_time)
        temp.find(".post_owner").text(ele.owner_name)
        temp.find(".post_vote").text(ele.total_vote)
        mix += temp[0].outerHTML
    })

    $("div.QA_field").html(mix)
}

function clearPage() {
    $('div.question_field').empty()
    $('div.QA_field').empty()
    $('div.same_topic_quiz_field').empty()
    $('div.tree_point').empty()
    //$('div.topic_field').empty()
}

function alertToggle() {
    $(document)
        .click((event) => {
            if (!$(event.target).hasClass('answer_button')) {
                $('div.feedback').remove()
                return
            } 
            //if ($(event.target).hasClass('widget')) {
            //    showStatus()
            //    return
            //}
        })
}

async function showPage(qid) {
    window.qid = qid
    window.voted = new Set()
    window.statusBoxOn = false
    clearPage()
    showTreePoint()
    await showQuiz(qid)
    showQA(qid)
    //await showTopic()
    await showSameTopicQuiz(qid)
    alertToggle()
    refreshQuizColor(window.quiz_code)
    $('div.topic_field').ready(() => {
        if ($('div.topic_field').html().length === 0) {
            showTopic()
        }
    })
    $('svg.hexMap').ready(() => {
        mapInit()
    })
}
