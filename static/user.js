async function showStatus() {

    window.statusBoxOn = true
    toggleFade()

    let token = getToken()
    let formData = {
        token: token
    }
    
    let statusBox = $('<div>')
        .addClass('status_box')
        .append(
            $('<div>')
                .addClass('status_box_title')
                .html('學習紀錄')
        )

    let statusBoxContent = $('<div>')
        .addClass('status_box_content')
        .appendTo(statusBox)

    let status= await $.ajax({
        url: '../api/user/status',
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(formData),
    }).then(s => JSON.parse(s))

    status.map(s => {
        $('<div>')
            .addClass('status_quiz_row')
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
    $('<div>')
        .html('回主頁')
        .addClass('status_box_close')
        .click(closeStatus)
        .appendTo(statusBox)

    $('body').append(statusBox)
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

function toggleFade() {
    let toFade = $('.not_map')
    switch (window.statusBoxOn) {
        case true:
            toFade.addClass('fadeToBack')
            break
        case false:
            toFade.removeClass('fadeToBack')
            $('div.status_box').css('visibility', 'hidden')
            console.log(false)
            break
    }
}

function closeStatus() {
   window.statusBoxOn = false 
   toggleFade()
}
