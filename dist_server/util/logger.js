'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; // no var needed here, colors will attached colors
// to String.prototype


var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _env = require('../config/env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create a noop (no operation) function for when loggin is disabled

var noop = function noop() {};

// check if loggin is enabled in the config
// if it is, then use console.log
// if not then noop
var consoleLog = _env.config.logging ? console.log.bind(console) : noop;

var logger = {
  log: function log() {
    var tag = _chalk2.default.white.bold('✨✨ ');

    // arguments is an array like object with all the passed
    // in arguments to this function
    var args = _lodash2.default.toArray(arguments).map(function (arg) {
      if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
        // turn the object to a string so we
        // can log all the properties and color it
        var string = JSON.stringify(arg, null, 2);
        return _chalk2.default.bold.cyan(string);
      } else if (_lodash2.default.isNumber(arg)) {

        return _chalk2.default.magenta(arg);
      } else if (_lodash2.default.isFunction(arg)) {

        var funcName = void 0;

        if (arg.name) {
          funcName = ': ' + arg.name;
        }

        return _chalk2.default.yellow('[Function' + funcName + ']');
      } else {

        return _chalk2.default.green(arg);
      }
    });

    args.unshift(tag);

    // call either console.log or noop here
    // with the console object as the context
    // and the new colored args :)
    consoleLog.apply(console, args);
  },
  error: function error(_error) {
    for (var _len = arguments.length, messages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      messages[_key - 1] = arguments[_key];
    }

    var logArgs = messages.map(function (arg) {
      var log = _chalk2.default.red(arg);
      return log;
    });

    console.error.apply(console, logArgs);
    console.error(_error);
  }
};

exports.logger = logger;