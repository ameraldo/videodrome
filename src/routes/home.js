const router = require('express').Router();

const home = require('../core/home');

router.get('/', home);

module.exports = router;
