import * as controller from './orders.controller';
import express from 'express';

const router = express.Router();
router.param('id', controller.$param);
router.get('/broker', controller.$getForBroker);
router.post('/', controller.$create);

// .post(controller.$post)
// router.get('/redownload', controller.$redownload);

router.get('/pair/:order', controller.$getOrderPair);

// router.get('/create', controller.$create);
router.get('/preorder', controller.$preorder);

router.post('/batch/:broker', controller.$batchOrderPairs);
router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
