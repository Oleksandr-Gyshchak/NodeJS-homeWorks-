const express = require('express');
const router = express.Router();

/* GET notifications page. */
router.get('/', function(req, res, next) {
    res.render('notifications');
});

module.exports = router;
