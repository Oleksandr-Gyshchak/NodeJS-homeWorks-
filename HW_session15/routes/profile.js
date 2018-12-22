const express = require('express');
const router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
    res.render('profile');
});

module.exports = router;
