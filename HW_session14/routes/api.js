const express = require('express');
const router = express.Router();

var passport = require('passport');

var postController = require("../controllers/post");
let commentControler = require('../controllers/comment');
let userControler = require('../controllers/user');

let saveImg = require('../controllers/saveImg').saveImg;
let checkPermission = require('../controllers/post').checkUserPermission

router.use(
    passport.authenticate('jwt', {
        session: false
    }),
    function (req, res, next) {
        next();
    }


)





router.get('/posts', postController.getPostlist);
router.post('/posts', saveImg, postController.createPost);
router.get('/posts/:postId/', postController.findOnePost);
router.delete('/posts/:postId/', checkPermission, postController.removePost);

router.patch('/posts/:postId/', checkPermission, saveImg, postController.editPost);
router.get('/posts/:postId/comments', commentControler.getCommentsByPostId);
router.post('/posts/:postId/comments/', commentControler.createComment);
router.get('/posts/:postId/comments/:commentid', commentControler.findById);


router.patch('/posts/:postId/comments/:commentid', commentControler.editComment);
router.delete('/posts/:postId/comments/:commentid', commentControler.deleteCommentByID);



router.post('/likes', postController.setLikeOrDislikeForPost);

router.get('/user-profile', userControler.getCurrentUserProfile);

router.get('/user-profile/:userId', userControler.getUserProfile);
router.post('/user-profile/:userId', userControler.editUser);


module.exports = router;