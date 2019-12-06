const convertapi = require('convertapi')(process.env.CONVERTAPI_SECRET)

module.exports = async (file) => {
  let filepath;

  await convertapi
    .convert('png', {
        File: './' + file.path
      }, 'jpg')
    .then(function (result) {
      let name = file.filename.split('.')
      filepath = './images/converted/' + name[0] + '.png'
      // result.saveFiles(filepath)
      // console.log("Files saved: " + result);
      // if (result) {}
      return result.file.save(filepath);
    })
    .then(file => {
      console.log(file)
    })
  return filepath;
}