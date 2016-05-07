import {Admins} from './admins.model';
import _ from 'lodash';
import future from 'bluebird';
import {signToken} from '../../util/auth';

future.promisifyAll(Admins);
future.promisifyAll(Admins.prototype);

export const $get = (req, res, next)=> {
  Admins.findAsync()
    .then(adminss => {
      req.json(adminss);
    })
    .catch(next.bind.next);
};

export const $getOne = (req, res, next)=> {
  Admins.findById(req.user._id)
  .then(admin => {
    res.json(admin);
  })
  .catch(e => {
    next(e);
  });
};

export const $post = (req, res, next)=> {
  res.json({token: signToken({_id: req.admin._id, email: req.admin.email})});
};

export const $put = (req, res, next)=> {
  const admin = req.user;
  Admins.findByIdAndUpdate(admin._id, req.body, {new: true})
  .then(admin => {
    res.json(admin);
  })
  .catch(e => {
    next(e);
  });
};

export const $destroy = (req, res, next)=> {

};

export const $signin = (req, res, next)=> {
  res.json({token: signToken(req.admin._id)});
};
