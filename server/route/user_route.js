const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    signUp,
    signIn,
    isLogged,
    getStatus,
} = require('../controller/user_controller')

router.route('/user/signup')
    .post(wrapAsync(signUp))

router.route('/user/signin')
    .post(wrapAsync(signIn))
    
router.route('/user/status')
    .post(isLogged, wrapAsync(getStatus))

module.exports = router
