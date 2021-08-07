const passport = require('passport')
const {Router} = require('express')
const moduleController = require('../controllers/module.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.post('/admin/loader',
    passport.authenticate('jwt', {session: false}),
    moduleController.loader
)


router.delete('/admin/clear-cache',
    passport.authenticate('jwt', {session: false}),
    moduleController.cacheClear
)


module.exports = router
