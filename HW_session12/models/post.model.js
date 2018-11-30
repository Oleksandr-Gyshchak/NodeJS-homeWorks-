var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: {
        type: String,
        min: 1,
        max: 60,
        required: [true, 'Text is required']
    },
    picture: {
        type: String,
        required: true
    },
    publicationDate: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

var UserPost = mongoose.model('UserPost', userPostSchema, 'post_list');

module.exports = UserPost;