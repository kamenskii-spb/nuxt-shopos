const Sentry = require('../core/sentry')
const Page = require('../models/page.model')
const translit = require('cyrillic-to-translit-js')
let seoUrlCount = 0

async function createSeoUrl(title) {
  try {
    let seoTrl = await translit().transform(title.toLowerCase(), '-')
    const pageSeoUrl = await Page.findOne({url: seoTrl}).select(
        'url'
    );
    if (pageSeoUrl) {
      seoTrl = seoTrl + (++seoUrlCount)
      seoTrl = await createSeoUrl(seoTrl)
    }
    return seoTrl
  }catch (e) {
    Sentry.captureException(new Error(e))
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const pages = await Page.find().select('title url').sort({sortOrder: 1})
    await res.json(pages)
  } catch (e) {
    await res.status(500).json(e)
  }
}

module.exports.getByUrl = async (req, res) => {
  try {
    const page = await Page.findOne({url: req.params.url})
    res.json(page)
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

module.exports.update = async (req, res) => {
  try {
    if (!req.body.title) {
      res.json({message: 'Неполные данные'})
      return
    }
    const $set = {
      title: req.body.title,
      sortOrder: +req.body.sortOrder,
      html: req.body.html,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords
    }
    await Page.findOneAndUpdate({_id: req.body.id}, {$set})
    await res.status(204).json()
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
}


module.exports.create = async (req, res) => {
  try {
    if (!req.body.title) {
      res.json({message: 'Неполные данные'})
      return
    }
    const data = {
      title: req.body.title,
      url: await createSeoUrl(req.body.title),
      sortOrder: +req.body.sortOrder,
      html: req.body.html,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaKeywords: req.body.metaKeywords
    }
    const newPage = new Page(data)
    await newPage.save()
    await res.status(201).json(newPage)
  } catch (e) {
    Sentry.captureException(new Error(e))
    await res.status(500).json(e)
  }
}

module.exports.remove = async (req, res) => {
  try {
    await Page.deleteOne({_id: req.params.id})
    res.json({message: 'Страница удалена'})
  } catch (e) {
    Sentry.captureException(new Error(e))
    res.status(500).json(e)
  }
}

