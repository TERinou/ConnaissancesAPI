const router = require('express').Router();

router.use('/conversations', require('./conversations'));

module.exports = router;