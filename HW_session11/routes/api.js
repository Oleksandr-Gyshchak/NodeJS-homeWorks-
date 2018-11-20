const express = require('express');
const router = express.Router();
var posts = require('../data/mock-data').posts;

var postController = require("../controllers/post");
let commentControler = require('../controllers/comment');

let saveImg = require('../controllers/saveImg').saveImg;
/* 
Необходимые эндпоинты
 */
router.get('/posts', function (req, res) {
    postController.getPostlist(req, res);
});

router.post('/posts', saveImg, function (req, res) {
    postController.createPost(req, res);
});

router.get('/posts/:postId/', function (req, res) {
    postController.findById(req, res);
});

router.delete('/posts/:postId/', function (req, res) {
    postController.deletePostByID(req, res);
});



router.patch('/posts/:postId/', saveImg, function (req, res) {
    postController.editPost(req, res);
});

router.get('/posts/:postId/comments', function (req, res) {
    commentControler.getCommentslist(req, res);
});

router.post('/posts/:postId/comments/', function (req, res) {
    commentControler.createComment(req, res);
});

router.get('/posts/:postId/comments/:commentid', function (req, res) {
    commentControler.findById(req, res);
});


router.patch('/posts/:postId/comments/:commentid', function (req, res) {
    commentControler.editComment(req, res);
});

router.delete('/posts/:postId/comments/:commentid', function (req, res) {
    commentControler.deleteCommentByID(req, res);
});





module.exports = router;