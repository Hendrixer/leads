import * as controller from './admins.controller';
import express from 'express';
import {createAdmin, signInAdmin} from '../../util/auth';

const router = express.Router();

router.route('/')
  .get(controller.$get)
  .post(createAdmin(), controller.$post)

router.post('/signin', signInAdmin(), controller.$signin);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
