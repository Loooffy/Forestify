function checkAnswer() {
    console.log(window.answer)
    if (window.answer === "30") {
        showElement('feedback', '答對囉！')
    } else {
        showElement('feedback', '答案不對，再試試看喔！')
    }
}

function saveAnswer(e) {
    for (child of e.target.parentNode.children)
        {
            if ($(child).hasClass('option')) {
                child.setAttribute("style", "background:lightgray")
            }
        }
    e.target.setAttribute("style", "background:yellow")
    window.answer = e.target.innerHTML
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

async function showQuiz() {
    let quizUrl = `http://127.0.0.1:3000/api/quiz/getQuizData?quiz_id=${window.quiz_id}`
    let data = await $.get(quizUrl, (res) => {
        return res
    })
        .then(res => JSON.parse(res))
        .then(resObj => resObj.data)

    let temp = getTemplate('quiz')
    let mix = ''

    options = JSON.parse(data.options)
    $.each(options, function (key, ele){
        temp[0].append(ele)
        mix += temp[0].outerHTML
    })
    
    $('<div>').attr('id', 'question').html(data.question).appendTo($('div.question_field'))
    $('img').attr('width', '30px')
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])

    mix += temp[2].outerHTML

    $("div.answer_field").html(mix)
}

async function showDiscussion() {
    let result = await $.get(`http://127.0.0.1:3000/api/QA/getQAData?quiz_id=${window.quiz_id}`, (res) => {
        return res
    }).then(r => JSON.parse(r))
    let data = result.data
    let temp = getTemplate('discussion')
    let mix = ''
  
    //$.each(result.data, function (key, ele){
    temp.find(".post_status").attr({
        qa_id: data.QA_id,
        quiz_id: data.quiz_id,
        getter_id: data.owner_id
    })
    temp.find(".post_title").text(data.title)
    temp.find(".post_content").text(data.content)
    temp.find(".post_time").text(data.post_time)
    temp.find(".post_owner").text(data.owner_name)
    temp.find(".post_vote").text(data.vote)
    //})
    mix += temp[0].outerHTML

    $("div.discussion_field").html(mix)
}

async function init() {
    await showQuiz()
    await showDiscussion()
    window.voted = new Set()
}
