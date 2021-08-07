const {Schema, model} = require('mongoose')

const settingSchema = new Schema({
  shopName: {
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
  }, 
  email: {
    type: String,
    required: true
  },
  largeImageSizeWidth: {
    type: Number,
    required: true
  },
  largeImageSizeHeight: {
    type: Number,
    required: true
  },
  popupImageSizeWidth: {
    type: Number,
    required: true
  },
  popupImageSizeHeight: {
    type: Number,
    required: true
  },
  listImageSizeWidth: {
    type: Number,
    required: true
  },
  listImageSizeHeight: {
    type: Number,
    required: true
  },
  additionalImageSizeWidth: {
    type: Number,
    required: true
  },
  additionalImageSizeHeight: {
    type: Number,
    required: true
  },
  
  


})

module.exports = model('setting', settingSchema)
