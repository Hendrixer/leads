import Pubnub from 'pubnub';
import config from '../config/env';
import EventEmitter from 'eventemitter3';
import {logger} from './logger';

const messageChannel = config.messageChannel || 'demjobs';

const createPublisher = () => {
  return Pubnub({
    publish_key: config.secrets.pubnubPubKey,
    subscribe_key: config.secrets.pubnubSubKey
  });
};

class Publisher {
  constructor() {
    this.pubnub = createPublisher();
  }

  queueJob(name, config) {
    this.pubnub.publish({
      channel: messageChannel,
      message: {name, config},
      callback() {
        logger.log('job sent to worker');
      },

      error(e) {
        logger.error(e);
      }
    });
  }
}

const createReciever = ()=> {
  return Pubnub({
    publish_key: config.secrets.pubnubPubKey,
    subscribe_key: config.secrets.pubnubSubKey
  });
};

class Reciever extends EventEmitter {
  constructor() {
    super();
    this.pubnub = createReciever();
    const _this = this;
    this.pubnub.subscribe({
      channel: messageChannel,
      callback(message) {
        _this.emit('newjob', message);
      }
    });
  }

  sendMessage(channel, message) {
    this.pubnub.publish({channel, message});
  }
}

export {Reciever, Publisher};
