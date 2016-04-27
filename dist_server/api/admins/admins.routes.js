'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _admins = require('./admins.controller');

var controller = _interopRequireWildcard(_admins);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../../util/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = _express2.default.Router();

router.route('/').get((0, _auth.isAuth)(), controller.$get).post((0, _auth.createAdmin)(), controller.$post);

router.post('/signin', (0, _auth.signInAdmin)(), controller.$signin);

router.use((0, _auth.isAuth)());
router.route('/me').put(controller.$put).get(controller.$getOne);

router.route('/:id').get(controller.$getOne).put(controller.$put).delete(controller.$destroy);

exports.default = router;