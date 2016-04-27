'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _leads = require('./leads.controller');

var controller = _interopRequireWildcard(_leads);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = _express2.default.Router();
router.param('id', controller.$param);
router.get('/search', controller.$search);
router.get('/upload', controller.$sign);
router.post('/supress', controller.$supress);
router.route('/').get(controller.$get).post(controller.$post).put(controller.$putMany).delete(controller.$destroyMany);

router.route('/:id').get(controller.$getOne).put(controller.$put);

exports.default = router;