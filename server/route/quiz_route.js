const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
  isLogged,
} = require('../controller/user_controller');

const {
  getQuizData,
  getSameTopicQuiz,
  getQid,
  postAnswer,
} = require('../controller/quiz_controller');

router.route('/quiz/getQuizData')
    .get(wrapAsync(getQuizData));

router.route('/quiz/same_topic')
    .get(wrapAsync(getSameTopicQuiz));

router.route('/quiz/getQid')
    .get(wrapAsync(getQid));

router.route('/quiz/postAnswer')
    .post(isLogged, wrapAsync(postAnswer));

module.exports = router;
