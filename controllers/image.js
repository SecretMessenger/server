const stego = require("stegosaurus");
const fs = require('fs');
const axios = require('axios')
const uploadImage = require('../helpers/uploadImage');
const ascii = /^[ -~\t\n\r]+$/;

class ImageController {
    static encode(req, res, next) {
        const { message_string } = req.body;
        let generated_png = req.file.destination + '/encoded/' + req.file.filename;
        stego.encodeString(req.file.path, generated_png, message_string, function (err) {
          if (err) { next(err) }

            fs.unlinkSync(req.file.path);

            let file = req.file;
            try {
                uploadImage({ file })
                .then(url => {
                    fs.unlinkSync(generated_png);
                    res.status(200).json({
                        url,
                        password: message_string.length
                    });
                })
            } catch (error) {
                next(error)
            }
        })
    }

    static decode(req, res, next) {
        const { message_length } = req.body;

        stego.decode(req.file.path, Number(message_length), function (payload) {
            fs.unlinkSync(file.path);
            
            if ( !ascii.test( payload ) ) {
                let err = {
                    status: 400,
                    msg: 'Wrong passcode'
                }
                next(err);
            } else { 
                res.status(200).json({
                    message: 'Decoded message in your image.',
                    image: req.file.path,
                    decoded_message: payload
                })
            }
        })
    }

    static decodeUrl(req, res, next) {
        const { url, message_length } = req.body;
        
        let filename = url.split('/')
        filename = filename[filename.length - 1];
        let filepath = `./images/writeStream/${filename}`;
        const writer = fs.createWriteStream(filepath)
      
        axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })
        .then(({data}) => {
            data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })
        })
        .then( _=> {
            stego.decode(filepath, Number(message_length), function (payload) {
                fs.unlinkSync(filepath);

                if ( !ascii.test( payload ) ) {
                    let err = {
                        status: 400,
                        msg: 'Wrong passcode'
                    }
                    next(err);
                } else {
                    res.status(200).json({
                    message: 'Decoded message in your image.',
                    image: filepath,
                    decoded_message: payload
                  })
                }  
            })
        })
        .catch(next)
    }
}

module.exports = ImageController;