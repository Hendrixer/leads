import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import util from 'util';
import compress from 'compression';
import raygun from '../util/raygun';
import path from 'path';
import config from './env';

const getLogConfig = (env) => {
  if (env !== 'production') return {};
  return {
    skip(req, res) {
      return res.statusCode < 400;
    }
  };
};

const  storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },

  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const setup = (app) => {
  app.use(compress());
  app.use('/bundle.js', (req, res, next) => {
    res.set('X-SourceMap', 'bundle.js.map');
    next();
  });
  app.use(express.static(__dirname + '/../../dist'));
  app.use(morgan('dev', getLogConfig(process.env.NODE_ENV)));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({storage}).array('leads'));
  app.use(bodyParser.json({limit: 7000000}));
  app.use(raygun.expressHandler);
};

export default setup;
