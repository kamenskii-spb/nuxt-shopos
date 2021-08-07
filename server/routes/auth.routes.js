const {Router} = require('express')
// const passport = require('passport')
const authController = require('../controllers/auth.controller')
// eslint-disable-next-line new-cap
const router = Router()
const auth = require('../middleware/auth')

// /api/auth/admin/login
router.post('/admin/login', authController.login)

router.get('/admin/users', authController.users)


router.post(
    '/admin/getById',
    authController.getById
)

router.post(
    '/admin/updateUser',
    auth,
    authController.updateUser
)


router.post('/registerCandidate', authController.registerCandidate)
router.post('/registerUser', authController.registerUser)


module.exports = router
