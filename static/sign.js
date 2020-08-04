function closeSign(e) {
    console.log(window.statusBoxOn, window.myQABoxOn)

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
