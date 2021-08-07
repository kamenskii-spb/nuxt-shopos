const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rememberPasswordCandidate = new Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('rememberPasswordCandidate', rememberPasswordCandidate)