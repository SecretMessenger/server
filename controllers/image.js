const stego = require("stegosaurus");
const fs = require('fs');
const axios = require('axios')
const uploadImage = require('../helpers/uploadImage');
const convertToPng = require('../helpers/convertJPGToPNG');
const ascii = /^[ -~\t\n\r]+$/;

class ImageController {
    static async encode(req, res, next) {
        const { message_string } = req.body;
        let generated_png = req.file.destination + '/encoded/' + req.file.filename;
        let filepath = req.file.path;

        if (req.file.mimetype === 'image/jpeg') {
            console.log(filepath)
            filepath = await convertToPng(req.file);
        }
        
        stego.encodeString(filepath, generated_png, message_string, function (err) {
          if (err) { next(err) }
            fs.unlinkSync(filepath);

            let file = req.file;
            try {
                uploadImage({ file })
                    .then(url => {
                        fs.unlinkSync(generated_png);
                        if (filepath !== req.file.path) {
                            fs.unlinkSync(req.file.path);
                        }
                        
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
        const { password } = req.body;

        stego.decode(req.file.path, Number(password), function (payload) {
            fs.unlinkSync(req.file.path);
            
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
        const { url, password } = req.body;
        
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
            stego.decode(filepath, Number(password), function (payload) {
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