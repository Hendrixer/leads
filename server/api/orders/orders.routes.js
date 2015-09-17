import * as controller from './orders.controller';
import express from 'express';

const router = express.Router();

router.get('/broker', controller.$getForBroker);

// .post(controller.$post)
router.get('/redownload', controller.$redownload);
router.get('/create', controller.$create);
router.get('/preorder', controller.$preorder);

router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
