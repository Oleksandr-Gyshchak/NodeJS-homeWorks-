var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPost'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


likeSchema.index({
    postId: 1,
    userId: 1
}, {
    unique: true
});




var LikePost = mongoose.model('LikePost', likeSchema, 'likes_list');

module.exports = LikePost;