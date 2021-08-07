
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user.model')
const config = require('config')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('JWT')
}

module.exports = (passport) => {
  passport.use(
      new JwtStrategy(options, async (payload, done) => {
        try {
          const user = await User.findById(payload.userId).select('id admin')
          if (user.admin) {
            done(null, user)
          } else {
            done(null, false)
          }
        } catch (e) {
          console.log(e)
        }
      })
  )
}
