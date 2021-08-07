const Sentry = require('../core/sentry')
const Description = require('../models/description.model')

module.exports.create = async (req, res) => {
  try {
    const description = new Description({
      title: req.body.title,
      html: req.body.html
    })

    const newDesc = await description.save()
    res.status(200).json(newDesc)
  } catch (e) {
    console.log(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    const $set = {
      title: req.body.title,
      html: req.body.html
    }

    const newDesc = await Description.findOneAndUpdate({
      _id: req.params.id
    }, {$set}, {new: true})

    res.status(200).json(newDesc)
  } catch (e) {
    Sentry.captureException(new Error(e))
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const descriptions = await Description.find() || []
    descriptions.push({title: 'Без шаблона', _id: ''})

    res.status(200).json(descriptions)
  } catch (e) {
    Sentry.captureException(new Error(e))
  }
},

module.exports.remove = async (req, res) => {
  try {
    await Description.deleteOne({_id: req.params.id})
    res.json({message: 'Описание удаленно'})
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.getById = async (req, res) => {
  try {
    const description = await Description.findById(req.params.id)
    res.status(200).json(description)
  } catch (e) {
    Sentry.captureException(new Error(e))
  }
}
