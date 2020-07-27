async function checkAnswer() {
    let formData = {
        qid: window.qid,
        token: getToken()
    }

    if ($('button.option_on').attr('correct') === "true") {
        showElement('feedback', '答對囉！')
        formData.correct = true
    } else {
        showElement('feedback', '答案不對，再試試看喔！')
        formData.correct = false
    }
    console.log(formData)

    await $.ajax({
        url: '/api/quiz/postAnswer',
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
    })
}

function saveAnswer(e) {
    for (child of e.target.parentNode.children)
        {
            if ($(child).hasClass('option')) {
                $(child).removeClass("option_on")
                $(child).addClass("option_off")
            }
        }
    $(e.target).removeClass("option_off")
    $(e.target).addClass("option_on")
}

function ok(e) {
    e.target.parentNode.remove()
}

function showElement(className, content) {
    let feedback = document.createElement('div')
    let ok = document.createElement('div')
    ok.setAttribute('class', 'ok')
    ok.setAttribute('onclick', 'ok(event)')
    ok.innerHTML = '好喔'
    feedback.setAttribute('class', className)
    feedback.innerHTML = content
    document.getElementsByTagName('body')[0].appendChild(feedback)
    document.getElementsByClassName('feedback')[0].appendChild(ok)
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
    $('div.answer_field').attr('id', 'answer').html(mix)
    $('img').attr('width', '30px')
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'answer'])
}

async function getQid(code) {
    let qid = await $.get(`api/quiz/getQid?code=${code}`)
    console.log(qid)
    return qid
}

async function showSameTopicQuiz(qid) {
    let quiz = await $.get(`api/quiz/same_topic?qid=${qid}`, (res) => {
        return res
    })
        .then(res => JSON.parse(res))

    $.each(quiz, function (key, ele){
        let div = 
            $('<div class="same_topic_quiz">')
                .attr('code', ele.code)
                .click(event, async () => {
                    let code = $(event.target).attr('code')
                    let qid = await getQid(code)
                    showPage(qid)
                })
                .html(ele.quiz_title)
        $('div.same_topic_quiz_field').append(div)
    })
}

async function showQA(qid) {
    let QA = await $.get(`/api/QA/getQAData?quiz_id=${qid}`, (res) => {
        return res
    }).then(r => JSON.parse(r))
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
    //$('div.topic_field').empty()
}

async function showPage(qid) {
    window.qid = qid
    clearPage()
    showQuiz(qid)
    showQA(qid)
    //await showTopic()
    showSameTopicQuiz(qid)
    window.voted = new Set()
    $('div.topic_field').ready(() => {
        console.log(0)
        if ($('div.topic_field').html().length === 0) {
            showTopic()
        }
    })
    $('svg.hexMap').ready(() => {
        mapInit()
    })
}
