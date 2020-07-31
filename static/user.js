function getToken() {
    let regex = /token=(.*?);|token=(.*?)$/
    let token = document.cookie.match(regex)
    token = token ? token.slice(1,3).filter(t => t != undefined)[0] : null
    console.log(token)
    return token
}

function statusFilter(status) {
    //let constraint = {
    //    all: false,
    //    none: false,
    //    correct: [1],
    //    //topic: [],
    //    grade: ['7','8','9'],
    //}

    let {...constraint} = {...window.constraints}
    console.log(constraint)
    constraint.grade = constraint.grade.length === 0 ? ['7', '8', '9'] : constraint.grade
    constraint.correct = constraint.correct.length === 0 ? ['1', '0'] : constraint.correct
    console.log(constraint)

    let comparison = 
        (constraint.correct.includes(status.correct.toString()) &&
        //constraint.topic.includes(status.correct) &&
        constraint.grade.includes(status.code.slice(5,6)) ||
        constraint.all) &&
        !constraint.none

    return comparison
}

function showContent() {

    let statusBoxContent = $('div.box_content')
    statusBoxContent.empty()

    let status = JSON.parse(window.status)
    console.log(status)

    status
        .filter((s) => statusFilter(s))
        .map(s => {
        $('<div>')
            .addClass('status_quiz_row')
            .attr('code', s.code)
            .click(async (event) => {
                console.log(event.target)
                let code = $(event.target).parent().attr('code')
                window.quiz_code = code
                let qid = await getQid(code)
                if (qid) {
                    window.qid = qid
                    showPage(qid)
                    toggleFade(window.statusBoxOn, 'status_box')
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

    window.statusBoxOn = !window.statusBoxOn
    if (statusBoxOn === false) {
        toggleFade(window.statusBoxOn, 'status_box')
        return
    }
    toggleFade(window.statusBoxOn, 'status_box')

    let token = getToken()
    token = token ? token : ""
    let formData = {
        token: token
    }
    
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

    //if (!window.status) {
        let result = await $.ajax({
            url: '../api/user/status',
            type: 'POST',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify(formData),
        })

        if (result.signBlock) {
            //window.statusBoxOn = !window.statusBoxOn
            $('body').append(result.signBlock)
            return
        }

        window.status = JSON.stringify(result)
    //}

    $('body').append(statusBox)

    await showContent()
    $('<div>')
        .html('回主頁')
        .addClass('box_close')
        .click(showStatus)
        .appendTo(statusBox)
}

async function showMyQA() {
    window.myQABoxOn = !window.myQABoxOn
    toggleFade(window.myQABoxOn, 'myQA_box')

    let token = getToken()
    token = token ? token : ""
    let formData = {
        token: token
    }

    let myQA = await $.ajax({
        url: '../api/user/my_QA',
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(formData),
    })

    console.log(myQA.signBlock)

    if (myQA.signBlock) {
        console.log('return')
        $('body').append(myQA.signBlock)
        return
    }
    
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
    

function showMap() {
    switch ($('.not_map').css('visibility')) {
        case 'visible':
            $('.not_map').css('visibility', 'hidden')
            $('.topic_field').css('visibility', 'visible')
            $('.hex_map').css('visibility', 'visible')
            break
        case 'hidden':
            $('.not_map').css('visibility', 'visible')
            $('.hex_map').css('visibility', 'hidden')
            break
    }
}

function toggleFade(boxOn, className) {
    //window.statusBoxOn = !window.statusBoxOn
    let toFade = $('.not_map')
    switch (boxOn) {
        case true:
            toFade.addClass('fadeToBack')
            console.log('show')
            break
        case false:
            let selector = `div.${className}`
            toFade.removeClass('fadeToBack')
            $(selector).remove()
            console.log('remove')
            break
    }
}

async function showTreePoint() {
    let token = getToken()
    token = token ? token : ""
    let formData = {
        token: token
    }

    let result = await $.ajax({
        url: '../api/user/tree_point',
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(formData),
    })
    
    $('<div>')
        .addClass('tree_point')
        .append(
            $('<span>')
            .html((Array(4).join('0') + result.treePoint).slice(-4))
        )
        .append(
            $('<div>')
                .addClass('tree_icon')
                .html('🌲')
        )
        .appendTo(body)
}
