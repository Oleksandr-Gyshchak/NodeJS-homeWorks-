const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');

const secretWord = 'sercretWordForDecoding';

module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: secretWord
    };

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        User.findOne({
            _id: jwt_payload._id
        }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            done(null, false);
        });
    }));
}