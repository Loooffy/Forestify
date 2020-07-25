const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getTopic
} = require('../controller/topic_controller')

router.route('/mj/:topic1/:topic2')
    .get(wrapAsync(getTopic))

module.exports = router
