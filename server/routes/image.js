const { Router } = require('express');

const { tokenVerification } = require('../middlewares/authentication');

const router = Router();

const { upload, getImage } = require('../controllers/image.controller');

router.route('/upload/:type/:id')
    .all(tokenVerification)
    .put(upload);

router.route('/image/:type/:img')
    .all(tokenVerification)
    .get(getImage);

module.exports = router;
