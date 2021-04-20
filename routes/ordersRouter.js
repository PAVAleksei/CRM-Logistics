/* eslint-disable max-len */
const orderRouter = require('express').Router();
const { checkAuth } = require('../middlewares/checkAuth');
const { checkAdmin } = require('../middlewares/checkAdmin');
const {
  renderAllOrders, renderOrder, addComment, addNewOrder, renderNewOrderForm, renderOrderEdit, postEditOrder,
  deliteOrder,
  findAll,
  changeStatus,
} = require('../controllers/orderController');

orderRouter.route('/')
  .get(renderAllOrders);

orderRouter.route('/all')
  .post(findAll);

orderRouter.route('/new')
  .get(renderNewOrderForm)
  .post(addNewOrder);

orderRouter.route('/edit/:id')
  .get(renderOrderEdit);

orderRouter.route('/edit/:id')
  .post(postEditOrder);

orderRouter.route('/delete/:id')
  .get(deliteOrder);

orderRouter.route('/:id/comments')
  .post(addComment);

orderRouter.route('/:id/status')
  .patch(changeStatus);

orderRouter.route('/:id')
  .get(renderOrder);

module.exports = orderRouter;
