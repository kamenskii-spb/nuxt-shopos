const passport = require('passport');
const {Router} = require('express');
const upload = require('../middleware/upload');
const fromBestgift = require('../middleware/from-bestgift');
const productController = require('../controllers/product.controller');
// eslint-disable-next-line new-cap
const router = Router();

router.post(
    '/admin/',
    passport.authenticate('jwt', {session: false}),
    upload.array('images', 12),
    productController.create
);

router.post(
    '/admin/removeImagesSrc/:id',
    passport.authenticate('jwt', {session: false}),
    productController.removeImagesSrc
);

router.post(
    '/admin/removeImagebByImageId/:id',
    passport.authenticate('jwt', {session: false}),
    productController.removeImagebByImageId
);

router.put(
    '/admin/addImageFile/:id',
    upload.single('image'),
    passport.authenticate('jwt', {session: false}),
    productController.addImageFile
);

router.put(
    '/admin/addImageSrc/:id',
    passport.authenticate('jwt', {session: false}),
    productController.addImageSrc
);

router.put(
    '/admin/changePrice',
    passport.authenticate('jwt', {session: false}),
    productController.changePrice
);

router.put(
    '/admin/changeStatus',
    passport.authenticate('jwt', {session: false}),
    productController.changeStatus
);



router.put(
    '/bestgift-sbp-ru-change-product',
    fromBestgift,
    productController.bestgiftSpbRuChangeProduct
);






router.get('/admin/', productController.getAll);

router.get('/fetchRecommend', productController.fetchRecommend);

router.get('/search', productController.search);
router.get('/fetchSuperPrice', productController.fetchSuperPrice);

router.get('/fetchNews', productController.fetchNews);

router.get('/fetchStock', productController.fetchStock);

router.get('/admin/:id', productController.getById);

router.put(
    '/admin/:id',
    upload.array('images', 12),
    passport.authenticate('jwt', {session: false}),
    productController.update
);

router.post(
    '/admin/remove/',
    passport.authenticate('jwt', {session: false}),
    productController.remove
);

module.exports = router;
