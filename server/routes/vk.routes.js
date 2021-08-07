const passport = require('passport')
const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const vkController = require('../controllers/vk.controller')


router.post('/admin/setToken',
passport.authenticate('jwt', {session: false}),
 vkController.setToken)

router.post('/admin/getVkMarketSetting',
passport.authenticate('jwt', {session: false}),
 vkController.getVkMarketSetting)

router.post('/admin/deleteVkMarketSetting',
passport.authenticate('jwt', {session: false}),
 vkController.deleteVkMarketSetting)


module.exports = router
