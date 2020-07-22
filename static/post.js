async function voteQuestion(e) {
    let post_vote = $(e.target).parent().find('.post_vote')
    let currentVote = parseInt($(post_vote).html())
    let QA_id = $(e.target).parent().attr('qa_id')
    let giver_id = 1
    let regex = /token=(.*?)[;"]/;
    let token = regex.exec(document.cookie)
    token = token ? token[1] : null
    let formData = JSON.stringify({
        quiz_id: window.quiz_id,
        QA_id: QA_id,
        giver_id: giver_id,
        token: token
    })
    let getVote = await $.ajax({
        url: '/api/vote/get',
        type: 'GET',
        data: JSON.parse(formData),
        contentType: 'application/json',
    })
    let vote = JSON.parse(getVote).data.vote
        
    switch (vote) {
        case null:
            console.log('not voted')
            $.ajax({
                url: '/api/vote/give',
                type: 'POST',
                contentType: 'application/json',
                data: formData
            })
            $(post_vote).html(currentVote + 1)
            break
        case 0:
            console.log('vote removed')
            $.ajax({
                url: '../api/vote/voteBack',
                type: 'PATCH',
                contentType: 'application/json',
                processData: false,
                data: formData,
                success: (r) => {
                    if (r.signBlock) {
                        $('body').append(r.signBlock)
                    }
                }
            })
            $(post_vote).html(currentVote + 1)
            break
        case 1:
            console.log('voted')
            $.ajax({
                url: '../api/vote/remove',
                type: 'PATCH',
                contentType: 'application/json',
                processData: false,
                data: formData
            })
            $(post_vote).html(currentVote - 1)
            break 
    }
}

async function postQuestion(e) {
    let title = $(e.target).parent().find(".post_Q_title")[0].value
    let content = $(e.target).parent().find(".post_Q_content")[0].value
    let time = new Date
    let timeStr = `${time.getUTCFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
    let temp = getTemplate('QA')
    let mix = ''

    let QA_id = await $.ajax({
        url: '../api/QA/postQ',
        type: 'POSt',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
            quiz_id: window.quiz_id,
            title: title,
            content: content,
            post_time: timeStr,
            owner_id: 1,
            head_id: 0,
        })
    })

    console.log(QA_id)
  
    temp.find(".post_status").attr({
        quiz_id: window.quiz_id,
        QA_id: QA_id
    })
    temp.find(".post_title").text(title)
    temp.find(".post_content").text(content)
    temp.find(".post_time").text(timeStr)
    temp.find(".post_owner").text('foo1')
    temp.find(".post_vote").text('0')
    mix += temp[0].outerHTML
    $('div.QA_field').prepend(mix)
    console.log(mix)
}
