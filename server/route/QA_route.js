const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getQAData
} = require('../controller/QA_controller')

router.route('/QA/getQAData')
    .get(wrapAsync(getQAData))

module.exports = router
