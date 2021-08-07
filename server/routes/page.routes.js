const passport = require('passport')
const {Router} = require('express')
const ptr = require('../controllers/page.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.get(
    '/admin/',
    ptr.getAll
)

router.get(
    '/admin/:url',
    ptr.getByUrl
)
router.put(
    '/admin/update/',
    passport.authenticate('jwt', {session: false}),
    ptr.update
)

router.post(
    '/admin/create',
    passport.authenticate('jwt', {session: false}),
    ptr.create
)

router.delete(
    '/admin/:id',
    passport.authenticate('jwt', {session: false}),
    ptr.remove
)


module.exports = router
