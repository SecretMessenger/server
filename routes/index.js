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

router.get('/', function(req, res, next) {
    res.send('Hello world!')
})

router.post('/encrypt', upload.single('image'), function(req, res, next) {
    // sudah write file ke folder images

    // lanjut encrypt disini

    // ini untuk delete file yg di folder images
    fs.unlinkSync(req.file.path)

    // upload ke gcs dan res send url
})

module.exports = router;