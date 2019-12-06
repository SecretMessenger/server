const stego = require("stegosaurus");
const fs = require('fs');
const uploadImage = require('../helpers/uploadImage');

class ImageController {
    static encode(req, res, next) {
        // const { message_string } = req.body;
        var message_string = "asd";  // The encoded message.
        let generated_png = req.file.destination + '/encoded/' + req.file.filename;
        stego.encodeString(req.file.path, generated_png, message_string, function (err) {
          if (err) { next(err) }

            fs.unlinkSync(req.file.path);

            let file = req.file;
            try {
                uploadImage({ file })
                .then(url => {
                    fs.unlinkSync(generated_png);
                    res.status(200).json({url});
                })
            } catch (error) {
                next(error)
            }
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