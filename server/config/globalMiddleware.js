import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer';
import util from 'util';

const setup = (app) => {
  app.use(express.static(__dirname + '/../../client'));
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({dest: 'uploads/'}).array('leads'));
  app.use(bodyParser.json());
};

export default setup;
