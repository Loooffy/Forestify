const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
    signUp,
    signIn,
    isLogged,
    getStatus,
    getTreePoint,
    getMyQA,
} = require('../controller/user_controller')

router.route('/user/signup')
    .post(wrapAsync(signUp))

router.route('/user/signin')
    .post(wrapAsync(signIn))
    
router.route('/user/status')
    .post(isLogged, wrapAsync(getStatus))

router.route('/user/tree_point')
    .post(isLogged, wrapAsync(getTreePoint))

router.route('/user/my_QA')
    .post(isLogged, wrapAsync(getMyQA))

module.exports = router
