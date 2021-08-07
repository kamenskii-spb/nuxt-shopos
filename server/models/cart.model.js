const {Schema, model} = require('mongoose')

const cartSchema = new Schema({
  cart_token: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    default: ''
  },
  user_name: {
    type: String,
    default: ''
  },
  type_cart: {
    type: String,
    default: 'retail'
  },
  date: {
    type: Date,
    default: Date.now
  },
  products: [
    {
      quantity: {
        type: Number
      },
      id: {
        type: String
      },
    }
  ]
})

module.exports = model('cart', cartSchema)
