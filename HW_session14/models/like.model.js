var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
    postId: {
        type: String,
        min: 1,
        max: 60,
        required: [
            true, 'postId is required'
        ]
    },
    userId: {
        type: String,
        min: 1,
        max: 60,
        required: [
            true, 'userId is required'
        ]
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