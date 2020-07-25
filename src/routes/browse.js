const router = require('express').Router();

const browser = require('../core/browser');

router.get('/', browser);

module.exports = router;
