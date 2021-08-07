const Setting = require('../models/setting.model')
const fs = require('fs-extra')
const sharp = require('sharp')

const cacheImages = async (products, options = {}) => {
  const size = await Setting.findOne().select(
      'listImageSizeWidth listImageSizeHeight'
  );

  for (let index = 0; index < products.length; index++) {
    const product = products[index]
    const noimage = () => {
      product.imageSrc = '/noimage.jpg'
      product.lazySrc = '/noimage.jpg'
    }

    if (product.images[0]) {
      const cacheImage =
                product.images[0].src.split('.')[0] +
                '-size-' +
                size.listImageSizeWidth +
                '_' +
                size.listImageSizeHeight +
                '.' +
                product.images[0].src.split('.')[1];
      const lazySrc =
                product.images[0].src.split('.')[0] +
                '-lasy.' +
                product.images[0].src.split('.')[1]
      product.imageSrc = `/cache/products/${product._id}/${cacheImage}`
      product.lazySrc = `/cache/products/${product._id}/${lazySrc}`

      if (
        !fs.pathExistsSync(
            `static/cache/products/${product._id}/${cacheImage}`
        )
      ) {
        const dirCacheImage = `static/cache/products/${product._id}`
        await fs.ensureDirSync(dirCacheImage)
        try {
          await sharp(
              `static/catalog/products/${product._id}/${
                product.images[0].src
              }`
          )
              .resize(size.listImageSizeWidth, size.listImageSizeHeight, {
                fit: sharp.fit.inside,
              })
              .toFile(
                  `static/cache/products/${product._id}/${cacheImage}`
              ).catch((err) => {
                noimage()
              });

          if ( product.imageSrc !== '/noimage.jpg') {
            await sharp(
                `static/cache/products/${product._id}/${cacheImage}`
            )
                .resize(10, 10, {fit: sharp.fit.inside})
                .toFile(
                    `static/cache/products/${product._id}/${lazySrc}`
                ).catch((err) => {
                  products
                });
          }
        } catch (e) {
          noimage()
        }
      }
    } else {
      noimage()
    }
  }
}


const cacheImage = async (product) => {
  try {
    const size = await Setting.findOne()
        .select('popupImageSizeWidth popupImageSizeHeight')

    if (product.images[0] &&
        fs.pathExistsSync(
            `static/catalog/products/${product._id}/${product.images[0].src}`
        )) {
      for (let index = 0; index < product.images.length; index++) {
        const image = product.images[index];
        const cacheImage = image.src.split('.')[0] +
            '-size-' + size.popupImageSizeWidth +
            '_' + size.popupImageSizeHeight +
            '.' + product.images[index].src.split('.')[1]

        if (!fs.pathExistsSync(
            `static/cache/products/${product._id}/${cacheImage}`
        )) {
          const dirCacheImage = `static/cache/products/${product._id}`
          await fs.ensureDirSync(dirCacheImage)

          await sharp(
              `static/catalog/products/${product._id}/${image.src}`
          )
              .resize(
                  size.popupImageSizeWidth,
                  size.popupImageSizeHeight,
                  {fit: sharp.fit.inside})
              .toFile(`static/cache/products/${product._id}/${cacheImage}`)
        }
      }
    }
  } catch (e) {
    // statements
    console.log(e);
  }
}
const categoryCheckImage = (category) => {
  // category.imageSrc = '/noimage.jpg'
  // console.log(category)
}

const clearImages = () => {
  fs.emptyDir('static/cache/products', (err) => {
    if (err) return console.error(err)
  })
}

module.exports = {cacheImages, cacheImage, categoryCheckImage, clearImages}
