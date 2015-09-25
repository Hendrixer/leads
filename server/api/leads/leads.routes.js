import * as controller from './leads.controller';
import express from 'express';

const router = express.Router();
router.param('id', controller.$param);
router.get('/search', controller.$search);

router.route('/')
  .get(controller.$get)
  .post(controller.$post)
  .put(controller.$putMany)
  .delete(controller.$destroyMany);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put);

export default router;
