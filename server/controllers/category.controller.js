const Sentry = require('../core/sentry')
const Category = require('../models/category.model')
const image = require('../core/image')
const fs = require('fs-extra')
const cache = require('../core/cache')
const sharp = require('sharp')


const translit = require('cyrillic-to-translit-js')
let seoCount = 1

async function createSeoUrl(name) {
  let seoTrl = await translit().transform(name.toLowerCase(), '-')
  const categorySeoUrl = await Category.findOne({seoUrl: seoTrl}).select(
      'seoUrl'
  );
  if (categorySeoUrl) {
    seoTrl = seoTrl + (++seoCount)
    seoTrl = await createSeoUrl(seoTrl)
  }
  return seoTrl
}

module.exports.create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.metaTitle) {
      res.status(500).json(null)
      return;
    }
    const seoUrl = await createSeoUrl(req.body.name);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords,
      sortOrder: req.body.sortOrder,
      status: req.body.status,
      seoUrl,
    })

    if (req.body.parent) {
      category.parent = req.body.parent
    }

    if (req.file) {
      category.imageSrc = req.file.filename
    }


    await category.save()

    if (req.file) {
      // создание папки
      const dirImage = `static/catalog/categories/${category._id}`
      await fs.ensureDirSync(dirImage);
      sharp(req.file.path)
          .resize(250).toFile(
              `${dirImage}/${req.file.filename}`
          )
          .then((data) => {
            fs.remove(req.file.path)
          })
    }
    cache.clear()
    await res.status(201).json(category)
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find().sort({sortOrder: 1})
    await res.status(200).json(categories)
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
};


module.exports.getByid = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
        .populate({
          path: 'products',
          select: 'name images price wholesalePrice ' +
              'newPrice minimum size model seoUrl status',
        })
    if (!category) {
      await res.status(200).json(null)
      return;
    }
    await res.status(200).json(category)
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
};


module.exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({status: 1}).sort({
      sortOrder: 1,
    }).select('name parent seoUrl imageSrc');
    await res.json(categories)
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(null)
  }
};

module.exports.getBySeoUrl = async (req, res) => {
  try {
    const limit = +req.query.limit || 24
    const skip = +req.query.start || 0
    let sort = {date: -1}
    let match = {status: 1}

    if (
      typeof req.query.tag !== 'undefined' &&
        !req.query.tag.includes('Всё')
    ) {
      match = {
        tags: {$elemMatch: {name: {$in: req.query.tag}}},
        status: 1
      };
    }

    if (req.query.sort === 'name') {
      sort = {name: -1}
    } else if (req.query.sort === 'price') {
      sort = {price: 1}
    } else {
      sort = {sort_order: 1, date: -1}
    }


    const sortKey = '-sort-' + Object.keys(sort)[0].toString()+ req.query.tag


    const fetchCategories = async () => {
      try {
        const cat = await Category.findOne({seoUrl: req.params.id})
            .populate({
              path: 'products',
              options: {sort},
              match,
              select: 'name images price wholesalePrice ' +
                  'newPrice minimum size model seoUrl imageSrc lazySrc',
            })


        if (!cat) {
          return null
        }


        match = {status: 1}
        const catTabs = await Category.findOne({seoUrl: req.params.id})
            .populate({
              path: 'products',
              options: {sort},
              match,
              select: 'tags',
            })


        const tags = ['Всё']

        if (catTabs.products.length) {
          catTabs.products.forEach((p) => {
            if (typeof p.tags !== 'undefined') {
              p.tags.forEach((t) => {
                if (!tags.includes(t.name.trim())) {
                  tags.push(t.name.trim());
                }
              });
            }
          })
        }
        cat.tags = tags

        cache.set(cat.seoUrl.toString() + sortKey, cat)
        return cat
      } catch (e) {
        console.log(e)
        await res.status(200).json(null)
      }
    }

    const categoryCache = cache.get( req.params.id.toString() + sortKey)
    const category = categoryCache || await fetchCategories()

    if (!category) {
      await res.status(200).json(null)
      return;
    }

    if (!category.products) {
      category.products = []
    }


    category.productsCount = category.products.length
    category.products = category.products.slice(skip, (skip + limit))


    if (category.products.length) {
      await image.cacheImages(category.products)
    }

    await res.status(200).json(category)
  } catch (e) {
    Sentry.captureException(new Error(e))
    // await res.status(500).json(null);
  }
};


// module.exports.fetchBreadcrumbsById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id).select(
//         '_id name parent seoUrl'
//     );
//     await res.status(200).json(category)
//   } catch (e) {
//     await res.status(500).json(e)
//   }
// };

module.exports.remove = async (req, res) => {
  const ids = req.body;
  const dirCache = 'static/cache/categories/';
  const dirImages = 'static/catalog/categories/';
  ids.forEach((id) => {
    try {
      fs.remove(dirCache + id)
      fs.remove(dirImages + id)
    } catch (err) {
      Sentry.captureException(new Error(err))
    }
  });
  try {
    await Category.deleteMany({_id: {$in: ids}})

    await res.json({message: 'Категория удалена'})
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
};

// module.exports.clearCache = async (req, res) => {
//   try {
//     CategoryCache.flushAll()
//     res.status(200)
//   } catch (e) {
//     console.log(e)
//   }
// };

module.exports.update = async (req, res) => {
  try {
    if (!req.body.name || !req.body.metaTitle) {
      await res.status(500).json(null)
      return;
    }

    const categorySeoData = await Category.findById(req.params.id).select(
        'name seoUrl'
    );
    let seoUrl = categorySeoData.seoUrl
    if (categorySeoData.name !== req.body.name) {
      seoUrl = await createSeoUrl(req.body.name);
    }

    const $set = {
      name: req.body.name,
      description: req.body.description,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords,
      sortOrder: req.body.sortOrder,
      status: req.body.status,
      seoUrl,
    };

    if (req.body.parent) {
      $set.parent = req.body.parent;
    } else {
      $set.parent = ''
    }

    if (req.file) {
      $set.imageSrc = req.file.filename
    }


    const category = await Category.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {$set},
        {new: true}
    );

    if (req.file) {
      await fs.remove(`static/cache/categories/${category._id}`)
      await fs.remove(`static/catalog/categories/${category._id}`)

      // создание папки
      // const dirCache = `static/cache/categories/${category._id}`
      const dirImage = `static/catalog/categories/${category._id}`
      await fs.ensureDirSync(dirImage);
      sharp(req.file.path)
          .rotate()
          .resize(250).toFile(
              `${dirImage}/${req.file.filename}`,
              (err, info) => { })
          .toBuffer()
          .then((data) => {
            fs.remove(req.file.path)
          })
    }

    cache.clear()
    await res.json(category);
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e);
  }
};
