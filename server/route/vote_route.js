const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    isLogged
} = require('../controller/user_controller')

const {
    getVote,
    giveVote,
    removeVote,
    voteBack
} = require('../controller/vote_controller')

router.route('/vote/get')
    .get(wrapAsync(getVote))

router.route('/vote/give')
    .post(isLogged, wrapAsync(giveVote))

router.route('/vote/remove')
    .patch(wrapAsync(removeVote))

router.route('/vote/voteBack')
    .patch(isLogged, wrapAsync(voteBack))


module.exports = router
