const passport = require('passport')
const {Router} = require('express')
const description = require('../controllers/description.controller')
const router = Router()


router.post(
  '/admin/create',
  passport.authenticate('jwt', {session: false}),
  description.create
)

router.put(
  '/admin/update/:id',
  passport.authenticate('jwt', {session: false}),
  description.update
)

router.delete(
  '/admin/remove/:id',
  passport.authenticate('jwt', {session: false}),
  description.remove
)


router.get('/',
description.getAll
)

router.get('/:id', description.getById)



module.exports = router
