const Sentry = require('../core/sentry')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const keys = require('../keys')
const User = require('../models/user.model')
const UserCandidate = require('../models/userCandidate')
const mail = require('../core/mail.js')
const Setting = require('../models/setting.model')


module.exports.login = async (req, res) => {
  try {
    const limit = 50
    const skip = 0
    const sort = {date: -1}


    if (!req.body.login) return

    await User.findOne({email: req.body.login}).populate({
      path: 'orders',
      select: '_id name status totalPrice date lastName order ',
      options: {limit, skip, sort}
    }).exec((error, candidate) => {
      if (candidate) {
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, candidate.password)

        if (isPasswordCorrect) {
          const token = jwt.sign({
            email: candidate.email,
            userId: candidate._id
          }, keys.JWT, {expiresIn: '168h'})


          res.json({token, user: candidate})
        } else {
          res.status(200).json({message: 'Неверный логин или пароль'})
        }
      } else {
        res.status(200).json({message: 'Неверный логин или пароль'})
      }
    })
  } catch (e) {
    Sentry.captureException(new Error(e))
  }
}


module.exports.users = async (req, res) => {
  try {
    const users = await User.find().select('_id')
    res.json(users.length > 0)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.updateUser = async (req, res) => {
  try {
    const $set = {
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
    }

    res.status(200)
    const user = await User.findOneAndUpdate({
      _id: req.body.id
    }, {$set}, {new: true})


    res.status(200).json(user)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(501).json(e)
  }
}


module.exports.getById = async (req, res) => {
  try {
    const limit = 50
    const skip = 0
    const sort = {date: -1}

    await User.findById(req.body.userId).populate({
      path: 'orders',
      select: '_id name status totalPrice date lastName order ',
      options: {limit, skip, sort},
    }).exec((error, user) => {
      res.status(200).json(user)
    })
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}


module.exports.registerCandidate = async function(req, res) {
  // Удвление всех кандидатов с временем больше часа
  try {
    const timePlus = +Date.now() - 3600000
    const query = {}
    query.timestamp = {
      $lte: timePlus
    }

    await UserCandidate.deleteMany(query)
  } catch (e) {
    res.status(500).json(e)
  }

  // email password
  const candidate = await User.findOne({email: req.body.email})
  if (candidate) {
    // Пользователь существует, нужно отправить ошибку
    res.status(200).json({
      message: 'Такой email уже занят. Попробуйте другой.'
    })
  } else {
    const date = +Date.now()
    // удаление если такой есть
    const checkCandidate = await UserCandidate.findOne({email: req.body.email})

    if (checkCandidate) {
      try {
        await UserCandidate.deleteMany({email: req.body.email})
      } catch (e) {
        res.status(500).json(e)
      }
    }

    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    const userCandidate = new UserCandidate({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      timestamp: date,
      key: await randomString(12)
    })

    try {
      await userCandidate.save()
      mail.confirmation(userCandidate)

      res.status(200).json({
        message: `Для завершении регистрации необходимо 
        перейти по ссылке из письма, 
        высланного системой на электронный ящик.`
      })
    } catch (e) {
      res.status(500).json(e)
    }
  }
}


module.exports.registerUser = async function(req, res) {
  const candidate = await UserCandidate.findOne({
    email: req.body.email,
    key: req.body.key
  })

  const startApp = await User.findOne()


  if (!startApp) {
    const setting = new Setting({
      shopName: 'Название магазина',
      email: req.body.email,
      largeImageSizeWidth: 500,
      largeImageSizeHeight: 500,
      popupImageSizeWidth: 800,
      popupImageSizeHeight: 800,
      listImageSizeWidth: 250,
      listImageSizeHeight: 250,
      additionalImageSizeWidth: 100,
      additionalImageSizeHeight: 100
    })
    await setting.save()
  }

  if (candidate) {
    await UserCandidate.deleteMany({email: req.body.email})

    const user = await User.findOne({email: req.body.email})
    if (user) {
      res.status(200).json({message: 'Такой пользыватель уже есть в системе'})
    }


    const newUser = new User({
      email: candidate.email,
      password: candidate.password,
      name: candidate.name,
      lastName: candidate.lastName,
      phone: candidate.phone,
      address: candidate.address,
      admin: startApp ? 0 : 1
    })
    await newUser.save()
    res.status(200).json(
        {user: newUser, message: 'Регистрация прошла успешно.'}
    )
  } else {
    res.status(200).json(
        {message: 'Данные неверны или устарели попробуйте еще раз'}
    )
  }
}


function randomString(i) {
  let rnd = '';
  while (rnd.length < i) {
    rnd += Math.random().toString(36).substring(2);
  }
  return rnd.substring(0, i);
}

