import * as controller from './admins.controller';
import express from 'express';
import {createAdmin, signInAdmin, isAuth} from '../../util/auth';

const router = express.Router();

router.route('/')
  .get(isAuth(), controller.$get)
  .post(createAdmin(), controller.$post);

router.post('/signin', signInAdmin(), controller.$signin);

router.use(isAuth());
router.route('/me')
  .put(controller.$put)
  .get(controller.$getOne);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
