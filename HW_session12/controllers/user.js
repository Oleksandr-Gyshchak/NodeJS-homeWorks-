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
            res.status(401).json({
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
            return res.status(401).send({
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
                    console.log(token);
                    // verifyToken(token);
                    //editUser(token, req, res)

                    return res.status(200).json({
                        success: true,
                        token: "JWT " + token
                    })
                }

                res.status(401).json({
                    success: false,
                    msg: 'Wrong password'
                })
            }
        )
    })
}

function editUser(token, req, res) {

    UserModel.findOneAndUpdate({
            username: req.body.username
        }, {
            token: token
        },
        function (err, userItem) {
            if (err) {
                res.status(401);
            }

            //res.json(userItem);
            return res.status(200).json({
                success: true,
                token: "JWT " + token
            })


        });
}



function setTokenToUser(token, req, res) {




}

function verifyToken(token) {
    jwt.verify(token, secretWord, function (err, decoded) {
        if (err) {
            console.error('err: ', err);
        } else {
            console.log('decoded: ', decoded);
        }
    });

}




module.exports = {
    createUser,
    validateUser
};