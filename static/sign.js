function closeSign(e) {
    //window.statusBoxOn = !window.statusBoxOn
    //toggleFade(window.statusBoxOn, 'status_box')
    //window.myQABoxOn = !window.myQABoxOn
    //toggleFade(window.myQABoxOn, 'myQA_box')
    console.log(window.statusBoxOn, window.myQABoxOn)

//    $(e.target)
//        .parent()
//        .attr('style', 'display:none')

    let data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
    }

    fetch('/api/user/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    toggleFade(false, 'sign_field')
}
