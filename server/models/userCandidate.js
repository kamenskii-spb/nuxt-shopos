const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersCandidateSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address:{
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
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

module.exports = mongoose.model('usersCandidate', usersCandidateSchema)