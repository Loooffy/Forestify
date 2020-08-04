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
    } else if(correct === false) {
        feedBackBox
            .prepend(
                $('<div>')
                    .addClass('feedback_tree')
                    .html('🍂')
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
    } else {
        feedBackBox
            .prepend(
                $('<div>')
                    .addClass('feedback_tree')
                    .html('🚜')
            )
        return
    }
}

async function checkAnswer() {

    let feedback = {
        message: '',
    }
    let treePoint = parseInt($('div.tree_point span').text())

    let token = getToken()
    token = token ? token : ""
    let getTree = {
        token: token,
    }

    let treePlanted = await post('/api/map/getTree', getTree)

    if (treePlanted.filter(tree => tree.code === window.curr_code).length === 0) {
        feedback.message = "小樹還沒有地方長大，先選一塊地吧~"
        showFeedBack('feedback', feedback.message, feedback.correct)
        return
    }

    let getAnswer = {
        qid: window.qid,
        token: getToken()
    }

    if ($('button.option_on').attr('correct') === "true") {
        feedback.correct = true
        feedback.message = '答對囉！你剛種下了一棵新的小樹～'
        getAnswer.correct = true
    } else {
        feedback.correct = false
        feedback.message = '答案不對，再試試看喔！'
        getAnswer.correct = false
    }

    let result = await post('/api/quiz/postAnswer', getAnswer)

    let correct = $('button.option_on').attr('correct') === "true" ? 1 : 0
    let status = `${result.history} ${result.inserted} ${correct}`

    let x = $(`#tree_map text[code='${window.curr_code}']`).attr('x')
    let y = $(`#tree_map text[code='${window.curr_code}']`).attr('y') - 15

    let postTree = {
        token: token,
        code: window.curr_code,
        correct: correct
    }

    switch (status) {
        case '1 2 0':
            feedback.message = '答錯了，小樹枯枯QQ'
            removeTree(window.curr_code)
            treePoint -= 1
            post('/api/map/postTree', postTree)
            break
        case '1 2 1':
            feedback.message = '恭喜你答對這題囉！跟小樹說哈囉～'
            break
        case '0 2 0':
            break
        case '0 2 1':
            treePoint += 1
            plantTree(x, y, window.curr_code, 1)
            post('/api/map/postTree', postTree)
            break
        case '0 1 0':
            break
        case '0 1 1':
            console.log(treePoint)
            treePoint += 1
            plantTree(x, y, window.curr_code, 1)
            post('/api/map/postTree', postTree)
            break
    }

    $('div.tree_point span')
        .html((Array(4).join('0') + treePoint.toString()).slice(-4))

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
   
    window.quiz_code = data.code
    let temp = getTemplate('quiz')
    let mix = ''

    let choices = JSON.parse(data.choices)
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
