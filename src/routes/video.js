const router = require('express').Router();

const video = require('../core/video');


router.get('/', video.view);
router.get('/stream', video.stream);


module.exports = router;
