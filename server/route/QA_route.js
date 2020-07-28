const router = require('express').Router();
const {wrapAsync} = require('../../util/util');
const {
    isLogged
} = require('../controller/user_controller')

const {
    getQAData,
    postQ
} = require('../controller/QA_controller')

router.route('/QA/getQAData')
    .get(wrapAsync(getQAData))

router.route('/QA/postQ')
    .post(isLogged, wrapAsync(postQ))

module.exports = router
