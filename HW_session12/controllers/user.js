var UserModel = require('../models/user.model');

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const secretWord = 'sercretWordForDecoding';

const createUser = function (req, res) {

    let userItem = {
        _id: new mongoose.Types.ObjectId(),
        createdDate: Date.now(),
        fullName: req.body.fullName,
        username: req.body.username,
        password: req.body.password,
        passwordRememberMe: req.body.password,
        token: null,
        avatar: '/assets/img/avatar-mdo.png'
    };

    let User = new UserModel(userItem);
    User.save(function (err, userItem) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err.message
            })
        };

        res.status(201).json(userItem);
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


module.exports = {
    createUser,
    validateUser
};