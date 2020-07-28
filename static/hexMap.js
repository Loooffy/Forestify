function mapInit() {
    $('path')
        .on('mouseup', (event) => {
            $(event.target)
                .next()
                .html(window.dragged_title)
        })
}
