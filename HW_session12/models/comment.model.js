var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPostSchema = new Schema({
    postId: String,
    text: {
        type: String,
        min: 1,
        max: 60,
        required: [true, 'Text is required']
    },
    publicationDate: Date,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

var UserComment = mongoose.model('UserComment', userPostSchema, 'comments_list');

module.exports = UserComment;