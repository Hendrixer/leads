import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import config from '../config/env';
import {Admins} from '../api/admins/admins.model';
import bcrypt from 'bcryptjs';

export const validateJwt = expressJwt({
  secret: config.secrets.jwt
});

export const isAuth = ()=> {
  return compose()
    .use((req, res, next)=> {
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      validateJwt(req, res, next);
    })
    .use((req, res, next)=> {
      Admins.findByIdAsync(req.user._id)
        .then(admin => {
          if (!admin) {
            return res.status(401).end();
          }

          req.admin = admin;
          next();
        })
        .catch(e => {
          next(e);
        });
    });
};

export const signToken = (id, role)=> {
  return jwt.sign({ _id: id}, config.secrets.jwt, {
    expiresInMinutes: 24 * 60 * 15
  });
};

export const createAdmin = ()=> {
  return compose()
    .use((req, res, next)=> {
      if (req.body.secret !== config.secrets.adminSecret) {
        console.log(req.body, config.secrets.adminSecret);
        return res.status(401).end();
      }

      Admins.findOneAsync({email: req.body.email})
        .then(admin => {
          if (admin) {
            return res.status(401).end();
          }

          next();
        });
    })
    .use((req, res, next)=> {
      const password = bcrypt.hashSync(req.body.password, 8);

      Admins.createAsync({
        password,
        email: req.body.email,
      })
      .then(admin => {
        req.admin = admin;
        next();
      })
      .catch(e => {
        next(e);
      });
    });
};

export const signInAdmin = ()=> {
  return compose()
    .use((req, res, next) => {
      Admins.findOneAsync({email: req.body.email})
        .then(admin => {
          if (!admin) {
            return res.status(401).end();
          }

          const isPass = bcrypt.compareSync(req.body.password, admin.password);

          if (!isPass) {
            return res.status(401).end();
          }

          req.admin = admin;
          next();
        })
        .catch(e => {
          next(e);
        });
    });
};
