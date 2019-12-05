const stego = require("stegosaurus");
const router = require('express').Router();
const fs = require('fs')
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images')
    },
    filename: (req, file, cb) => {
        console.log(file)
      cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({storage: storage});

router.get('/', function (req, res, next) {
  res.send('Hello world!')
})

var original_png = "";		// Image you want to encode with a message, must be png.
var generated_png = "";		// The resulting file with image that can be encoded.
var message_string = "";  // The encoded message.

router.post('/encode', function (req, res, next) {
  stego.encodeString(original_png, generated_png, message_string, function (err) {
    if (err) { throw err; }
    console.log("Wrote png to: ", generated_png)
    res.status(200).json({
      message: 'Encoded your message to this image.',
      image: generated_png,
      message_length: message_string.length // use this when you want to decode the image 
    })
  })
})

router.post('/decode', function (req, res, next) {
  const { generated_png, message_length } = req.body

  stego.decode(generated_png, Number(message_length), function (payload) {
    console.log("Decoded message: ", payload);
    res.status(200).json({
      message: 'Decoded message in your image.',
      image: generated_png,
      decoded_message: payload
    })
  })
})

router.post('/encrypt', upload.single('image'), function(req, res, next) {
    // sudah write file ke folder images

    // lanjut encrypt disini

    // ini untuk delete file yg di folder images
    fs.unlinkSync(req.file.path)

    // upload ke gcs dan res send url
})

module.exports = router;