import {Leads} from './leads.model';
import _ from 'lodash';
import spreadToJSon from 'xlsx-to-json';
import path from 'path';
import future from 'bluebird';

future.promisifyAll(Leads);
future.promisifyAll(Leads.prototype);
const toJson = future.promisify(spreadToJSon);

export const $get = (req, res, next)=> {
  Leads.findAsync()
    .then(leadss => {
      req.json(leadss);
    })
    .catch(next.bind.next);
};

export const $getOne = (req, res, next)=> {

};

export const $post = (req, res, next)=> {
  const pathToFile = path.join(__dirname, '/../../../', req.files[0].path);

  toJson({
    input:  req.files[0].path,
    output: null
  })
    .then(res.json.bind(res))
    .catch(next.bind(next));
};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



