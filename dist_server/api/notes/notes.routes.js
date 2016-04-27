'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notes = require('./notes.controller');

var controller = _interopRequireWildcard(_notes);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = _express2.default.Router();

router.route('/').get(controller.$get).post(controller.$post).get(controller.$getByBroker);

router.route('/:id').get(controller.$getOne).put(controller.$put).delete(controller.$destroy);

exports.default = router;