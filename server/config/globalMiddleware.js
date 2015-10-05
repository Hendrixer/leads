import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import util from 'util';
import compress from 'compression';
import raygun from '../util/raygun';
import path from 'path';
import config from '../env';
logger.log(process.cwd());

const setup = (app) => {
  app.use(compress());
  app.use(express.static(__dirname + '/../../dist'));
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({dest: config.uploadDest}).array('leads'));
  app.use(bodyParser.json({limit: 7000000}));
  app.use(raygun.expressHandler);
};

export default setup;
