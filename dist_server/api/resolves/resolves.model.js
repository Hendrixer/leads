'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResolvesSession = exports.Resolves = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var ResolvesSchema = new Schema({
  dupe: {},

  lead: {},

  uuid: {
    type: String,
    required: true
  }
});

var ResolvesSessionSchema = new Schema({
  resolves: [{
    type: Schema.Types.ObjectId,
    ref: 'resolves'
  }]
});

var Resolves = exports.Resolves = _mongoose2.default.model('resolves', ResolvesSchema);
var ResolvesSession = exports.ResolvesSession = _mongoose2.default.model('resolvessession', ResolvesSessionSchema);