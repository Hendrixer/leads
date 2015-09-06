// no var needed here, colors will attached colors
// to String.prototype
import chalk from 'chalk';
import _ from  'lodash';
import config from '../config/env';

// create a noop (no operation) function for when loggin is disabled
const noop = function(){};
// check if loggin is enabled in the config
// if it is, then use console.log
// if not then noop
const consoleLog = config.logging ? console.log.bind(console) : noop;

const logger = {
  log() {
    const tag = chalk.white.bold('✨✨ ');
    // arguments is an array like object with all the passed
    // in arguments to this function
    const args = _.toArray(arguments)
      .map(function(arg) {
        if(typeof arg === 'object') {

          // turn the object to a string so we
          // can log all the properties and color it
          const string = JSON.stringify(arg, null, 2);
          return chalk.bold.cyan(string);

        } else if (_.isNumber(arg)){

          return chalk.magenta(arg)
        } else if (_.isFunction(arg)){

          let funcName;

          if (arg.name) {
            funcName = `: ${arg.name}`;
          }

          return chalk.yellow(`[Function${funcName}]`);
        } else {

          return chalk.green(arg);
        }
      });

    args.unshift(tag);
    // call either console.log or noop here
    // with the console object as the context
    // and the new colored args :)
    consoleLog.apply(console, args);
  },

  error() {
    const args = _.toArray(arguments)
      .map(function(arg) {
        arg = arg.stack || arg;
        const name = arg.name || '❌❌';
        const log = chalk.yellow(name) + '  ' + chalk.red(arg);
        return log;
      });

    consoleLog.apply(console, args);
  }
};

export {logger};
