const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const Setting = require('../models/setting.model')
const User = require('../models/user.model')
const Sentry = require('../core/sentry')

module.exports.add = async (req, res) => {
  try {
    const {id, quantity, cartToken, typeCart, userId, userName} = req.body;

    if (!cartToken) {
      res.status(500);
      return;
    }

    let cart = await Cart.findOne({cart_token: cartToken})

    if (cart) {
      cart.type_cart = typeCart
      cart.date = new Date()

      if (userId) {
        const user = await User.findById(userId)
        if (user) {
          cart.user_id = userId
          cart.user_name = userName
          user.cart_token = cartToken
          await user.save()
        }
      }

      const idx = cart.products.findIndex((p) => p.id === id)
      if (idx < 0) {
        cart.products.push({
          quantity: +quantity,
          id: id,
        });
      } else {
        cart.products[idx].quantity += quantity
      }
      await cart.save()
    } else {
      cart = new Cart({
        cart_token: cartToken,
        products: [
          {
            quantity: +quantity,
            id,
          },
        ],
      });
      await cart.save();
    }
    const productCart = await fetchProducts(cart, typeCart)
    res.status(200).json(productCart)
  } catch (error) {
    console.log(error)
  }
};

module.exports.edit = async (req, res) => {
  try {
    const {cartToken, typeCart, quantity, id} = req.body;

    if (!cartToken || !quantity) {
      res.status(204);
      return;
    }
    const cart = await Cart.findOne({cart_token: cartToken});
    const idx = cart.products.findIndex((p) => p.id === id);

    if (idx !== -1) {
      cart.products[idx].quantity = +quantity;
    }

    await cart.save();

    const productCart = await fetchProducts(cart, typeCart);

    res.status(200).json(productCart);
  } catch (e) {
    Sentry.captureException(new Error(e));
    res.status(500).json(e);
  }
};

module.exports.get = async (req, res) => {
  try {
    const {cartToken, typeCart, authUserCartToken} = req.body;

    if (!cartToken && !authUserCartToken) {
      res.status(500);
      return;
    }

    let cart = null

    //  console.log( req.body)


    if (authUserCartToken && cartToken && (cartToken !== authUserCartToken)) {
      const catTokens = [cartToken, authUserCartToken]
      const carts = await Cart.find({cart_token: {$in: catTokens}})
      if (carts.length !== 1) {
        cart = carts.find((c) => Boolean(c.user_id) === true)
        const removeCart = carts.find((c) => Boolean(c.user_id) === false)


        const products = [...carts[0].products, ...carts[1].products]


        const uniqueProducts = products.filter((product, index) => {
          return index === products.findIndex((obj) => {
            return JSON.stringify(obj) === JSON.stringify(product);
          })
        })


        cart.products = uniqueProducts

        await cart.save()
        if (removeCart) {
          await Cart.deleteOne({_id: removeCart._id})
        }
      } else {
        cart = carts[0]
        await cart.save()
      }
    } else if (!cartToken && authUserCartToken) {
      cart = await Cart.findOne({cart_token: authUserCartToken});
    } else {
      cart = await Cart.findOne({cart_token: cartToken});
    }

    if (!cart) {
      res.status(200).json(null);
      return
    }

    if (!cart.products.length) {
      res.status(200).json([]);
      return;
    }

    const productCart = await fetchProducts(cart, typeCart);

    const resp = {
      products: productCart,
      cartToken: cart.cart_token
    }

    res.status(200).json(resp);
  } catch (e) {
    Sentry.captureException(new Error(e));
    res.status(500).json(e);
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const timePlus = +Date.now() - 2629746000
    const query = {
      date: {
        $lte: timePlus
      }
    }

    await Cart.deleteMany(query)


    const responce = []

    const carts = await Cart.find().sort({date: -1}).limit(40)
    for (let index = 0; index < carts.length; index++) {
      const cart = carts[index];
      if (cart.products.length) {
        const products = await fetchProducts(cart, cart.type_cart)

        cart.products = []
        const c = {
          cart,
          products
        }
        responce.push(c)
      }
    }

    res.status(200).json(responce);
  } catch (e) {
    Sentry.captureException(new Error(e));
    res.status(500).json(e);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const {cartToken, typeCart, id} = req.body;

    if (!cartToken || !id) {
      res.status(500);
      return;
    }

    const cart = await Cart.findOne({cart_token: cartToken});
    const idx = cart.products.findIndex((p) => p.id === id);

    if (idx !== -1) {
      cart.products.splice(idx, 1);
    }

    await cart.save();

    const productCart = await fetchProducts(cart, typeCart);
    res.status(200).json(productCart);
  } catch (e) {
    Sentry.captureException(new Error(e));
    res.status(500).json(e);
  }
};

async function fetchProducts(cart, typeCart) {
  const ids = [];
  for (let index = 0; index < cart.products.length; index++) {
    const product = cart.products[index];
    ids.push(product.id);
  }

  const products = await Product.find({_id: {$in: ids}}).select(
      'name model price wholesalePrice newPrice images minimum status'
  );

  const price = (p) => {
    if (typeCart === 'retail') {
      return p.newPrice ? p.newPrice : p.price;
    } else {
      return p.wholesalePrice;
    }
  };

  const size = await Setting.findOne().select(
      'listImageSizeWidth listImageSizeHeight'
  );

  const productCart = [];

  const deleteProductsId = []

  products.forEach( async (p) => {
    if (!p.status) {
      deleteProductsId.push(p._id)
      return
    }

    const quantity =
      cart.products.find((pc) => pc.id.toString() === p._id.toString())
          .quantity || 0;
    let cacheImage = '/noimage.jpg';
    if (p.images[0]) {
      cacheImage =
        `/cache/products/${p._id}/` +
        p.images[0].src.split('.')[0] +
        '-size-' +
        size.listImageSizeWidth +
        '_' +
        size.listImageSizeHeight +
        '.' +
        p.images[0].src.split('.')[1];
    }

    productCart.push({
      _id: p._id,
      name: p.name,
      model: p.model,
      images: p.images,
      wholesalePrice: p.wholesalePrice,
      quantity: quantity,
      price: price(p),
      imageSrc: cacheImage,
    })
  })

  if (deleteProductsId.length) {
    for (let index = 0; index < deleteProductsId.length; index++) {
      const deleteProductId = deleteProductsId[index]
      const idx = cart.products.findIndex(
          (p) => p.id === deleteProductId.toString()
      )
      if (idx !== -1) {
        cart.products.splice(idx, 1)
      }
      await cart.save()
    }
  }

  return productCart
}
