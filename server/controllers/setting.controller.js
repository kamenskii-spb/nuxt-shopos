const Sentry = require('../core/sentry')
const Setting = require('../models/setting.model')
const image = require('../core/image')

module.exports.update = async (req, res) => {
  const $set = {
    email: req.body.email,
    shopName: req.body.shopName,
    metaTitle: req.body.metaTitle,
    metaDescription: req.body.metaDescription,
    metaKeywords: req.body.metaKeywords,
    largeImageSizeWidth: req.body.largeImageSizeWidth,
    largeImageSizeHeight: req.body.largeImageSizeHeight,
    popupImageSizeHeight: req.body.popupImageSizeHeight,
    popupImageSizeWidth: req.body.popupImageSizeWidth,
    listImageSizeHeight: req.body.listImageSizeHeight,
    listImageSizeWidth: req.body.listImageSizeWidth,
    additionalImageSizeHeight: req.body.additionalImageSizeHeight,
    additionalImageSizeWidth: req.body.additionalImageSizeWidth
  }

  try {
    const setting = await Setting.findOneAndUpdate({}, {$set}, {new: true})
    res.json(setting)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.getAllAdmin = async (req, res) => {
  try {
    const setting = await Setting.findOne()
    res.json(setting)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.getAll = async (req, res) => {
  try {
    const setting = await Setting.findOne()
    if (setting) {
      setting.email = ''
      res.status(200).json(setting)
    } else {
      res.status(200).json([])
    }
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.imageClear = async (req, res) => {
  try {
    setTimeout(function() {
      image.clearImages()
      res.status(200).json({message: 'ok'})
    }, 2000)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}
