'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Admins = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var AdminsSchema = new Schema({
  email: {
    required: true,
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    uinique: true
  },

  password: {
    type: String,
    required: true
  },

  settings: {
    theme: {
      type: String,
      default: 'default'
    },
    email: {
      type: String
    }
  }
});

var Admins = exports.Admins = _mongoose2.default.model('admins', AdminsSchema);