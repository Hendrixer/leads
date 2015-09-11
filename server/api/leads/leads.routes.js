import * as controller from './leads.controller';
import express from 'express';

const router = express.Router();
router.param('id', controller.$param);

router.route('/')
  .get(controller.$get)
  .post(controller.$post)
  .put(controller.$putMany)

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
