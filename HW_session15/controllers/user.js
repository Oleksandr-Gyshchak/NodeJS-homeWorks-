var UserModel = require('../models/user.model');

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const secretWord = 'sercretWordForDecoding';

var PostModel = require('../models/post.model');
var CommentModel = require('../models/comment.model');
var LikesModel = require('../models/like.model');

const createUser = function (req, res) {

    let userItem = {
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        description: req.body.description,
        avatar: '/assets/img/avatar-mdo.png',
        createdDate: Date.now()
    };

    let User = new UserModel(userItem);
    User.save(function (err, userItem) {
        if (err) {
            res.status(500).json({
                error: err.message
            })
        };

        res.status(201).json({
            success: true,
            msg: userItem
        });
    });

};

function validateUser(req, res) {
    UserModel.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(400).send({
                success: false,
                msg: "User not found"
            })
        }

        user.comparePassword(req.body.password,
            function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user.toObject(), secretWord, {
                        expiresIn: '1d'
                    });

                    return res.status(200).json({
                        success: true,
                        token: "JWT " + token
                    })
                }

                res.status(400).json({
                    success: false,
                    msg: 'Wrong password'
                })
            }
        )
    })
}

const getUserProfile = async function (req, res, next) {
    try {
        let conditionQuery = {
            _id: req.params.userId
        };

        const userProfile = await UserModel.findOne(conditionQuery).lean();

        const userAdditionalInfo = await getUserAdditionalInfo(req.params.userId);
        setUserAdditionalInfo(userProfile, userAdditionalInfo, req.user._id);

        res.status(200).json(userProfile)

    } catch (err) {
        return next(err);
    }
}

const getUserAdditionalInfo = async function (userID) {
    const userInfo = {};
    const conditionQuery = {
        'author': userID
    };

    const userPostCount = await PostModel.find(conditionQuery).count();
    const userCommentCount = await CommentModel.find(conditionQuery).count();
    const userLikesCount = await LikesModel.find({
        'userId': userID
    }).count();

    userInfo.userPostCount = userPostCount;
    userInfo.userCommentCount = userCommentCount;
    userInfo.userLikesCount = userLikesCount;
    userInfo.commentsAVG = userLikesCount / userPostCount;

    return userInfo;
}


const getCurrentUserProfile = function (req, res, next) {
    req.params.userId = req.user._id
    getUserProfile(req, res, next);
}

const editUser = async function (req, res, next) {

    try {
        let conditionQueryForEdit = {
            _id: req.params.userId
        };

        let editFields = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            description: req.body.description,
            avatar: '/assets/img/avatar-mdo.png',
        };

        const userItem = await UserModel.findOneAndUpdate(conditionQueryForEdit, editFields);

        res.status(201).json(userItem);
    } catch (err) {
        return next(err);
    }
}

function setUserAdditionalInfo(userProfile, userAdditionalInfo, currentUserId) {
    userProfile.postsNumber = userAdditionalInfo.userPostCount;
    userProfile.likesNumber = userAdditionalInfo.userLikesCount;
    userProfile.commentsNumber = userAdditionalInfo.userCommentCount;
    userProfile.commentsAVG = userAdditionalInfo.commentsAVG;
    userProfile.editable = userProfile._id.toString() === currentUserId.toString();
}

module.exports = {
    createUser,
    validateUser,
    getUserProfile,
    getCurrentUserProfile,
    editUser
};