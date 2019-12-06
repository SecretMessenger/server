const convertapi = require('convertapi')(process.env.CONVERTAPI_SECRET)

module.exports = async (file) => {
  // console.log('masuk convert to png', file)
  let filepath

  await convertapi.convert('png', {
    
    File: file.path
  
  }, 'jpg').then(function (result) {
    
    let name = file.filename.split('.')

    filepath = './images/converted/' + name[0] + '.png'

    result.saveFiles(filepath)
  })

  return filepath
}