const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getQAData,
    postQ
} = require('../controller/QA_controller')

router.route('/QA/getQAData')
    .get(wrapAsync(getQAData))

router.route('/QA/postQ')
    .post(wrapAsync(postQ))

module.exports = router
