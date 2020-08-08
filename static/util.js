function showFeedBack(className, content, correct, valid) {
    let feedBackBox = $(`<div class='feedbackBox'>`)
        .css('z-index', '500')
        .html(content)
        .append(
            $('<div>')
                .addClass('ok')
                .click(ok)
                .html('好喔')
        )
        .appendTo($('body'))

    if (correct === true) {
        feedBackBox
            .prepend(
                $('<div>')
                    .addClass('feedback_icon')
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
                    .addClass('feedback_icon')
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
                    .addClass('feedback_icon')
                    .html(valid ? '🌲' : '🚜')
            )
        return
    }
}

function invalidInput(inputs) {
    if (inputs.includes('')) {
        return true
    } else {
        return false
    }
}

function delay(timeToDelay) {   
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('');
    }, timeToDelay);
  });
}

function ran(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getToken() {
    let regex = /token=(.*?);|token=(.*?)$/
    let token = document.cookie.match(regex)
    token = token ? token.slice(1,3).filter(t => t != undefined)[0] : null
    return token
}

function ajaxReq(url, data, method, token) {
    let req = {
        url: url,
        type: method,
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(data),
        headers: {
            "Authorization": "Bearer " + token
        },
    }

    if (method === 'GET') {
        req.data = data
        delete req.contentType
        delete req.processData
    }

    if (!data) {
        delete req.data
    }

    let result = $.ajax(req)

    return result
}

