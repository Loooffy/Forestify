async function getQid(code) {
    let token = getToken()
    token = token ? token : null
    let reqData = {
        code: code
    }
    let qid = await ajaxReq('api/quiz/getQid?code', reqData, 'GET', token)
    if (qid.signBlock) {
        return 
    }
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
                .click(async (event) => {
                    let code = $(event.target).attr('code')
                    let qid = await getQid(code)
                    if (qid.length != 0) {
                        refreshQuizColor(code, 'quiz')
                        window.quiz_code = code
                        window.qid = qid[0].qid
                        showPage(window.qid)
                        return
                    }
                    showNoQuizAlert('feedbackBox', 'SORRY~ 題庫目前沒有這題，我們會盡快補齊！')
                    refreshQuizColor(window.quiz_code, 'quiz')
                    return
                })
                .html(ele.quiz_title)
        $('div.same_topic_quiz_field')
            .append(div)
    })
    $('div.same_topic_quiz_field')
        .prepend(
            $('<div>')
                .addClass('same_topic_quiz_title')
                .html(quiz[0].topic)
            )
}

function showNoQuizAlert(className, content) {
    let feedBackBox = $('<div>')
        .addClass(className)
        .html(content)
        .prepend(
            $('<div>')
                .addClass('feedback_icon')
                .html('🚜')
        )
        .append(
            $('<div>')
                .addClass('ok')
                .click(ok)
                .html('好喔')
        )
        .append(
            $('<div>')
                .addClass('ok')
                .click(async (event) => {
                    console.log(quiz_code)
                    $(event.target)
                        .parent()
                        .remove()
                    window.quiz_code = $(`div[code="${window.quiz_code}"]`).next().attr('code')
                    if (!window.quiz_code) {
                        window.quiz_code = $('div.same_topic_quiz:first-child').attr('code')
                    }
                    await $(`div[code="${window.quiz_code}"]`)
                        .trigger('click')
                })
                .html('再下一題')
        )
        .appendTo($('body'))
        return

}

async function refreshQuizColor (code, type) {
    await $(`[code="${code}"]`)
        .siblings()
        .removeClass(`${type}_focus`)
        
    await $(`a.lv2_3_topic`)
        .removeClass(`${type}_focus`)

    await $(`[code="${code}"]`)
        .addClass(`${type}_focus`)
}

async function showTopic() {
    let token = getToken()
    token = token ? token : null
    window.topic = await ajaxReq('api/topic', null, 'GET', token).then(r => JSON.parse(r))
    let lv1_topics = window.topic.filter(r => r.code.length === 3)
    let lv2_topics = window.topic.filter(r => r.code.length === 5)
    let lv3_topics = window.topic.filter(r => r.code.length === 7)
    let root = $('<ul>').addClass('accordion')
    let ul = $('<ul>').addClass('inner')
    let li = $('<li>')
    await lv1_topics.map(async (lv1_topic) => {
         let lv1 =
             $('<a>')
                 .addClass('toggle')
                 .attr('code', lv1_topic.code)
                 .attr('href', "javascript:void(0)")
                 .click(async (event) => {
                     let code = $(event.target).attr('code')
                 })
                 .html(lv1_topic.topic)
         let lv2_wrapper = $('<div class="inner"></div>')
         let lv1_2_topics = lv2_topics.filter(topic => topic.code.includes(lv1_topic.code))
         lv1_2_topics.map(async (lv1_2_topic) => {
             let lv2 =
                 $('<a>')
                     .addClass('toggle')
                     .attr('code', lv1_2_topic.code)
                     .attr('href', "javascript:void(0)")
                     .html(`&#127794; ${lv1_2_topic.topic}`)
                     .draggable({
                        cursorAt: {left: -20, top: 10},
                        appendTo: body,
                        helper: 'clone',
                        start: function(event, ui) {
                            $(ui.helper).addClass("helper")
                             let t =$(event.target)
                             window.tree_code = t.attr('code')
                             window.treePlanted[window.tree_code] = {
                                code: t.attr('code'),
                                text: t.html()
                             }
                        },
                     })

                     let lv3_wrapper = $('<div class="inner"></div>')
                     let lv2_3_topics = await lv3_topics.filter(topic => topic.code.includes(lv1_2_topic.code))
                     await lv2_3_topics.map(async lv2_3_topic => {
                         let lv3 =
                             await $('<a>')
                                 .attr('code', lv2_3_topic.code)
                                 .attr('class', 'lv2_3_topic')
                                 .attr('href', "javascript:void(0)")
                                 .click(event, async () => {
                                     if ($('.not_map').css('display') === "none") {
                                         $('.map_widget').trigger('click')
                                     }
                                     let code = $(event.target).attr('code')
                                     let qid = await getQid(code)
                                     if (qid.length != 0) {
                                         window.curr_code = code.slice(0,5)
                                         window.quiz_order_in_same_topic = 0
                                         window.quiz_code = code
                                         window.qid = qid[0].qid
                                         showPage(window.qid)
                                         refreshQuizColor(code, 'quiz')
                                         refreshQuizColor(window.quiz_code.slice(0,7), 'topic')
                                         return
                                     }
                                     showNoQuizAlert('feedbackBox', 'SORRY~ 題庫目前沒有這個主題，我們會盡快補齊！')
                                     refreshQuizColor(window.quiz_code.slice(0,7), 'topic')
                                 })
                                 .html(lv2_3_topic.topic)
                             await lv3_wrapper
                                        .append(lv3)
                                        .append('<br>')
                     })
                     await lv2_wrapper.append(lv2)
                     await lv2.after(lv3_wrapper)
         })
         await li.append(lv1)
         await lv1.after(lv2_wrapper)
     })
     await $('div.topic_field').append(
         root.append(
             li.append(
                 ul
             )
         )
     )
     nestedList()
     refreshQuizColor(window.quiz_code.slice(0,-1), 'topic')
     await $(`[code="${window.quiz_code.slice(0,3)}"]`).trigger('click')
     await $(`[code="${window.quiz_code.slice(0,5)}"]`).trigger('click')
}

function nestedList() {
    $('.toggle').click(function(e) {
        e.preventDefault();
      
        var $this = $(this);
      
        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
        } else {
            $this.parent().parent().find('li .inner').removeClass('show');
            $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
        }
    });
}
