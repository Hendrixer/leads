import EventEmitter from 'eventemitter3';
import kue from 'kue';
import {logger} from '../util/logger';
import Future from 'bluebird';
import {handleJob} from './parseCsv';
import mongoose from 'mongoose';
import config from '../config/env';
import url from 'url';

Future.promisifyAll(mongoose.Model);
Future.promisifyAll(mongoose.Model.prototype);
Future.promisifyAll(mongoose.Query.prototype);

class Background {
  constructor() {
    this.queue = kue.createQueue();
    this.doingWork = false;
    this.queue.on('job enqueue', (id, type) => {
      logger.log(`Job ${id} queued of type ${type}`);
      this.doingWork = true;
    })
    .on('job complete', () => {
      this.doingWork = false;
    });

    this.init();
  }

  busy() {
    return this.doingWork;
  }

  init() {
    mongoose.connect(config.db.url);
    if (config.secrets.redisToGo) {
      const rtg = url.parse(config.secrets.redisToGo);
      const redis = require('redis').createClient(rtg.port, rtg.hostname);
      redis.auth(rtg.auth.split(':')[1]);
    }

    const redis = require('redis').createClient();

    this.startTheJobs();
  }

  startTheJobs() {
    setInterval(()=> {
      if (!this.busy()) {
        this.startJob('csv');
      }
    }, config.jobInterval);
  }

  onComplete(result) {
    logger.log('Job complteted');
    this.doingWork = false;
  }

  onFailed() {
    logger.log('Job failed', arguments);
    this.doingWork = false;
  }

  onFailedAttempt() {
    logger.log('Job failed to start');
  }

  addJob(name, config) {
    return new Future((yes, no) => {
      const job = this.queue.create(name, config);
      job
      .attempts(1)
      .save(err => {
        if (err) {
          logger.error(err);
          no(err);
        } else {
          yes(job);
        }
      });
      job.on('complete', this.onComplete.bind(this));
      job.on('failed', this.onFailed.bind(this));
      job.on('failed attempt', this.onFailedAttempt.bind(this));
    });
  }

  startJob(jobName='csv') {
    this.queue.process(jobName, (job, done) => {
      logger.log('about to process');
      handleJob(job)
      .then(() => {
        done();
      })
      .catch(e => {
        done(e);
      });
    });
  }
}

export default Background;
