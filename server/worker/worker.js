import Background from './background';
import {Reciever} from '../util/message';
import {logger} from '../util/logger';
import http from 'http';

const reciever = new Reciever();
const background = new Background();
http.globalAgent.maxSockets = Infinity;
const start = () => {
  logger.log('...worker starting');
  reciever.on('newjob', message => {
    background.addJob(message.name, message);
  });
};

start();
