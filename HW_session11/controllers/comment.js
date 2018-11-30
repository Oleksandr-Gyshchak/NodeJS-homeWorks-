var CommentModel = require('../models/comment.model');
var userInfo = require('../data/mock-data').userInfo;
var mongoose = require('mongoose');

const createComment = function (req, res) {
    let commentText = req.body.text;
    let postId = req.body.postId;

    let comentItem = {
        text: commentText,
        postId: postId,
        publicationDate: Date.now(),
        author: {
            _id: userInfo._id,
            username: userInfo.username,
            password: userInfo.password,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            avatarUrl: userInfo.avatarUrl
        }
    };

    saveToDB(comentItem, res);
};


const getCommentslist = function (req, res) {
    let postid = {
        postId: req.params.postId
    }

    CommentModel.find(postid,
        '', {
            sort: {
                publicationDate: -1
            }
        },
        function (err, commentsList) {
            if (err) {
                console.log(err);
                res.status(401).json({
                    error: err.message
                })
            };
            res.json(commentsList);
        });
}

function saveToDB(postItem, res) {

    let Comment = new CommentModel(postItem);
    Comment.save(function (err, postItem) {
        if (err) {
            res.status(401).json({
                error: err.message
            })
        };
        res.json(postItem);
    });
}


function findById(req, res) {
    let id = req.params.commentid;

    CommentModel.findById(id, function (err, postItem) {
        if (err) {
            res.status(404).json({
                error: err.message
            })
        }
        res.json(postItem);
    });

}

function editComment(req, res) {
    let commentText = req.body.text;
    let id = req.params.commentid;

    editCommentInDB(id, commentText, res);
}

function editCommentInDB(id, commentText, res) {

    CommentModel.findByIdAndUpdate(id, {
        text: commentText
    }, function (err, postItem) {
        if (err) {
            let error = new Error("Ошибка")
            res.status(401).json({
                error: error
            })

        }
        console.log("Обновленный объект", postItem);
        res.json(postItem);
    });


}

function deleteCommentByID(req, res) {
    let id = req.params.commentid
    CommentModel.findByIdAndRemove(id, function (err, commentItem) {
        if (err) throw err;
        res.send(commentItem);
    });
}

module.exports = {
    createComment,
    getCommentslist,
    findById,
    deleteCommentByID,
    editComment
};