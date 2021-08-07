
const fs = require('fs-extra');
// const path = require('path');
const archiver = require('../core/archiver')

module.exports.loader = async function(req, res) {
  try {
    await archiver('static/catalog')
    res.status(200).json({message: 'ok'})
  } catch (e) {
    res.status(500).json(e)
  }
}


module.exports.cacheClear = async function(req, res) {
  try {
    if (fs.existsSync('static/cache')) {
      fs.remove('static/cache');
    }

    res.status(200).json({message: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}
