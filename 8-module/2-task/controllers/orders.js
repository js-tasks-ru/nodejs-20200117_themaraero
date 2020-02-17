const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const order = new Order({
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
    user: ctx.user.id,
  });

  await order.save();

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    locals: {id: order.id, product: ctx.request.body.product},
    template: 'order-confirmation',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const ordersList = await Order.find({user: ctx.user.id});

  ctx.body = {orders: ordersList};
};
