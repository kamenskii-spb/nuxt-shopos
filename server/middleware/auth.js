const User = require('../models/user.model')
const Cookie = require('cookie')
const jwtDecode = require('jwt-decode')


module.exports = async function(req, res, next) {
  const cookieStr = req.headers.cookie
  const cookies = Cookie.parse(cookieStr || '')
  const token = cookies['jwt-token']


  if (isJWTValid(token)) {
    const userId = await getUserIdByToken(token)
    const user = await User.findById(userId).select('id')

    if (!user) {
      return res.redirect('/login')
    }
  } else {
    return res.redirect('/login')
  }
  next()
}


function getUserIdByToken(token) {
  if (!token) {
    return false
  }
  const jwtData = jwtDecode(token)

  return jwtData.userId
}


function isJWTValid(token) {
  if (!token) {
    return false
  }

  const jwtData = jwtDecode(token)
  const expires = jwtData.exp || 0

  return (new Date().getTime() / 1000) < expires
}
