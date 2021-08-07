const Sentry = require('../core/sentry')
const Order = require('../models/order.model')
const Cart = require('../models/cart.model');
const User = require('../models/user.model')
const mail = require('../core/mail.js')

module.exports.create = async (req, res) => {
  try {
    if (req.body.order_product.length) {
      req.body.order_product.map((p) => {
        p.id = p._id
        delete p._id
        return p
      })
    } else {
      res.status(500)
    }


    const lastOrder = await Order
        .findOne()
        .sort({date: -1})

    const maxOrder = lastOrder ? lastOrder.order : 0


    const order = new Order({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      delivery: req.body.delivery,
      payment: req.body.payment,
      comment: req.body.comment,
      totalPrice: req.body.totalPrice,
      order_product: req.body.order_product,
      order: maxOrder + 1,
      date: req.body.date,
    })


    await order.save()


    mail.sendOrder(req.body.email, order)

    if (req.body.cartToken) {
      await Cart.deleteOne({cart_token: req.body.cartToken});
    }


    if (req.body.userId) {
      const user = await User.findById(req.body.userId)
      user.orders.push(order._id)
      user.save()
    }


    res.status(200).json(order)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.fetch = async function(req, res) {
  try {
    const order = await Order.findById(req.params.id)
    res.status(200).json(order)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.fetchAll = async function(req, res) {
  try {
    const skip = +req.query.start || 0
    const limit = +req.query.limit || 24
    const orders = await Order.find().limit(limit).skip(skip).sort({date: -1})
    res.status(200).json(orders)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.fetchCount = async function(req, res) {
  try {
    const count = await Order.countDocuments({});
    res.status(200).json(count)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.changeStatus = async function(req, res) {
  try {
    const $set = {
      status: req.body.status
    }
    await Order.findOneAndUpdate({_id: req.body.id}, {$set}, {new: true})
    res.status(200).json()
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


