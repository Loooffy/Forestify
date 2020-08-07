function removeTree(code) {
    $(`img[code="${code}"]:lt(3)`).remove()
}

async function mapInit() {
    $('.hex_map path')
        .click(async (event) => {
            let lv1Toggle = $(`a[code='${$(event.target).attr("code").slice(0,3)}']`)
            let lv2Toggle = $(`a[code='${$(event.target).attr("code").slice(0,5)}']`)
            if (lv1Toggle.next().css('display') === 'none') {
                await lv1Toggle.trigger('click')
            }
            if (lv2Toggle.next().css('display') === 'none') {
                await lv2Toggle.trigger('click')
            }
        })
        .on('mouseup', async (event) => {
            $('.helper').remove()
            event.stopPropagation()
            event.stopImmediatePropagation()
            let x = $(event.target).attr('x')
            let y = $(event.target).attr('y')
            let text = $(`a[code='${window.tree_code}']`).html()
            text = text ? text : ''
            let token = getToken()
            token = token ? token : null
            let formData = {
                code: window.tree_code,
                text: text.slice(3,),
                xy: `${x},${y}`
            }

            let result = await ajaxReq('/api/map/postMap', formData, 'POST', token)

            if (result.err) {
                showFeedBack('feedbackBox', '這個主題已經種過囉～', null, false)
                console.log(result)
                console.log('here')
                return
            }

            try {
                let x = $(event.target).attr('x')
                let y = $(event.target).attr('y')
                window.treePlanted[window.tree_code]['xy'] = 
                    { 
                        x: x,
                        y: y
                    }
                let text = $(`a[code='${window.tree_code}']`).html().slice(3,)
                $(`a[code='${window.tree_code}']`).html(text)
                text = text.length < 6 ? text : text.slice(0, 6) + '..'
                
                $('#text_map')
                    .find(`text[x=${x}]`)
                    .filter(`text[y=${parseInt(y)+15}]`)
                    .attr('code', window.tree_code)
                    .html(text)

                $('#tree_map')
                    .find(`text[x=${x}]`)
                    .filter(`text[y=${parseInt(y)-15}]`)
                    .attr('code', window.tree_code)
                    .html('🌲')

                $('path')
                    .filter(`[x=${parseInt(x)}]`)
                    .filter(`[y=${parseInt(y)}]`)
                    .attr('code', window.tree_code)
                
            delete window.tree_code
            } catch {
                return
            }
        })
}

function refreshPlantedTitle () {
    let code = window.tree_code
    console.log(code)
    $(`[code='${code}']`).html($(`[code='${code}']`).html().slice(3,))
    return
}

async function plantTree(x, y, code, amount) {
    console.log('xy', x, y)
	let arr = Array(amount * 3).fill(1)
    for (i of arr) {
        let timeToDelay = 160
        await delay(timeToDelay)
        $($('.tree_planted'))
            .append(
                $('<img>')
                    .attr('code', code)
                    .attr('src', 'https://forestify.theshinings.online/static/image/tree.gif')
                    .css('left', `${(parseInt(x) + ran(0, 30) * (ran(0 ,2) === 0 ? 1: -1)) - 40}px`)
                    .css('top', `${(parseInt(y) + ran(0, 30) * (ran(0 ,2) === 0 ? 1: -1)) - 55}px`)
                    .css('width', `${ran(1, 4)}rem`)
            )
        console.log('foo')
    }
}
