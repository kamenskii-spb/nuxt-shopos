const passport = require('passport')
const {Router} = require('express')
// const upload = require('../middleware/upload')
const userController = require('../controllers/user.controller')
const router = Router()

router.get(
  '/admin',
  passport.authenticate('jwt', {session: false}),
  userController.getAll
)

router.get(
  '/admin/count',
  passport.authenticate('jwt', {session: false}),
  userController.getUserCount
)

router.post(
  '/rememberPassword',
  userController.rememberPassword
)

router.post(
  '/updatePassword',
  userController.updatePassword
)




module.exports = router