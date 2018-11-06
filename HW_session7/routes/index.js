var express = require('express');
var router = express.Router();

var getUserData = require('../controllers/getUserProfile');
userProfile = getUserData.getUserFrofileByid();


/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', {
    firstName: userProfile.user.firstName,
    lastName: userProfile.user.lastName,
    description: userProfile.user.description,
    friends: userProfile.user.friends
  });
});

module.exports = router;

/*



*/