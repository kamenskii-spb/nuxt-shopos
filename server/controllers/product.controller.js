const Sentry = require('../core/sentry');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const image = require('../core/image');
const fs = require('fs-extra');
const translit = require('cyrillic-to-translit-js');
const cache = require('../core/cache');
const seoCount = 1;

async function createSeoUrl(name, model = seoCount) {
  let seoTrl = await translit().transform(name.toLowerCase(), '-');
  const productSeoUrl = await Product.findOne({seoUrl: seoTrl}).select(
      'seoUrl'
  );
  if (productSeoUrl) {
    seoTrl = seoTrl + model;
    seoTrl = await createSeoUrl(seoTrl);
  }
  return seoTrl;
}

module.exports.create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.metaTitle) {
      res.status(500);
      return;
    }

    const seoUrl = await createSeoUrl(
        req.body.name.replace(/[/]+/g, ''),
        req.body.model)

    const product = new Product({
      seoUrl,
      name: req.body.name,
      description: req.body.description,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords,
      sort_order: +req.body.sortOrder,
      selectCategoty: req.body.selectCategoty,
      status: req.body.status,
      model: req.body.model,
      recommend: req.body.recommend,
      superPrice: req.body.superPrice,
      stock: req.body.stock,
      price: +req.body.price || 0,
      wholesalePrice: +req.body.wholesalePrice || 0,
      newPrice: +req.body.newPrice || 0,
      minimum: req.body.minimum,
      size: req.body.size,
      tempateDescription: req.body.tempateDescription,
      tags: JSON.parse(req.body.tags),
      wholesale: req.body.wholesale,
      retail: req.body.retail,
    });

    if (req.files) {
      product.images = [];
      for (let index = 0; index < req.files.length; index++) {
        product.images.push({
          src: req.files[index].filename,
        });
      }
    }

    await product.save();

    cache.clear();

    const ids = req.body.selectCategoty.split(',') || [];
    await saveProductInCategories(ids, product._id);

    if (req.files) {
      const dirImage = `static/catalog/products/${product._id}`;
      await fs.ensureDirSync(dirImage);
      for (let index = 0; index < req.files.length; index++) {
        await fs.copy(
            req.files[index].path,
            dirImage + '/' + req.files[index].filename
        );
        fs.remove(req.files[index].path);
      }
    }

    await res.status(201).json(product);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.update = async (req, res) => {
  try {
    if (!req.body.name || !req.body.metaTitle) {
      res.status(500);
      return;
    }

    const productSeoData = await Product.findById(req.params.id).select(
        'name seoUrl'
    );
    let seoUrl = productSeoData.seoUrl;
    if (productSeoData.name !== req.body.name) {
      seoUrl = await createSeoUrl(req.body.name, req.body.model);
    }

    const $set = {
      name: req.body.name,
      description: req.body.description,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords,
      sort_order: +req.body.sortOrder,
      status: req.body.status,
      selectCategoty: req.body.selectCategoty,
      model: req.body.model,
      recommend: req.body.recommend,
      superPrice: req.body.superPrice,
      newPrice: +req.body.newPrice || 0,
      price: +req.body.price || 0,
      wholesalePrice: +req.body.wholesalePrice || 0,
      stock: req.body.stock,
      minimum: req.body.minimum,
      size: req.body.size,
      seoUrl,
      tempateDescription: req.body.tempateDescription,
      tags: JSON.parse(req.body.tags),
      wholesale: req.body.wholesale,
      retail: req.body.retail,
    };

    const product = await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );

    // /// перенести
    const categoriesForClear = req.body.categoriesForClear.split(',');
    if (categoriesForClear.length) {
      for (let index = 0; index < categoriesForClear.length; index++) {
        const id = categoriesForClear[index];
        const category = await Category.findById(id);
        category.products = await category.products.filter((p) => {
          if (p.toString() !== product._id.toString()) {
            return p
          }
        });
        await category.save()
      }
      // /////////

      cache.clear();
    }
    const ids = req.body.selectCategoty.split(',') || [];
    await saveProductInCategories(ids, product._id);

    await res.status(200).json(product);
  } catch (e) {
    // statements
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.removeImagesSrc = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const $set = {
      images: [],
    };
    await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );
    cache.clear();
    await res.status(200).json(product);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.removeImagebByImageId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const images = product.images.filter((i) => i._id !== req.body.imgId);
    const imgCache = `static/cache/products/${product._id}`;
    const Image = `static/catalog/products/${product._id}/${req.body.name}`;
    await fs.remove(imgCache);
    await fs.remove(Image);

    const $set = {images};
    await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );
    await res.status(200);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.addImageFile = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const images = product.images;
    images.push({src: req.file.filename});
    const $set = {
      images: images,
    };
    await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );

    if (req.file) {
      const dirImage = `static/catalog/products/${product._id}`;
      await fs.copy(req.file.path, dirImage + '/' + req.file.filename);
      fs.remove(req.file.path);
    }
    await res.status(200).json(product);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.addImageSrc = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const images = product.images;
    images.push({src: req.body.src});
    const $set = {
      images: images,
    };
    await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );

    await res.status(200).json(product);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const sort = {date: -1};
    const products = await Product.find()
        .sort(sort)
        .select('_id model name status price wholesalePrice seoUrl');
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.search = async (req, res) => {
  try {
    const query = await req.query.search;
    const products = await Product.find({status: 1})
        .or([{name: {$regex: new RegExp(query, 'ig')}}, {model: query}])
        .select('name images model seoUrl')
        .limit(12);
    if (products.length) {
      await image.cacheImages(products);
    }
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    let product = await Product.findOne({seoUrl: req.params.id});

    if (!product) {
      product = await Product.findOne({_id: req.params.id});
    }

    if (!product) {
      res.status(200).json({});
      return;
    }
    await image.cacheImage(product);

    await res.status(200).json(product);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json({});
  }
};

module.exports.fetchRecommend = async (req, res) => {
  try {
    const query = {
      recommend: true,
      status: 1,
    };
    const products = await fetchCollection(query);
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.fetchSuperPrice = async (req, res) => {
  try {
    const query = {
      superPrice: true,
      status: 1,
    };
    const products = await fetchCollection(query);
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.fetchStock = async (req, res) => {
  try {
    const query = {
      stock: true,
      status: 1,
    };
    const products = await fetchCollection(query);
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

async function fetchCollection(query) {
  const limit = 12;
  const sort = {date: -1};
  const products = await Product.find(query)
      .sort(sort)
      .limit(limit);
  await image.cacheImages(products);
  return products;
}

module.exports.fetchNews = async (req, res) => {
  try {
    const limit = +req.query.limit || 12;
    const skip = +req.query.start || 0;

    let sort = {date: -1};

    if (req.query.sort === 'name') {
      sort = {name: -1};
    } else if (req.query.sort === 'price') {
      sort = {price: -1};
    }

    const products = await Product.find({status: 1})
        .sort(sort)
        .skip(skip)
        .limit(limit);
    await image.cacheImages(products);
    await res.status(200).json(products);
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.changePrice = async (req, res) => {
  try {
    const $set = {};
    req.body.type === 'retail' ?
      ($set.price = req.body.price) :
      ($set.wholesalePrice = req.body.price);
    await Product.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {$set},
        {new: true}
    );
    cache.clear();
    res.status(204).json({})
  } catch (e) {
    Sentry.captureException(new Error(e));
    res.status(500);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const $set = {};
    req.body.status ? ($set.status = 1) : ($set.status = 0);
    await Product.findOneAndUpdate(
        {
          _id: req.body.id,
        },
        {$set},
        {new: true}
    );
    cache.clear();
    res.status(204).json({});
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.bestgiftSpbRuChangeProduct = async (req, res) => {
  try {
    const $set = {};
    req.body.status ? ($set.status = 1) : ($set.status = 0);
    await Product.findOneAndUpdate(
        {
          model: req.body.model,
        },
        {$set},
        {new: true}
    );
    cache.clear();
    res.status(204).json({});
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

module.exports.remove = async (req, res) => {
  const ids = req.body;
  const dirCache = 'static/cache/products/';
  const dirImages = 'static/catalog/products/';

  try {
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      fs.remove(dirCache + id);
      fs.remove(dirImages + id);
      const product = await Product.findById(id);

      const selectCategoty = product.selectCategoty.split(',');
      if (selectCategoty[0]) {
        for (let index = 0; index < selectCategoty.length; index++) {
          const catId = selectCategoty[index];
          const category = await Category.findById(catId);
          category.products = await category.products.filter((p) => {
            if (p.toString() !== id.toString()) {
              return p;
            }
          });
          await category.save();
        }
      }
    }
    await Product.deleteMany({_id: {$in: ids}});
    cache.clear();
    await res.json({message: ' удалена'});
  } catch (e) {
    Sentry.captureException(new Error(e));
    await res.status(500).json(e);
  }
};

async function saveProductInCategories(ids, productId) {
  try {
    if (ids[0]) {
      for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        const category = await Category.findById(id);
        category.products.push(productId);
        await category.save();
      }
    }
  } catch (e) {
    Sentry.captureException(new Error(e));
  }
}
