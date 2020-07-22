const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    signUp,
    signIn
} = require('../controller/user_controller')

router.route('/user/signup')
    .post(wrapAsync(signUp))

router.route('/user/signin')
    .post(wrapAsync(signIn))

module.exports = router
