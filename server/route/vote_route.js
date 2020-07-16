const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    getVote,
    giveVote
} = require('../controller/vote_controller')



router.route('/vote/get')
    .get(wrapAsync(getVote))

router.route('/vote/give')
    .post(wrapAsync(giveVote))

module.exports = router
