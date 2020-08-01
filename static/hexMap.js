function mapInit() {
    $('path')
        .on('mouseup', (event) => {
            window.treePlanted[window.curr_code]['xy'] = 
                {
                    x: $(event.target).next().attr('x'),
                    y: $(event.target).next().attr('y')
                }
            $(event.target)
                .next()
                //.html(window.dragged_title)
                .html('整數與數線')
        })
}

async function plantTree(code, x, y) {
	let arr = Array(ran(3, 5)).fill(1)
    for (i of arr) {
        await delay()
        $(body)
            .append(
                $('<img>')
                    .attr('src', '/static/image/treemove.gif')
                    .css('position', 'fixed')
                    .css('left', `${x + ran(0, 60)}px`)
                    .css('top', `${y + ran(0, 60)}px`)
                    .css('opacity', '0.75')
                    .css('width', `${ran(1, 4)}rem`)
            )
        console.log('foo')
    }
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
