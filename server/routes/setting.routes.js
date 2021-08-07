const passport = require('passport')
const {Router} = require('express')
const upload = require('../middleware/upload')
const settingController = require('../controllers/setting.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.put(
    '/admin',
    passport.authenticate('jwt', {session: false}),
    upload.single('image'),
    settingController.update
)

router.get(
    '/admin',
    settingController.getAll
)

router.post(
    '/admin/imageClear',
    passport.authenticate('jwt', {session: false}),
    settingController.imageClear
)

module.exports = router
