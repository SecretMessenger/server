const stego = require("stegosaurus");
const router = require('express').Router();

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
  const { message_length } = req.body

  stego.decode(generated_png, Number(message_length), function (payload) {
    console.log("Decoded message: ", payload);
    res.status(200).json({
      message: 'Decoded message in your image.',
      image: generated_png,
      decoded_message: payload
    })
  })
})

module.exports = router;