const express = require('express')
const keys = require('./keys')
const mongoose = require('mongoose')
const passport = require('passport')
// const passportStrategy = require('./middleware/passport-strategy')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const settingRoutes = require('./routes/setting.routes')
const productRoutes = require('./routes/product.routes')
const cartRoutes = require('./routes/cart.routes')
const vkRoutes = require('./routes/vk.routes')
const orderRoutes = require('./routes/order.routes')
const userRoutes = require('./routes/user.routes')
const pageRoutes = require('./routes/page.routes')
const moduleRoutes = require('./routes/module.router')
const descriptionRoutes = require('./routes/description.router')
const cors = require('cors')
const app = express()
app.use(cors())


mongoose.connect(keys.MONGO_URI, {
  useUnifiedTopology: false,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch((error) => console.error(error))



// app.use(passport.initialize())
// // passport.use(passportStrategy)
// require('./middleware/passport-strategy')(passport)

// if (process.env.NODE_ENV === 'production') {
//   app.get('*', function(req, res, next) {
//     if (req.secure) {
//       // request was via https, so do no special handling
//       next();
//     } else {
//       // request was via http, so redirect to https
//       res.redirect('https://' + req.headers.host + req.url);
//     }
//   });
// }

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/setting', settingRoutes)
app.use('/api/vk', vkRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/page', pageRoutes)
app.use('/api/description', descriptionRoutes)
app.use('/api/module', moduleRoutes)


module.exports = app
