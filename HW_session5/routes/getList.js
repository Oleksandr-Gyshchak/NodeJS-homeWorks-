var express = require('express');
var router = express.Router();

var getListItems = require('../controllers/getListItems');

/* GET list. */
router.get('/', function (req, res, next) {
  var list = getListItems.getList();

  if (list) {
    res.status(200).send(
      list
    )
  } else {
    res.status(404).send({
      error: 'Data list is empty'
    });
  }
  //next();
});

router.get('/:id', function (req, res, next) {
  var id = req.params.id;

  if (isNaN(id)) {
    res.status(404).send({
      error: `Invalid id: ${id}`
    })
  }

  var item = getListItems.getListItemById(id);

  if (item) {
    res.status(200).json(
      item
    );
  } else {
    res.status(404).send({
      error: `There is no such item with id: ${id}`
    })
  }

  //next();
})

module.exports = router;