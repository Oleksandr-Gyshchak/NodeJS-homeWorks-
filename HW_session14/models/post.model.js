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
    },
    last_updated: Date

});

userPostSchema.statics.getPosts = async function (callback) {
    return this.find({})
        .populate('author', ["firstName", "lastName", "avatar"])
        .sort({
            publicationDate: -1
        })
        .lean()
        .exec(callback);
}


userPostSchema.pre('save', function (next) {
    this.last_updated = Date.now();
    next();
});



var UserPost = mongoose.model('UserPost', userPostSchema, 'post_list');

module.exports = UserPost;