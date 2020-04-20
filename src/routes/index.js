const router = require('express').Router();

const home = require('./home');
const browse = require('./browse');
const video = require('./video');


router.use('/', home);
router.use('/browse', browse);
router.use('/video', video);


module.exports = router;
