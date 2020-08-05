const router = require('express').Router();
const {wrapAsync} = require('../../util/util');

const {
  isLogged,
} = require('../controller/user_controller');

const {
  getTree,
  postTree,
  postMap,
} = require('../controller/map_controller');

router.route('/map/getTree')
    .get(isLogged, wrapAsync(getTree));

router.route('/map/postTree')
    .post(isLogged, wrapAsync(postTree));

router.route('/map/postMap')
    .post(isLogged, wrapAsync(postMap));

module.exports = router;
