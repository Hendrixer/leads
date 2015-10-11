import * as controller from './headers.controller';
import express from 'express';

const router = express.Router();

router.route('/')
  .get(controller.$get)
  .post(controller.$post)
  .put(controller.$put);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
