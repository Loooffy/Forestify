const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getQuizData
} = require('../controller/quiz_controller')

router.route('/quiz/getQuizData')
    .get(wrapAsync(getQuizData))

module.exports = router
