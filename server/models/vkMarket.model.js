const {model, Schema} = require('mongoose')

const vkMarketSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  client_id:{
    type: String,
    required: true,
  },
  client_secret: {
    type: String,
    required: true,
  },
  redirect_uri:{
    type: String,
    required: true,
  },
  group_id:{
	type: String,
	required: true,
	},

})

module.exports = model('vkMarket', vkMarketSchema)
