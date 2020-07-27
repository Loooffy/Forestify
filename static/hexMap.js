function mapInit() {
    $('path')
        .find('text')
        .html('okokokokk')
        .droppable({
            drop: (event, ui) => {
                $(this)
                    .find('text')
                    .html('tree~')
                console.log('drop')
            }
        })
}
