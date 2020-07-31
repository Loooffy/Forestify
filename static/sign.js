function closeSign(e) {
    window.statusBoxOn = !window.statusBoxOn
    toggleFade(window.statusBoxOn, 'status_box')
    window.myQABoxOn = !window.myQABoxOn
    toggleFade(window.myQABoxOn, 'myQA_box')
    console.log(window.statusBoxOn, window.myQABoxOn)
    $(e.target)
        .parent()
        .attr('style', 'display:none')
}
