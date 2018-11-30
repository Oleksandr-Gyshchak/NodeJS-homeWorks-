var CommentModel = require('../models/comment.model');

const createComment = function (req, res) {
    let commentText = req.body.text;
    let postId = req.body.postId;

    let comentItem = {
        text: commentText,
        postId: postId,
        publicationDate: Date.now(),
        author: req.user._id
    };

    saveToDB(comentItem, res);
};


const findComments = function (req, res) {
    let conditionQuery = {
        postId: req.params.postId
    }

    CommentModel.find(conditionQuery)
        .populate('author', [
            "fullName",
            "avatar"
        ])
        .sort({
            publicationDate: -1
        })
        .exec(
            (err, commentItem) => {
                if (err) {
                    res.status(401).json({
                        error: err.message
                    })
                };

                var comments = setEditable(commentItem, req);
                res.status(201).json(comments);
            }
        )

}

function setEditable(commentList, req) {
    var commentList = JSON.parse(JSON.stringify(commentList));

    commentList.forEach(post => {
        post.editable = (post.author._id == req.user._id)
    });

    return commentList;
}

function saveToDB(commentItem, res) {

    let Comment = new CommentModel(commentItem);
    Comment.save(function (err, commentItem) {
        if (err) {
            res.status(401).json({
                error: err.message
            })
        };
        res.json(commentItem);
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

    let editFields = {
        text: commentText
    };

    editCommentInDB(id, editFields, res);
}

function editCommentInDB(id, editFields, res) {

    CommentModel.findByIdAndUpdate(id, editFields, function (err, commentItem) {
        if (err) {
            res.status(401).json({
                error: error.message
            })

        }

        res.json(commentItem);
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
    findComments,
    findById,
    deleteCommentByID,
    editComment
};