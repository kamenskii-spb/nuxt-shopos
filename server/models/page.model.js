const {Schema, model} = require('mongoose')

const pageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  html: {
    type: String,
    default: ''
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  metaKeywords: {
    type: String,
    default: ''
  }
})

module.exports = model('page', pageSchema)
