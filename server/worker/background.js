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
    if (config.env === 'production') {
      this.queue({
        redis: config.secrets.redisToGo
      });
    } else {
      this.queue = kue.createQueue();
    }

    mongoose.connect(config.db.url);

    this.working = false;
    this.queue.on('job enqueue', (id, type) => {
      logger.log(`Job ${id} queued of type ${type}`);
      this.startJob();
    });

  }

  onComplete(result) {
    logger.log('Job complteted');
    this.working = false;
    this.startJob();
  }

  onFailed() {
    logger.log('Job failed', arguments);
    this.working = false;
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
    if (this.working) {
      logger.log('I am busy bitch');
      return;
    }

    this.queue.process(jobName, (job, done) => {
      this.working = true;
      logger.log('about to process');
      logger.log(job);
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
