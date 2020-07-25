const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getQuizData,
    getSameTopicQuiz
} = require('../controller/quiz_controller')

router.route('/quiz/getQuizData')
    .get(wrapAsync(getQuizData))

router.route('/quiz/same_topic')
    .get(wrapAsync(getSameTopicQuiz))

module.exports = router
