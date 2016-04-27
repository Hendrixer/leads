'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrubPhones = exports.saveDupe = exports.saveResolveSession = exports.handleJob = exports.parseCsvStream = exports.getFileStreamFromS3 = undefined;

var _leads = require('../api/leads/leads.model');

var _logger = require('../util/logger');

var _resolves = require('../api/resolves/resolves.model');

var _csvParser = require('csv-parser');

var _csvParser2 = _interopRequireDefault(_csvParser);

var _combinedStream = require('combined-stream');

var _combinedStream2 = _interopRequireDefault(_combinedStream);

var _email = require('../util/email');

var _email2 = _interopRequireDefault(_email);

var _env = require('../config/env');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _message = require('../util/message');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _s3Streams = require('s3-streams');

var _s3Streams2 = _interopRequireDefault(_s3Streams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
  accessKeyId: _env.config.secrets.awsAccessKeyId,
  secretAccessKey: _env.config.secrets.awsSecretAccessKey
});

var s3 = new _awsSdk2.default.S3();
var messenger = new _message.Reciever();

var getFileStreamFromS3 = exports.getFileStreamFromS3 = function getFileStreamFromS3(filename) {
  // return s3Stream.ReadStream(s3, {
  //   Bucket: config.secrets.awsS3Bucket,
  //   Key: filename
  // });
  return s3.getObject({
    Bucket: _env.config.secrets.awsS3Bucket,
    Key: filename
  }).createReadStream();
};

var parseCsvStream = exports.parseCsvStream = function parseCsvStream(filename) {
  return new Promise(function (resolve, reject) {
    var csvStream = getFileStreamFromS3(filename);
    var startTime = Date.now();
    var meta = {
      dupes: 0,
      saved: 0,
      tried: 0,
      startTime: startTime
    };

    var uuid = _nodeUuid2.default.v1();
    var throttleSend = _lodash2.default.throttle(function (message) {
      messenger.sendMessage(_env.config.secrets.pubnubPrefix + 'leads-uploaded', message);
    }, 800, { trailing: false });

    csvStream.pipe((0, _csvParser2.default)()).pipe(_eventStream2.default.mapSync(function (data) {
      return _leads.Leads.format(data);
    })).pipe(_eventStream2.default.map(function (data, done) {
      meta.tried++;
      _leads.Leads.createAsync(data).then(function (lead) {
        meta.saved++;
        throttleSend({ saved: meta.saved });
        done(null, lead);
      }).catch(function (err) {
        if (dupeErr(err)) {
          meta.dupes++;
          saveDupe(data, uuid).then(function () {
            done();
          });
        } else {
          done(err);
        }
      });
    })).on('end', function () {
      meta.duration = (Date.now() - meta.startTime) / 1000 + ' seconds';
      meta.uuid = uuid;
      var update = { saved: meta.saved, final: true };
      messenger.sendMessage(_env.config.secrets.pubnubPrefix + 'leads-uploaded', update);
      resolve(meta);
    });
  });
};

var dupeErr = function dupeErr(err) {
  return !!(err.code && (err.code === 11000 || err.code === '11000') || err.errmsg && /E11000/gi.test(err.errmsg));
};

var handleJob = exports.handleJob = function handleJob(job) {
  return parseCsvStream(job.data.filename).then(function (meta) {
    if (!meta.dupes) {
      return meta;
    }

    return _resolves.ResolvesSession.createAsync({}).then(function (Session) {
      return _resolves.Resolves.findAsync({ uuid: meta.uuid }).then(function (resolves) {
        return saveResolveSession(Session, resolves);
      });
    }).then(function (session) {
      meta.dupeLink = _env.config.appUrl + '/#/resolves/' + session._id;
      return meta;
    });
  }).then(function (meta) {
    return (0, _email2.default)('upload', meta, job.data.email);
  });
};

var saveResolveSession = exports.saveResolveSession = function saveResolveSession(Session, resolves) {
  return new Promise(function (resolve, reject) {
    Session.resolves = _lodash2.default.pluck(resolves, '_id');
    Session.save(function (err, saved) {
      err ? reject(err) : resolve(saved);
    });
  });
};

var saveDupe = exports.saveDupe = function saveDupe(dupe, uuid) {
  if (dupe.email) {
    dupe.email = dupe.email.toLowerCase();
  }

  if (dupe.lastName) {
    dupe.lastName = dupe.lastName.toLowerCase();
  }

  dupe.firstName = dupe.firstName.toLowerCase();
  var dupeKey = '' + dupe.firstName + dupe.lastName + dupe.email;

  return _leads.Leads.findOneAsync({
    $or: [{ email: dupe.email }, { dupeKey: dupeKey }]
  }).then(function (lead) {
    return _resolves.Resolves.createAsync({
      dupe: dupe,
      uuid: uuid,
      lead: lead
    });
  });
};

var scrubPhones = exports.scrubPhones = function scrubPhones(job) {
  console.log('scrub');
  return new Promise(function (res, rej) {
    var csvStream = getFileStreamFromS3(job.data.filename);
    var startTime = Date.now();
    var meta = {
      dupes: 0,
      tried: 0,
      startTime: startTime
    };
    csvStream.pipe((0, _csvParser2.default)()).pipe(_eventStream2.default.map(function (data, done) {
      meta.tried++;
      return _leads.Leads.isThere(_lodash2.default.values(data)[0]).then(function (dupe) {
        dupe && meta.dupes++;
        done();
      }).catch(function (e) {
        done();
      });
    })).on('end', function () {
      meta.duration = (Date.now() - meta.startTime) / 1000 + ' seconds';
      console.log(meta);
      res(meta);
    }).on('error', function () {
      rej(e);
    });
  }).then(function (meta) {
    (0, _email2.default)('phone', meta, job.data.email);
  });
};