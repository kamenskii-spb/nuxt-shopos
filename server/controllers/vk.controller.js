const fetch = require('node-fetch')
const VkMarket = require('../models/vkMarket.model')


module.exports.getVkMarketSetting = async (req, res) => {
  try {
    const response = await VkMarket.findOne()
		 if (response) {
      res.status(201).json(response)
     	} else {
     	   res.status(201).json({})
     	}
     	res.status(500)
  } catch (e) {
    // statements
    console.log(e);
    res.status(500)
  }
}

module.exports.deleteVkMarketSetting = async (req, res) => {
  try {
    const response = await VkMarket.deleteOne()
    if (response) {
      res.status(201).json(response)
    }
    res.status(500)
  } catch (e) {
    // statements
    console.log(e);
    res.status(500)
  }
}


module.exports.setToken = async (req, res) => {
  try {
	 const token = await fetch(`https://oauth.vk.com/access_token?client_id=${req.body.client_id}&client_secret=${req.body.client_secret}&redirect_uri=${req.body.redirect_uri}/admin/vkmarket&code=${req.body.code}`)
        .then((response) => response.json())


    if (token.access_token) {
      const vkMarketToken = new VkMarket({
        token: token.access_token,
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        redirect_uri: req.body.redirect_uri,
        group_id: req.body.group_id
      })

      const result = await vkMarketToken.save()
      if (result) {
        res.status(201).json(result)
        return
      }
    }
    res.status(500).json('token false')
  } catch (e) {
    // statements
    console.log(e);
  }
}
