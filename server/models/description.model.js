const {Schema, model} = require('mongoose')

const descriptionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  html: {
    type: String,
  }
})

module.exports = model('descriptions', descriptionSchema)
