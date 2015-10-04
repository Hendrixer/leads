import * as controller from './resolves.controller';
import express from 'express';

const router = express.Router();
router.param('id', controller.$param);

router.route('/')
  .get(controller.$get)
  .post(controller.$post);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
