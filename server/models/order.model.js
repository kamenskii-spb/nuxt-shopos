const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  comment: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Ожидание'
  },
  order: {
    type: Number,
    required: true
  },
  delivery: {
    label: {
      type: String
    },
    price: {
      type: Number
    },
  },
  payment:
    {
      label: {
        type: String
      },
      price: {
        type: Number
      },
    },
  order_product: [
    {
      name: {
        type: String
      },
      price: {
        type: Number
      },
      newPrice: {
        type: Number
      },
      model: {
        type: String
      },
      seoUrl: {
        type: String
      },
      quantity: {
        type: Number
      },
      id: {
        type: String
      },
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = model('orders', orderSchema)
