function checkAnswer() {
    if (window.answer === window.correct_answer) {
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
    window.answer = e.target.innerHTML.slice(0,3)[1]
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
    window.correct_answer = data.answer

    let temp = getTemplate('quiz')
    let mix = ''

    options = JSON.parse(data.options)
    $.each(options, function (key, ele){
        temp[0].innerHTML = ele.content
        mix += temp[0].outerHTML
    })
    mix += temp[2].outerHTML
    
    $('<div>').attr('id', 'question').html(data.question).appendTo($('div.question_field'))
    $('div.answer_field').attr('id', 'answer').html(mix)
    $('img').attr('width', '30px')
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,'answer'])
}

async function showQA() {
    let QA = await $.get(`http://127.0.0.1:3000/api/QA/getQAData?quiz_id=${window.quiz_id}`, (res) => {
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
    await showQuiz()
    await showQA()
    window.voted = new Set()
}
