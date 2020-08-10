async function closeSign(event) {

    if ($(event.target).hasClass('cancel')) {
        $('.sign_field').remove()
        return
    }

    let data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
    }

    let inValid = invalidInput(Object.values(data))
    if (inValid) {
        console.log("HOHO");
        showFeedBack('feedbackBox', '有一些空格沒填到喔～', null, false)
        return
    }
    
    let result = await ajaxReq('/api/user/signup', data, 'POST', null)
    if (result.invalid === 'duplicateEmail') {
        showFeedBack('feedbackBox', '這個email已經被註冊過囉！再試一次', null, false)
        return
    }
    
    await toggleFade(false, 'sign_field')
    await showQuiz(41882)
    showFeedBack('feedbackBox', '註冊成功，可以開始種小樹囉～', null, true)
}
