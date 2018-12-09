var CommentModel = require('../models/comment.model');

const getCommentsByPostId = async function (req, res, next) {
    try {
        let conditionQuery = {
            postId: req.params.postId
        };

        const commentList = await CommentModel.findComments(conditionQuery);

        setEditable(commentList, req.user._id);

        res.status(200).json(commentList);

    } catch (err) {
        return next(err);
    }

}

const createComment = async function (req, res, next) {

    try {
        let commentItem = {
            text: req.body.text,
            postId: req.body.postId,
            publicationDate: Date.now(),
            author: req.user._id
        };

        const createdComment = await CommentModel.create(commentItem);

        res.status(201).json(createdComment);

    } catch (err) {
        return next(err);
    }
};

function findById(req, res, next) {
    let conditionQuery = {
        _id: req.params.commentid
    };

    CommentModel.findOne(conditionQuery, function (err, commentItem) {
        if (err) throw err;

        if (!commentItem) {
            return res.status(400).json({
                success: false,
                msg: "Comment not found"
            })
        }

        res.status(200).json(commentItem);
    });

}

const editComment = async function (req, res, next) {
    try {
        let conditionQuery = {
            _id: req.params.commentid
        };

        let editFields = {
            text: req.body.text
        };

        const commentItem = await CommentModel.findOneAndUpdate(conditionQuery, editFields);

        res.status(201).json(commentItem)

    } catch (err) {
        return next(err);
    }
}

const deleteCommentByID = async function (req, res, next) {
    try {
        let conditionQuery = {
            _id: req.params.commentid
        };

        await CommentModel.findOneAndDelete(conditionQuery);

        res.status(200).end();

    } catch (err) {
        return next(err);
    }
}


function setEditable(postList, userId) {
    postList.forEach(post => {
        post.editable = post.author._id.toString() === userId.toString()
    });
}


module.exports = {
    createComment,
    getCommentsByPostId,
    findById,
    deleteCommentByID,
    editComment
};