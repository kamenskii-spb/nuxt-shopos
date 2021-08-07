const passport = require('passport')
const {Router} = require('express')
const orderController = require('../controllers/order.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.post('/admin/create', orderController.create)

router.get('/admin/fetchById/:id',
    orderController.fetch
)

router.get('/admin',
    passport.authenticate('jwt', {session: false}),
    orderController.fetchAll
)

router.post('/admin/count',
    orderController.fetchCount
)

router.post('/admin/changeStatus',
    passport.authenticate('jwt', {session: false}),
    orderController.changeStatus
)


module.exports = router
