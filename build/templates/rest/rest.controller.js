import {<%= upcaseName %>} from './<%= name %>.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(<%= upcaseName %>);
future.promisifyAll(<%= upcaseName %>.prototype);

export const $get = (req, res, next)=> {
  <%= upcaseName %>.findAsync()
    .then(<%= name %>s => {
      req.json(<%= name %>s);
    })
    .catch(next.bind.next);
};

export const $getOne = (req, res, next)=> {

};

export const $post = (req, res, next)=> {

};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



