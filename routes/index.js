const router = require('express').Router();
const multer  = require('multer')
const ImageController = require('../controllers/image');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({storage: storage});

router.get('/', function (req, res, next) {
  res.send('Hello world!')
})

router.post('/encode', upload.single('image'), ImageController.encode);
router.post('/decode', upload.single('image'), ImageController.decode);

router.post('/decodeUrl', ImageController.decodeUrl);

module.exports = router;