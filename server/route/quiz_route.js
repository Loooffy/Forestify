const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getQuizData,
    getSameTopicQuiz,
    getQid,
} = require('../controller/quiz_controller')

router.route('/quiz/getQuizData')
    .get(wrapAsync(getQuizData))

router.route('/quiz/same_topic')
    .get(wrapAsync(getSameTopicQuiz))

router.route('/quiz/getQid')
    .get(wrapAsync(getQid))

module.exports = router
