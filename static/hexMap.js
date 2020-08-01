function mapInit() {
    $('path')
        .on('mouseup', async (event) => {
            //if (Object.keys(window.treePlanted).includes(window.tree_code)) {
            //    console.log('planted')
            //    await showFeedBack('feedback', '這個主題已經被種過囉～')
            //    return
            //}
            try {
                let x = $(event.target).attr('x')
                let y = $(event.target).attr('y')
                window.treePlanted[window.tree_code]['xy'] = 
                    { 
                        x: x,
                        y: y
                    }
                let text = $(`a[code='${window.tree_code}']`).html()
                text = text.length < 8 ? text.slice(3,) + '..' : text.slice(3, 8) + '..'
                
                $('#text_map')
                    .find(`text[x=${x}]`)
                    .filter(`text[y=${parseInt(y)+15}]`)
                    .html(text)

                $('#tree_map')
                .find(`text[x=${x}]`)
                .filter(`text[y=${parseInt(y)-15}]`)
                    .html('🌲')
                
            delete window.tree_code
            //refreshPlantedTitle()
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


async function plantTree(x, y, code) {
	let arr = Array(3).fill(1)
    for (i of arr) {
        await delay()
        $(body)
            .append(
                $('<img>')
                    .addClass('tree_planted')
                    .attr('code', code)
                    .attr('src', '/static/image/treemove.gif')
                    .css('left', `${(parseInt(x) + ran(0, 30) * (ran(0 ,2) === 0 ? 1: -1)) - 40}px`)
                    .css('top', `${(parseInt(y) + ran(0, 30) * (ran(0 ,2) === 0 ? 1: -1)) - 55}px`)
                    .css('width', `${ran(1, 4)}rem`)
            )
        console.log('foo')
    }
}

function removeTree(code) {
    $(`img[code="${code}"]:lt(3)`).remove()
}

function delay() {   
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('我是傳下去的值');
    }, 160);
  });
}

function ran(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
