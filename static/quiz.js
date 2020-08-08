async function checkAnswer() {

    let feedback = {
        message: '',
    }
    let treePoint = parseInt($('div.tree_point span').text())

    let token = getToken()
    token = token ? token : null

    let treePlanted = await ajaxReq('/api/map/getTree', '', 'GET', token)

    if (treePlanted.signBlock) {
        $('body').append(treePlanted.signBlock)
        return
    }

    if (treePlanted.filter(tree => tree.code === window.curr_code).length === 0) {
        feedback.message = "小樹還沒有地方長大，先選一塊地吧~"
        showFeedBack('feedbackBox', feedback.message, feedback.correct)
        return
    }

    let getAnswer = {
        qid: window.qid,
    }

    if ($('button.option_on').attr('correct') === "true") {
        feedback.correct = true
        feedback.message = '答對囉！你剛種下了一棵新的小樹～'
        getAnswer.correct = true
        console.log($('#quiz_status').html())
        $('#quiz_status')
            .css('background', 'darkcyan')
            .html('答對')
    } else {
        feedback.correct = false
        feedback.message = '答案不對，再試試看喔！'
        getAnswer.correct = false
        console.log($('#quiz_status').html())
        $('#quiz_status')
            .css('background', 'red')
            .html('答錯')
    }

    let result = await ajaxReq('/api/quiz/postAnswer', getAnswer, 'POST', token)

    let correct = $('button.option_on').attr('correct') === "true" ? 1 : 0
    let status = `${result.history} ${result.inserted} ${correct}`

    let x = $(`#tree_map text[code='${window.curr_code}']`).attr('x')
    let y = $(`#tree_map text[code='${window.curr_code}']`).attr('y') - 15

    let postTree = {
        code: window.curr_code,
        correct: correct
    }

    switch (status) {
        case '1 2 0':
            feedback.message = '答錯了，小樹枯枯QQ'
            removeTree(window.curr_code)
            treePoint -= 1
            ajaxReq('/api/map/postTree', postTree, 'POST', token)
            $('#quiz_status')
                .css('background', 'red')
                .html('答錯')
            break
        case '1 2 1':
            feedback.message = '恭喜你答對這題囉！跟小樹說哈囉～'
            $('#quiz_status')
                .css('background', 'darkcyan')
                .html('答對')
            break
        case '0 2 0':
            break
        case '0 2 1':
            treePoint += 1
            plantTree(x, y, window.curr_code, 1)
            ajaxReq('/api/map/postTree', postTree, 'POST', token)
            break
        case '0 1 0':
            break
        case '0 1 1':
            console.log(treePoint)
            treePoint += 1
            plantTree(x, y, window.curr_code, 1)
            ajaxReq('/api/map/postTree', postTree, 'POST', token)
            break
    }

    $('div.tree_point span')
        .html((Array(4).join('0') + treePoint.toString()).slice(-4))

    showFeedBack('feedbackBox', feedback.message, feedback.correct)
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
    let reqData = {qid: qid}
    let token = getToken()
    token = token ? token : null
    let quizData = await ajaxReq('/api/quiz/getQuizData', reqData, 'GET', token)

    console.log(quizData)
    quizData.correct = quizData.correct === null ? '未答' :  quizData.correct === 0 ? '答錯' : '答對'
    quizSolvingStatus = {
        '未答': 'darkgray',
        '答錯': 'red',
        '答對': 'darkcyan'
    }

    window.quiz_code = quizData.code
    let temp = getTemplate('quiz')
    let mix = ''

    let choices = JSON.parse(quizData.choices)
    $.each(choices, function (key, ele){
        temp[0].innerHTML = JSON.parse(ele).content
        $(temp[0]).attr('correct', JSON.parse(ele).correct)
        mix += temp[0].outerHTML
    })
    mix += temp[2].outerHTML
    window.question_images = JSON.parse(quizData.images)
    quizData.question = quizData.question.replace(/\[\[☃ (image [0-9])\]\]/g, matchWrapper)
    $('<div>').attr('id', 'quiz_title').html(quizData.quiz_title).appendTo($('div.question_field'))
    $('<div>').attr('id', 'question').html(quizData.question).appendTo($('div.question_field'))
    $('<div>').addClass('squirrel_wrapper').appendTo($('div.question_field'))
    $('<div>')
        .css('width', '0px')
        .css('height', '0px')
        .css('position', 'relative')
        .css('left', '-260px')
        .css('top', '-15px')
        .append(
            $('<div>')
                .addClass('filter_key')
                .attr('id', 'quiz_status')
                .html(quizData.correct)
                .css('background', quizSolvingStatus[quizData.correct])
                .css('opacity', '0.7')
                .css('width', '4rem')
                .css('text-align', 'center')
                .css('color', 'white')
        )
        .prependTo($('div.question_field'))
    $('<img>')
        .attr('src', 'https://forestify.theshinings.online/static/image/squirrel.png')
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
