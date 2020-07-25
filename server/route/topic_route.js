const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getTopic
} = require('../controller/topic_controller')

router.route('/topic')
    .get(wrapAsync(getTopic))

module.exports = router
