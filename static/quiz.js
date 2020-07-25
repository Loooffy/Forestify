function checkAnswer() {
    if ($('button.option_on').attr('correct') === "true") {
        showElement('feedback', '答對囉！')
        console.log($('button_on'))
    } else {
        showElement('feedback', '答案不對，再試試看喔！')
        console.log($('button_on'))
    }
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

async function showQuiz() {
    let quizUrl = `/api/quiz/getQuizData?quiz_id=${window.quiz_id}`
    let data = await $.get(quizUrl, (res) => {
        return res
    })
        .then(res => JSON.parse(res))
        .then(resObj => resObj.data)

    let temp = getTemplate('quiz')
    let mix = ''

    choices = JSON.parse(data.choices)
    console.log(choices)
    $.each(choices, function (key, ele){
        temp[0].innerHTML = JSON.parse(ele).content
        $(temp[0]).attr('correct', ele.correct)
        mix += temp[0].outerHTML
    })
    mix += temp[2].outerHTML
    window.question_images = JSON.parse(data.images)
    data.question = data.question.replace(/\[\[☃ (image [0-9])\]\]/g, matchWrapper)
    $('<div>').attr('id', 'question').html(data.question).appendTo($('div.question_field'))
    $('div.answer_field').attr('id', 'answer').html(mix)
    $('img').attr('width', '30px')
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'answer'])
}

async function showSameTopicQuiz() {
    let quiz = await $.get(`api/quiz/same_topic?qid=34604`, (res) => {
        return res
    })
        .then(res => JSON.parse(res))

    $('<div class="same_topic_quiz_field">').appendTo($('body'))

    $.each(quiz, function (key, ele){
        $('div.same_topic_quiz_field').append($('<div class="same_topic_quiz">').html(ele.title))
    })
}

async function showQA() {
    let QA = await $.get(`/api/QA/getQAData?quiz_id=${window.quiz_id}`, (res) => {
        return res
    }).then(r => JSON.parse(r))
    let temp = getTemplate('QA')
    let mix = ''
  
    $.each(QA.data, function (key, ele){
        temp.find(".post_status").attr({
            qa_id: ele.id,
            quiz_id: ele.quiz_id,
            getter_id: ele.owner_id
        })
        temp.find(".post_title").text(ele.title)
        temp.find(".post_content").text(ele.content)
        temp.find(".post_time").text(ele.post_time)
        temp.find(".post_owner").text(ele.owner_name)
        temp.find(".post_vote").text(ele.total_vote)
        mix += temp[0].outerHTML
    })
    console.log(QA.data)

    $("div.QA_field").html(mix)
}

async function init() {
    showQuiz()
    showQA()
    showSameTopicQuiz()
    window.voted = new Set()
}
