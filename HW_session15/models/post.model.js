var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var postSchema = new mongoose.Schema({
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

postSchema.statics.getPosts = async function (paginationConfig, callback) {
    return this.find({})
        .populate('author', ["firstName", "lastName", "avatar"])
        .limit(paginationConfig.itemPerPage)
        .sort({
            publicationDate: -1
        })
        .lean()
        .exec(callback);
}

postSchema.statics.getPosts2 = async function (paginationConfig, callback) {
    return this.find({})
        .populate('author', ["firstName", "lastName", "avatar"])
        .sort({
            publicationDate: -1
        })
        .lean(callback);
}


postSchema.pre('save', function (next) {
    this.last_updated = Date.now();
    next();
});


postSchema.index({
    '$**': 'text'
});

postSchema.plugin(mongoosePaginate);

var UserPost = mongoose.model('UserPost', postSchema, 'post_list');

module.exports = UserPost;