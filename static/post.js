function voteQuestion(e) {
    let post_vote = $(e.target).parent().find('.post_vote')
    let QA_id = $(e.target).parent().attr('qa_id')
    let vote = parseInt($(post_vote).html())
    let hasVoted = window.voted.has(QA_id) ? 1 : 0
    let data =  {
        quiz_id: window.quiz_id,
        QA_id: QA_id
    }
    if (hasVoted) {
        $(post_vote).html(vote - 1)
        window.voted.delete($(post_vote).attr('id'))
    } else {
        fetch('../api/vote/give', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        })
        $(post_vote).html(vote + 1)
        window.voted.add($(post_vote).attr('id'))
    }
}
