var PostModel = require('../models/post.model');
var CommentModel = require('../models/comment.model');
var mongoose = require('mongoose');

const createPost = async function (req, res, next) {
    try {
        let postItem = {
            _id: new mongoose.Types.ObjectId(),
            text: req.body.text,
            picture: req.filePath,
            publicationDate: Date.now(),
            author: req.user._id
        };

        const createdPost = await PostModel.create(postItem);

        res.status(201).json(createdPost);

    } catch (err) {
        return next(err);
    }

};


const getPostlist = async function (req, res, next) {
    try {
        const postList = await PostModel.getPosts();
        setEditable(postList, req);

        res.status(200).json(postList);
    } catch (err) {
        return next(err);
    }
}



function findOnePost(req, res) {
    let conditionQuery = {
        _id: req.params.postId
    };

    PostModel.findOne(conditionQuery, function (err, postItem) {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        }
        res.status(200).json(postItem);
    });

}

const editPost = async function (req, res) {

    try {
        let conditionQuery = {
            _id: req.params.postId
        };

        let editFields = {
            text: req.body.text,
            picture: req.filePath
        };

        const postItem = await PostModel.findOneAndUpdate(conditionQuery, editFields);

        res.status(201).json(postItem)

    } catch (err) {
        return next(err);
    }
}


const removePost = async function (req, res, next) {
    try {
        const postId = req.params.postId;

        let conditionQuery = {
            _id: postId
        };

        await PostModel.findOneAndDelete(conditionQuery)
        await CommentModel.deleteMany({
            postId: postId
        })

        res.status(200).end();

    } catch (err) {
        return next(err);
    }
}


function checkUserPermission(req, res, next) {
    let postId = req.params.postId;

    PostModel.findById(postId, function (err, postItem) {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        }

        if (
            postItem.author._id.toString() == req.user._id.toString()
        ) {
            next();
        } else {
            res.status(403).json({
                error: "You are not allowed to edit this item"
            })
        }
    });

}

function setEditable(postList, req) {
    postList.forEach(post => {
        post.editable = post.author._id.toString() === req.user._id.toString()
    });
}




module.exports = {
    createPost,
    getPostlist,
    findOnePost,
    removePost,
    editPost,
    checkUserPermission
};