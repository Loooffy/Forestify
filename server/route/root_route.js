const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    renderQuizPage
} = require('../controller/root_controller')

router.route('/quiz')
    .get(wrapAsync(renderQuizPage))

module.exports = router
