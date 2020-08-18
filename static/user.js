function statusFilter(status) {

    let {...constraint} = {...window.constraints}
    constraint.grade = constraint.grade.length === 0 ? ['7', '8', '9'] : constraint.grade
    constraint.correct = constraint.correct.length === 0 ? ['1', '0'] : constraint.correct

    let comparison = 
        (constraint.correct.includes(status.correct.toString()) &&
        constraint.grade.includes(status.code.slice(5,6)) ||
        constraint.all) &&
        !constraint.none

    return comparison
}

function showContent() {

    let statusBoxContent = $('div.box_content')
    statusBoxContent.empty()

    let status = JSON.parse(window.status)

    status
        .filter((s) => statusFilter(s))
        .map(s => {
        $('<div>')
            .addClass('status_quiz_row')
            .attr('code', s.code)
            .click(async (event) => {
                let code = $(event.target).parent().attr('code')
                window.quiz_code = code
                let qid = await getQid(code)
                qid = qid[0].qid
                if (qid) {
                    console.log(window.statusBoxOn)
                    window.qid = qid
                    $('.not_map').css('display', 'none')
                    showPage(qid)
                    toggleFade(window.statusBoxOn, 'status_box')
                    $('.math_widget').trigger('click')
                    return
                }
            })
            .append(
                $('<div>')
                    .addClass('status_quiz_time')
                    .html(s.time.split('T')[0])
            )
            .append(
                $('<div>')
                    .addClass('lv1 topic')
                    .html(s.lv1_topic)
            )
            .append(
                $('<div>')
                    .addClass('lv2 topic')
                    .html(s.lv2_topic)
            )
            .append(
                $('<div>')
                    .addClass('lv3 topic')
                    .html(s.lv3_topic)
            )
            .append(
                $('<div>')
                    .addClass('status_quiz_tried')
                    .html(s.quiz_title)
            )
            .append(
                $('<div>')
                    .addClass('status_quiz_check')
                    .addClass(s.correct === 1 ? 'status_quiz_correct' : 'status_quiz_falied')
                    .html(s.correct === 1 ? '答對' : '答錯')
                    //.draggable()
            )
            .appendTo(statusBoxContent)
    })
}

async function showStatus() {

    let token = getToken()
    token = token ? token : ""

    let result = await ajaxReq('/api/user/status', null, 'GET', token)

    if (result.signBlock) {
        $('body').append(result.signBlock)
        return
    }

    window.status = JSON.stringify(result)

    window.statusBoxOn = !window.statusBoxOn
    if (statusBoxOn === false) {
        toggleFade(window.statusBoxOn, 'status_box')
        return
    }

    toggleFade(window.statusBoxOn, 'status_box')
    
    let statusBox = $('<div>')
        .addClass('status_box widget_box')
        .append(
            $('<div>')
                .addClass('box_title')
                .html('學習紀錄')
        )
    
    let filterField = 
        $('<div>')
            .addClass('filter_field')
            .appendTo(statusBox)

    let options = {
        '全選': ['all', true],
        '答對': ['correct', 1],
        '答錯': ['correct', 0],
        '國一': ['grade', '7'],
        '國二': ['grade', '8'],
        '國三': ['grade', '9']
    }
    
    Object.keys(options).slice(1,).map(option => {
        $('<div>')
            .addClass('filter_key')
            .attr('field', options[option][0])
            .attr('option', options[option][1])
            .click((event) => {
                let field = $(event.target).attr('field')
                let option_value = $(event.target).attr('option')
                window.constraints[field].push(option_value)
                console.log(window.constraints)
                showContent()
                $(event.target)
                    .next()
                    .toggle()
                $(event.target)
                    .toggle()
            })
            .after(
                $('<div>')
                    .addClass('filter_key filter_key_on')
                    .attr('field', options[option][0])
                    .attr('option', options[option][1])
                    .click(async (event) => {
                        let field = await $(event.target).attr('field')
                        let option_value = await $(event.target).attr('option')
                        let index = await window.constraints[field].indexOf(option_value)
                        await window.constraints[field].splice(index, index + 1)
                        console.log(window.constraints)
                        showContent()
                        $(event.target)
                            .prev()
                            .toggle()
                        $(event.target)
                            .toggle()
                    })
                    .html(option)
            )
            .html(option)
            .appendTo(filterField)
    })

    let statusBoxContent = await $('<div>')
        .addClass('box_content')
        .appendTo(statusBox)

    $('body').append(statusBox)

    await showContent()
    $('<div>')
        .html('回主頁')
        .addClass('box_close')
        .click(showStatus)
        .appendTo(statusBox)
}

async function showMyQA() {

    let token = getToken()
    token = token ? token : ""

    let myQA = await ajaxReq('/api/user/my_QA', null, 'GET', token)

    if (myQA.signBlock) {
        $('body').append(myQA.signBlock)
        return
    }

    window.myQABoxOn = !window.myQABoxOn
    if (myQABoxOn === false) {
        toggleFade(window.myQABoxOn, 'myQA_box')
        return
    }

    toggleFade(window.myQABoxOn, 'myQA_box')
    
    let myQABox = $('<div>')
        .addClass('myQA_box widget_box')
        .append(
            $('<div>')
                .addClass('box_title')
                .html('問答紀錄')
        )
        .appendTo('body')

    let statusBoxContent = $('<div>')
        .addClass('box_content')
        .appendTo(myQABox)

    let QA_row = getTemplate('QA')
    let mix = ''

    myQA.map(qa => {
        QA_row.find(".post_status").attr({
            qa_id: qa.id,
            qid: qa.qid,
            getter_id: qa.owner_id
        })
        QA_row.find(".post_title").text(qa.title)
        QA_row.find(".post_content").text(qa.content)
        QA_row.find(".post_time").text(qa.post_time)
        QA_row.find(".post_owner").text(qa.owner_name)
        QA_row.find(".post_vote").text(qa.total_votes)
        let topic = 
            $('<div>')
                .addClass('QA_topic_field')
                .append(
                    $('<div>')
                        .addClass('QA_topic')
                        .html(qa.topic1)
                )
                .append(
                    $('<div>')
                        .addClass('QA_topic')
                        .html(qa.topic2)
                )
                .append(
                    $('<div>')
                        .addClass('QA_topic')
                        .html(qa.topic3)
                )
        mix += topic[0].outerHTML + QA_row[0].outerHTML
    })

    statusBoxContent
        .html(mix)

    $('<div>')
        .html('回主頁')
        .addClass('box_close')
        .click(showMyQA)
        .appendTo(myQABox)
}

async function showMap() {
    if (!getToken()) {
        window.hinted = true
        return
    }
    window.hinted = true

    switch ($('.not_map').css('display')) {
        case 'none':
            $('.same_topic_quiz_field').css('display', 'flow-root')
            await $('.not_map').css('display', 'flex')
            $('.hint_box').css('display', 'none')
            $('.hint_box').css('visibility', 'hidden')
            $('#hex_map').css('display', 'none')
            $('#text_map').css('display', 'none')
            $('#hex_map').css('visibility', 'hidden')
            $('#text_map').css('visibility', 'hidden')
            $('.map_widget').css('display', 'flow-root')
            $('.math_widget').css('display', 'none')
            break
        default:
            $('.same_topic_quiz_field').css('display', 'none')
            $('.not_map').css('display', 'none')
            $('.hint_box').css('display', 'flow-root')
            $('.hint_box').css('visibility', 'visible')
            $('#hex_map').css('display', 'flow-root')
            $('#text_map').css('display', 'flow-root')
            $('#hex_map').css('visibility', 'visible')
            $('#text_map').css('visibility', 'visible')
            $('.map_widget').css('display', 'none')
            $('.math_widget').css('display', 'flow-root')
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,'question'])
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,'answer'])
            break
    }
}

async function treeMapInit() {
    window.treeDrawed = true
    
    let token = getToken()
    token = token ? token : null

    let treePlanted = await ajaxReq('/api/map/getTree', null, 'GET', token)

    if (treePlanted.signBlock) {
        $('body').append(treePlanted.signBlock)
        return
    }

    if (treePlanted.length != 0) {
        treePlanted.map(async (tree) => {

            let x = tree.xy.split(',')[0]
            let y = tree.xy.split(',')[1]

            plantTree(
                x,
                y,
                tree.code,
                tree.amount
            )

            $('#text_map')
                .find(`text[x=${x}]`)
                .filter(`text[y=${parseInt(y)+15}]`)
                .attr('code', tree.code)
                .html(tree.text.length < 6 ? tree.text : tree.text.slice(0,6) + '..')

            $('#tree_map')
                .find(`text[x=${x}]`)
                .filter(`text[y=${parseInt(y)-15}]`)
                .attr('code', tree.code)
                .html('🌲')

            $('path')
                .filter(`[x=${parseInt(x)}]`)
                .filter(`[y=${parseInt(y)}]`)
                .attr('code', tree.code)

            treePlanted.map(tree => {
                $(`a[code='${tree.code}']`).html(tree.text)
            })
        })
    }
}

function toggleFade(boxOff, className) {
    let toFade = $('.not_map')
    switch (boxOff) {
        case true:
            toFade.addClass('fadeToBack')
            console.log('show')
            break
        case false:
            toFade.removeClass('fadeToBack')
            if (!className) {
                return
            }
            let selector = `div.${className}`
            $(selector).remove()
            console.log('remove')
            break
    }
}

async function showTreePoint() {
    let token = getToken()
    token = token ? token : null

    let result = await ajaxReq('/api/user/tree_point', null, 'GET', token)

    let treePoint = result.treePoint ? result.treePoint : 0
    
    $('<div>')
        .addClass('tree_point')
        .append(
            $('<span>')
            .html((Array(4).join('0') + treePoint).slice(-4))
        )
        .append(
            $('<div>')
                .addClass('tree_icon')
                .html('🌲')
        )
        .appendTo(body)
}
