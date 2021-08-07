const {Schema, model} = require('mongoose')

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  images: [
    {
      src: {
        type: String,
        default: ''
      },
    }
  ],
  imageSrc: {
    type: String,
    default: ''
  },
  lazySrc: {
    type: String,
    default: ''
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  metaKeywords: {
    type: String,
  },
  model: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  newPrice: {
    type: Number,
  },
  wholesalePrice: {
    type: Number
  },
  minimum: {
    type: Number,
    default: 1
  },
  selectCategoty: {
    type: String,
    default: ''
  },
  sort_order: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1
  },
  recommend: {
    type: Boolean,
    default: false
  },
  superPrice: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: ''
  },
  seoUrl: {
    type: String,
    required: true,
    unique: true
  },
  wholesale: {
    type: Boolean,
    default: true
  },
  retail: {
    type: Boolean,
    default: true
  },
  tags: [
    {
      name: {
        type: String
      }
    }
  ],
  vkMarketId: {
    type: String,
  },
  tempateDescription:
    {
      type: String,
    },
  date: {
    type: Date,
    default: Date.now
  },

})

module.exports = model('products', productSchema)
