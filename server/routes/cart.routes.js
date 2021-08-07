const passport = require('passport')
const {Router} = require('express')
const cartController = require('../controllers/cart.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.post('/', cartController.get)

router.get('/getAll',
    passport.authenticate('jwt', {session: false}),
    cartController.getAll)
router.put('/add', cartController.add)
router.put('/edit', cartController.edit)
router.put('/delete', cartController.delete)


module.exports = router
