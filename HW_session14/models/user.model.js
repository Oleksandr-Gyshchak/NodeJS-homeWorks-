var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: [
            true, 'FirstName is required'
        ],
    },
    lastName: {
        type: String,
        required: [
            true, 'LastName is required'
        ],
    },
    username: {
        type: String,
        required: [
            true, 'Username is required'
        ],
    },
    password: {
        type: String,
        required: [
            true, 'Password is required'
        ],
    },
    email: {
        type: String
    },
    description: {
        type: String
    },
    createdDate: Date,
    avatar: String,
    last_updated: Date
});

UserSchema.pre('save', function (next) {
    this.last_updated = Date.now();
    next();
});


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(
                user.password, salt, null,
                function (err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                }
            );
        });
    } else {
        next();
    }
})





UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(
        passw, this.password,
        function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        }
    );
}

var User = mongoose.model('User', UserSchema, 'user_list');

module.exports = User;