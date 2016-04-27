'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _kue = require('kue');

var _kue2 = _interopRequireDefault(_kue);

var _logger = require('../util/logger');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _parseCsv = require('./parseCsv');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_bluebird2.default.promisifyAll(_mongoose2.default.Model);
_bluebird2.default.promisifyAll(_mongoose2.default.Model.prototype);
_bluebird2.default.promisifyAll(_mongoose2.default.Query.prototype);

var Background = function () {
  function Background() {
    var _this = this;

    _classCallCheck(this, Background);

    if (_env2.default.env === 'production') {
      this.queue = _kue2.default.createQueue({
        redis: _env2.default.secrets.redisToGo
      });
    } else {
      this.queue = _kue2.default.createQueue();
    }

    this.timeoutKey;
    _mongoose2.default.connect(_env2.default.db.url);

    this.working = false;
    this.queue.on('job enqueue', function (id, type) {
      _logger.logger.log('Job ' + id + ' queued of type ' + type);
      _this.startJob(type);
    });
  }

  _createClass(Background, [{
    key: 'onComplete',
    value: function onComplete(result) {
      var _this2 = this;

      _logger.logger.log('Job complteted');
      this.working = false;
      this.startJob();
      if (this.timeoutKey) {
        clearTimeout(this.timeoutKey);
      }

      this.timeoutKey = setTimeout(function () {
        _this2.working = false;
      }, 60000 * 6);
    }
  }, {
    key: 'onFailed',
    value: function onFailed() {
      _logger.logger.log('Job failed', arguments);
      this.working = false;
    }
  }, {
    key: 'onFailedAttempt',
    value: function onFailedAttempt() {
      _logger.logger.log('Job failed to start');
    }
  }, {
    key: 'addJob',
    value: function addJob(name) {
      var _this3 = this;

      return new _bluebird2.default(function (yes, no) {
        var job = _this3.queue.create(name);

        job.attempts(1).save(function (err) {
          if (err) {
            _logger.logger.error(err);
            no(err);
          } else {
            yes(job);
          }
        });

        job.on('complete', _this3.onComplete.bind(_this3));
        job.on('failed', _this3.onFailed.bind(_this3));
        job.on('failed attempt', _this3.onFailedAttempt.bind(_this3));
      });
    }
  }, {
    key: 'pickWorker',
    value: function pickWorker(jobName, job, done) {
      console.log('pick worker');
      var task = void 0;
      if (jobName === 'csv') {
        task = (0, _parseCsv.handleJob)(job);
      }

      if (jobName === 'phone') {
        task = (0, _parseCsv.scrubPhones)(job);
      }

      task.then(function () {
        done();
      }).catch(function (e) {
        done(e);
      });
    }
  }, {
    key: 'startJob',
    value: function startJob() {
      var _this4 = this;

      var jobName = arguments.length <= 0 || arguments[0] === undefined ? 'csv' : arguments[0];

      if (this.working) {
        _logger.logger.log('I am busy bitch');
      }

      this.queue.process(jobName, function (job, done) {
        _this4.working = true;
        _logger.logger.log('about to process');
        _this4.pickWorker(jobName, job, done);
      });
    }
  }]);

  return Background;
}();

exports.default = Background;