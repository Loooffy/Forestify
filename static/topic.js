async function showTopic() {
    window.topic = await $.get('api/topic').then(r => JSON.parse(r))
    let lv1_topics = window.topic.filter(r => r.code.length === 3)
    let lv2_topics = window.topic.filter(r => r.code.length === 5)
    let lv3_topics = window.topic.filter(r => r.code.length === 7)
    let root = $('<ul>').addClass('accordion')
    let ul = $('<ul>').addClass('inner')
    let li = $('<li>')
    await lv1_topics.map(lv1_topic => {
         let lv1 =
             $('<a>')
                 .addClass('toggle')
                 .attr('code', lv1_topic.code)
                 .attr('href', "javascript:void(0)")
                 .click(event, async () => {
                     let code = $(event.target).attr('code')
                 })
                 .html(lv1_topic.topic)
         let lv2_wrapper = $('<div class="inner"></div>')
         let lv1_2_topics = lv2_topics.filter(topic => topic.code.includes(lv1_topic.code))
         lv1_2_topics.map(lv1_2_topic => {
             let lv2 =
                 $('<a>')
                     .addClass('toggle')
                     .attr('code', lv1_2_topic.code)
                     .attr('href', "javascript:void(0)")
                     .on('dragstart', async () => {
                         window.dragged_title = $(event.target).html()
                     })
                     .html(`&#127794; ${lv1_2_topic.topic}`)
                     .draggable({
                        appendTo: body,
                        helper: 'clone'
                    })

                     let lv3_wrapper = $('<div class="inner"></div>')
                     let lv2_3_topics = lv3_topics.filter(topic => topic.code.includes(lv1_2_topic.code))
                     lv2_3_topics.map(lv2_3_topic => {
                         let lv3 =
                             $('<a>')
                                 .attr('code', lv2_3_topic.code)
                                 .attr('href', "javascript:void(0)")
                                 .click(event, async () => {
                                     let code = $(event.target).attr('code')
                                     let qid = await getQid(code)
                                     showPage(qid)
                                 })
                                 .html(lv2_3_topic.topic)
                                 .after('<br>')
                                 lv3_wrapper.append(lv3)
                     })
                     lv2.after(lv3_wrapper)
                     lv2_wrapper.append(lv2)
         })
         lv1.after(lv2_wrapper)
         li.append(lv1)
     })
     $('div.topic_field').append(
         root.append(
             li.append(
                 ul
             )
         )
     )
     nestedList()
}

function nestedList() {
    $('.toggle').click(function(e) {
        e.preventDefault();
      
        var $this = $(this);
      
        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
        } else {
            $this.parent().parent().find('li .inner').removeClass('show');
            $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
        }
    });
}
