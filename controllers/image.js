const stego = require("stegosaurus");
const fs = require('fs');

class ImageController {
    static encode(req, res, next) {
        const { message_string } = req.body;
        // var message_string = "asd";  // The encoded message.
        let generated_png = req.file.destination + '/encoded/' + req.file.filename;
        stego.encodeString(req.file.path, generated_png, message_string, function (err) {
          if (err) { throw err; }
      
          fs.unlinkSync(req.file.path)
      
          res.status(200).json({
            message: 'Encoded your message to this image.',
            image: generated_png,
            message_length: message_string.length // use this when you want to decode the image 
          })
        })
    }

    static decode(req, res, next) {
        const { message_length } = req.body;

        stego.decode(req.file.path, Number(message_length), function (payload) {
      
          res.status(200).json({
            message: 'Decoded message in your image.',
            image: req.file.path,
            decoded_message: payload
          })
        })
    }
}

module.exports = ImageController;