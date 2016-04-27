'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _orders = require('./orders.controller');

var controller = _interopRequireWildcard(_orders);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = _express2.default.Router();
router.param('id', controller.$param);
router.get('/broker', controller.$getForBroker);
router.post('/', controller.$create);

// .post(controller.$post)
// router.get('/redownload', controller.$redownload);

router.get('/pair/:order', controller.$getOrderPair);

// router.get('/create', controller.$create);
router.get('/preorder', controller.$preorder);

router.post('/batch/:broker', controller.$batchOrderPairs);
router.route('/:id').get(controller.$getOne).put(controller.$put).delete(controller.$destroy);

exports.default = router;