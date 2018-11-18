var UserPostModel = require('../models/postUser.model');
var userInfo = require('../data/mock-data').userInfo;

const createPost = function (req, res) {
    let postText = req.body.text;

    if (req.files) {
        let pictureName = Date.now();
        let pictureItem = req.files.picture;
        let filePath = '/images/' + pictureName + '.jpeg';
        pictureItem.mv(__dirname + '/../public' + filePath, function (err) {
            if (err) {
                console.log(err);
            } else {
                saveToDB(postText, filePath, userInfo, res);
            }
        });

    } else {
        let imgUrl = req.body['picture'];
        saveToDB(postText, imgUrl, userInfo, res);
    }

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
                res.status(404).json({
                    error: err.message
                })
            };
            res.json(postList);
        });
}

function saveToDB(postText, filePath, userInfo, res) {

    let postItem = {
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

    if (req.files) {
        let pictureName = Date.now();
        let pictureItem = req.files.picture;
        let filePath = '/images/' + pictureName + '.jpeg';
        pictureItem.mv(__dirname + '/../public' + filePath, function (err) {
            if (err) {
                console.log(err);
            } else {
                upDatePostInDB(id, postText, filePath, res);
            }
        });

    } else {
        let imgUrl = req.body['picture'];
        upDatePostInDB(id, postText, imgUrl, res);
    }
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