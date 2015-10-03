import throng from 'throng';
import Background from './background';
import {Reciever} from '../util/message';
import {logger} from '../util/logger';
import http from 'http';

const reciever = new Reciever();
const background = new Background();
http.globalAgent.maxSockets = Infinity;
const start = () => {
  logger.log('worker starting');
  reciever.on('newjob', message => {
    logger.log('Got the new job', message.name);
    background.addJob(message.name, message.config);
  });
};

start();

// throng(start, {
//   workers: 1
// });
