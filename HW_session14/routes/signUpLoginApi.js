const express = require('express');
const router = express.Router();

var userController = require("../controllers/user");


router.post('/signup', function (req, res) {
    console.log(req.body);
    userController.createUser(req, res);
});

router.post('/signin', function (req, res) {
    console.log(req.body);
    userController.validateUser(req, res);
});

module.exports = router;