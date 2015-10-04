import * as controller from './orders.controller';
import express from 'express';

const router = express.Router();
router.param('id', controller.$param);
router.get('/broker', controller.$getForBroker);
router.post('/', controller.$create);

// .post(controller.$post)
router.get('/redownload', controller.$redownload);

// router.get('/create', controller.$create);
router.get('/preorder', controller.$preorder);

router.put('/batch/:broker', controller.$updateLeads);
router.route('/:id')
  .get(controller.$getOne)
  .put(controller.$put)
  .delete(controller.$destroy);

export default router;
