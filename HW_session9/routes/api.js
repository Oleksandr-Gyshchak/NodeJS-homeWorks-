const express = require('express');
const router = express.Router();
var posts = require('../data/mock-data').posts;

var postController = require("../controllers/post");

/* 
Необходимые эндпоинты
 */
router.get('/posts', function (req, res) {
    postController.getPostlist(req, res);
});

router.post('/posts', function (req, res) {
    postController.createPost(req, res);
});

router.get('/posts/:postId/', function (req, res) {
    postController.findById(req, res);
});

router.delete('/posts/:postId/', function (req, res) {
    postController.deletePostByID(req, res);
});

router.patch('/posts/:postId/', function (req, res) {
    postController.editPost(req, res);
});

module.exports = router;