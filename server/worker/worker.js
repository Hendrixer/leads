import Background from './background';
import {Reciever} from '../util/message';
import {logger} from '../util/logger';
import express from 'express';
const background = new Background();

const app = express();

app.get('/status', (req, res) => res.send({ok: true}))

app.get('/new-lead', (req, res) => {
  background.addJob(req.query.type);
  res.send(200);
});

app.listen(8081, function() {
  console.log('worker on port 8081');
});
