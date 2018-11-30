var UserPostModel = require('../models/postUser.model');
var userInfo = require('../data/mock-data').userInfo;
var mongoose = require('mongoose');

const createPost = function (req, res) {
    let postText = req.body.text;
    let filePath = req.filePath;

    let postItem = {
        _id: new mongoose.Types.ObjectId(),
        text: postText,
        picture: filePath,
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

    saveToDB(postItem, res);
};


const getPostlist = function (req, res) {
    UserPostModel.find({},
        '', {
            sort: {
                publicationDate: -1
            }
        },
        function (err, postList) {
            if (err) {
                console.log(err);
                res.status(401).json({
                    error: err.message
                })
            };
            res.json(postList);
        });
}

function saveToDB(postItem, res) {

    let UserPost = new UserPostModel(postItem);
    UserPost.save(function (err, postItem) {
        if (err) {
            res.status(401).json({
                error: err.message
            })
        };
        res.json(postItem);
    });
}


function findById(req, res) {
    let id = req.params.postId

    UserPostModel.findById(id, function (err, postItem) {
        if (err) {
            res.status(404).json({
                error: err.message
            })
        }
        res.json(postItem);
    });

}

function editPost(req, res) {
    let postText = req.body.text;
    let id = req.params.postId;
    let filePath = req.filePath;

    upDatePostInDB(id, postText, filePath, res);

}

function upDatePostInDB(id, textPost, imgPath, res) {

    UserPostModel.findByIdAndUpdate(id, {
        text: textPost,
        picture: imgPath
    }, function (err, postItem) {
        if (err) {
            let error = new Error(err.message)
            res.status(401).json({
                error: error
            })

        }
        console.log("Обновленный объект", postItem);
        res.json(postItem);
    });


}

function deletePostByID(req, res) {
    let id = req.params.postId
    UserPostModel.findByIdAndRemove(id, function (err, postItem) {
        if (err) throw err;
        res.send(postItem);
    });
}

module.exports = {
    createPost,
    getPostlist,
    findById,
    deletePostByID,
    editPost
};