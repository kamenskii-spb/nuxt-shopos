const Sentry = require('../core/sentry')
const User = require('../models/user.model')
const RememberPasswordCandidate = require('../models/rememberPasswordCandidate.model')
const bcrypt = require('bcrypt-nodejs')
const errorHandler = require('../../common/utils/errorHandler')
const mail = require('../core/mail.js')

module.exports.getAll = async (req, res) => {
  try {
    const limit = +req.query.limit || 12
    const skip = +req.query.start || 0
    const sort = {date: -1}
    await User.find().sort(sort).skip(skip).limit(limit).exec((error, users) => {
      res.json(users)
    })
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.getUserCount = async (req, res) => {
  try {
    count = await User.countDocuments({});
    res.json(count)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.rememberPassword = async (req, res) => {
  try {
    const timePlus = +Date.now() - 3600000
    const query = {}
    query.timestamp = {
      $lte: timePlus
    }
    await RememberPasswordCandidate.deleteMany(query)

    const user = await User.findOne({email: req.body.email}).select('id email')
    if (user) {
      await RememberPasswordCandidate.deleteMany({email: req.body.email})
      const date = +Date.now()
      const rememberPasswordCandidate = new RememberPasswordCandidate({
        email: user.email,
        id: user._id,
        timestamp: date,
        key: await randomString(12)
      })
      await rememberPasswordCandidate.save()

      mail.sendNewPassword(rememberPasswordCandidate)
      res.status(200).json(user)
    }

    res.status(200).json(false)

  } catch (e) {
    Sentry.captureException(new Error(e))
  }
}


module.exports.updatePassword = async (req, res) => {
  try {
    const rememberPasswordCandidate = await RememberPasswordCandidate.findOne({
      email: req.body.email,
      id: req.body.id,
      key: req.body.key,
    })

    if (rememberPasswordCandidate) {
      await RememberPasswordCandidate.deleteMany({id: req.body.id})

      const salt = bcrypt.genSaltSync(10)
      const newPassword = await randomString(6)

      const $set = {
        password: bcrypt.hashSync(newPassword, salt),
      }

      await User.findOneAndUpdate({
        _id: req.body.id,
        email: req.body.email,
      }, {$set}, {new: true})


      res.status(200).json({message: `Ваш новый пароль ${newPassword}`})
    } else {
      res.status(200).json({message: 'Данные неверны или устарели попробуйте еще раз'})
    }

    res.status(200).json({})
  } catch (e) {
    Sentry.captureException(new Error(e))
  }
}


function randomString(i) {
  let rnd = '';
  while (rnd.length < i) {
    rnd += Math.random().toString(36).substring(2);
  }
  return rnd.substring(0, i);
}
