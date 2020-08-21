async function voteQuestion(e) {
    let post_vote = $(e.target).parent().find('.post_vote')
    let currentVote = parseInt($(post_vote).html())
    let QA_id = $(e.target).parent().attr('qa_id')

    let token =  getToken()
    token = token ? token : ''

    let data = {
        qid: window.qid,
        QA_id: QA_id,
    }

    let vote = await ajaxReq('/api/vote/get', data, 'GET', token)
        
    switch (vote) {
        case null:
            console.log('not voted')
            try {
                await ajaxReq('/api/vote/give', data, 'POST', token)
            } catch (err) {
                console.log('err', err)
            }
            $(post_vote).html(currentVote + 1)
            break
        case 0:
            console.log('vote removed')
            try {
                await ajaxReq('/api/vote/voteBack', data, 'PATCH', token)
            } catch (err) {
                console.log('err', err)
            }
            $(post_vote).html(currentVote + 1)
            break
        case 1:
            console.log('voted')
            try {
                await ajaxReq('/api/vote/remove', data, 'PATCH', token)
            } catch (err) {
                console.log('err', err)
            }
            $(post_vote).html(currentVote - 1)
            break 
    }
}

async function postQuestion(e) {
    if ($('.post_Q_content').val() === '' || $('.post_Q_title').val() === '') {
        await showFeedBack('feedbackBox', '還有空格沒填喔～', null, false)
        return
    }
        
    let title = $(e.target).parent().find(".post_Q_title")[0].value
    let content = $(e.target).parent().find(".post_Q_content")[0].value
    let time = new Date
    let timeStr = `${time.getUTCFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
    let temp = getTemplate('QA')
    let mix = ''

    let token =  getToken()
    token = token ? token : ''

    let data =  {
        qid: window.qid,
        title: title,
        content: content,
        post_time: timeStr,
        head_id: 0,
    }

    let QA_id = await ajaxReq('/api/QA/postQ', data, 'POST', token)
    if (QA_id.signBlock) {
        $('body').append(QA_id.signBlock) 
        return
    }
        
    temp.find(".post_status").attr({
        qid: window.qid,
        QA_id: QA_id
    })
    temp.find(".post_title").text(title)
    temp.find(".post_content").text(content)
    temp.find(".post_time").text(timeStr)
    temp.find(".post_owner").text('foo1')
    temp.find(".post_vote").text('0')
    mix += temp[0].outerHTML
    $('div.QA_field').prepend(mix)
    $('.post_Q_title').val('')
    $('.post_Q_content').val('')
    $('.QA_field').scrollTop(0)
}
