// eslint-disable-next-line camelcase
const fs = require('fs')
const path = require('path');
const archiver = require('archiver')


const folderArchiver = (source , zipName = 'images.zip' ) =>{
  return new Promise(function(resolve, reject) {
    const fpath = path.join(__dirname, '..', '..', 'static', 'cache', zipName);
    const output = fs.createWriteStream(fpath)
    const archive = archiver('zip')

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized.')
      resolve(fpath)
    });

    archive.on('error', function(err) {
      throw err
    });

    archive.pipe(output)

    archive.directory(source, false)
    archive.finalize()
  })
}


module.exports = folderArchiver
