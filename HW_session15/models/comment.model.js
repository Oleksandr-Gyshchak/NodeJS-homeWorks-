var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
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

commentSchema.statics.findComments = function (query, callback) {
    return this.find(query)
        .populate('author', [
            "firstName",
            "lastName",
            "avatar"
        ])
        .sort({
            publicationDate: -1
        })
        .lean()
        .exec(callback);



}




var UserComment = mongoose.model('UserComment', commentSchema, 'comments_list');

module.exports = UserComment;