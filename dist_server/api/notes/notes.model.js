'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Notes = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var NotesSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers',
    required: true
  },
  createdAt: {
    type: Date
  }
});

NotesSchema.pre('save', function (next) {
  var now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

var Notes = exports.Notes = _mongoose2.default.model('notes', NotesSchema);