const {Schema, model} = require('mongoose')

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  imageSrc: {
    type: String,
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
  sortOrder: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  parent: {
    type: String
  },
  seoUrl: {
    type: String,
    required: true,
    unique: true
  },
  productsCount: Number,
  tags: [String],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'products'
    }
  ]
})

module.exports = model('category', categorySchema)
