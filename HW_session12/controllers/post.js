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

        res.status(201).json({
            createdPost
        });

    } catch (err) {
        return next(err);
    }

};


const getPostlist = async function (req, res, next) {
    let pageLimit = 4

    try {
        const postList = await PostModel.find({})
            .populate('author', ["fullName", "avatar"])
            .sort({
                publicationDate: -1
            })
            .limit(pageLimit)
            .lean()
            .exec()

        setEditable(postList, req);

        const modelLength = await PostModel.estimatedDocumentCount();
        let totalPages = Math.ceil(modelLength / pageLimit);
        console.log(
            'totalPages :', totalPages,
            'page', 1

        )

        res.status(200).json(postList);
    } catch (err) {
        return next(err);
    }

}


function setPagination() {
    /*

    npm install mongoose-paginate-v2
    
        const options = {
            page: 1,
            limit: 10
        };
         
        Model.paginate({}, options, function(err, result) {
            // result.docs
            // result.totalDocs = 100
            // result.limit = 10
            // result.page = 1
            // result.totalPages = 10    
            // result.hasNextPage = true
            // result.nextPage = 2
            // result.hasPrevPage = false
            // result.prevPage = null
            
        });
    */

}

function setEditable(postList, req) {
    postList.forEach(post => {
        post.editable = post.author._id.toString() === req.user._id.toString()
    });
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
            res.status(404).json({
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




module.exports = {
    createPost,
    getPostlist,
    findOnePost,
    removePost,
    editPost,
    checkUserPermission
};