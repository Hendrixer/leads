'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$destroyMany = exports.$put = exports.$putMany = exports.$post = exports.$getOne = exports.$get = exports.$search = exports.$param = exports.$supress = exports.$sign = undefined;

var _leads = require('./leads.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xlsxToJson = require('xlsx-to-json');

var _xlsxToJson2 = _interopRequireDefault(_xlsxToJson);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../../util/logger');

var _query = require('../query');

var _message = require('../../util/message');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var publisher = new _message.Publisher();

var toJson = _bluebird2.default.promisify(_xlsxToJson2.default);

var $sign = exports.$sign = function $sign(req, res, next) {
  _awsSdk2.default.config.update({
    accessKeyId: _env2.default.secrets.awsAccessKeyId,
    secretAccessKey: _env2.default.secrets.awsSecretAccessKey
  });
  var stamp = Date.now();
  var filename = req.query.filename + '-' + stamp;
  var s3 = new _awsSdk2.default.S3();
  var s3Params = {
    Bucket: _env2.default.secrets.awsS3Bucket,
    Key: filename,
    Expires: 60,
    ContentType: req.query.filetype,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function (err, data) {
    if (err) {
      next(err);
    } else {
      var resp = {
        filename: filename,
        signed_request: data,
        url: 'https://' + _env2.default.secrets.awsS3Bucket + '.s3.amazonaws.com/' + filename
      };
      res.json(resp);
    }
  });
};

var $supress = exports.$supress = function $supress(req, res, next) {
  var findDupes = Promise.all(req.body.numbers.map(function (number) {
    // number = number.replace(/-/g, '');
    // number = parseInt(number);
    if (_lodash2.default.isFinite(number)) {
      return _leads.Leads.isThere(number);
    } else {
      return false;
    }
  })).then(function (checks) {
    console.log(checks);
    var count = _lodash2.default.size(_lodash2.default.compact(checks));
    res.json({ dupes: count });
  }).catch(function (e) {
    next(e);
  });
};

var $param = exports.$param = function $param(req, res, next, id) {
  _leads.Leads.findByIdAsync(id).then(function (lead) {
    req.lead = lead || {};
    next();
  }).catch(function (e) {
    next(e);
  });
};

var $search = exports.$search = function $search(req, res, next) {
  var text = req.query.text;

  _leads.Leads.find({ $text: { $search: text } }, { score: { $meta: 'textScore' } }).sort({
    score: {
      $meta: 'textScore'
    }
  }).select('firstName lastName email address').lean().execAsync().then(function (leads) {
    res.json(leads);
  }).catch(function (e) {
    next(e);
  });
};

var $get = exports.$get = function $get(req, res, next) {
  if (req.query.count) {
    _leads.Leads.count({}).execAsync().then(function (count) {
      res.status(200).send({ count: count });
    });
  } else {
    (0, _query.query)(_leads.Leads.find.bind(_leads.Leads), req.query).then(function (leads) {
      res.json(leads);
    }).catch(next.bind.next);
  }
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {};

var $post = exports.$post = function $post(req, res, next) {
  res.send({ ok: true });
  publisher.queueJob('csv', { files: req.files });
};

var $putMany = exports.$putMany = function $putMany(req, res, next) {
  var queue = Promise.all(_lodash2.default.map(req.body.leads, function (lead) {
    return _leads.Leads.findOneAndUpdateAsync({
      $or: [{ email: lead.email }, { dupeKey: lead.dupeKey }]
    }, lead);
  }));

  queue.then(function (leads) {
    res.json({ ok: true });
  }).catch(function (e) {
    next(e);
  });
};

var $put = exports.$put = function $put(req, res, next) {
  _lodash2.default.merge(req.lead, req.body);
  req.lead.save(function (err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  });
};

var $destroyMany = exports.$destroyMany = function $destroyMany(req, res, next) {
  var leads = req.query.leads.split(',');

  _leads.Leads.removeAsync({ _id: { $in: leads } }).then(function (leads) {
    res.json(leads);
  }).catch(function (e) {
    next(e);
  });
};