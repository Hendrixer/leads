import winston from 'winston';
import config from '../config/env';

const makeLogger = ()=> {
  const customLevels = {
    levels: {
      print: 0,
      err: 1
    },

    colors: {
      print: 'magenta',
      err: 'red'
    }
  };

  const logger =  new(winston.Logger)({
    transports: [new (winston.transports.Console)()],
    levels: customLevels.levels
  });

  winston.addColors(customLevels.colors);

  return logger;
};



const initLogger = ()=> {
  return config.logging ? makeLogger() : {
    print(){},
    err(){}
  };
};

const logger = initLogger();


export default logger;

