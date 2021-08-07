const passport = require('passport')
const {Router} = require('express')
const upload = require('../middleware/upload')
const categoryController = require('../controllers/category.controller')
// eslint-disable-next-line new-cap
const router = Router()


router.post(
    '/admin/',
    passport.authenticate('jwt', {session: false}),
    upload.single('image'),
    categoryController.create
)


router.post(
    '/admin/remove/',
    passport.authenticate('jwt', {session: false}),
    categoryController.remove
)

// router.post(
//     '/admin/clearCache/',
//     passport.authenticate('jwt', {session: false}),
//     categoryController.clearCache
// )


router.put(
    '/admin/:id',
    upload.single('image'),
    passport.authenticate('jwt', {session: false}),
    categoryController.update
)

router.get(
    '/admin/',
    categoryController.getAll
)

router.get(
    '/admin/getCategories/',
    categoryController.getCategories
)


router.get(
    '/admin/:id',
    categoryController.getBySeoUrl
)

router.get(
    '/admin/getById/:id',
    categoryController.getByid
)


// router.get(
//     '/admin/fetchBreadcrumbsById/:id',
//     categoryController.fetchBreadcrumbsById
// )


// router.get(
//   '/:id',
//   categoryController.getById
// )

module.exports = router
