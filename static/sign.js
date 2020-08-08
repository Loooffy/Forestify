async function closeSign(event) {

    if ($(event.target).hasClass('cancel')) {
        $('.sign_field').remove()
        return
    }

    toggleFade(false, 'sign_field')

    let data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
    }
    
    let valid = inputValid(Object.values(data))
    //await delay(1000)
    if (!valid) {
        console.log("HOHO");
        showFeedBack('feedbackBox', '有一些空格沒填到喔～', null, false)
        return
    }
    
    let result = await ajaxReq('/api/user/signup', data, 'POST')
    if (result.invalid === 'duplicateEmail') {
        showFeedBack('feedbackBox', '這個email已經被註冊過囉！再試一次', null, false)
        return
    }
    
    showFeedBack('feedbackBox', '註冊成功，可以開始種小樹囉～', null, true)
}
