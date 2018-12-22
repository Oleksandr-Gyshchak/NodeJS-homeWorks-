var mongoose = require("mongoose");
const dbURI = 'mongodb://admin:admin12345678@ds159293.mlab.com:59293/social_network';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', function () {
    console.info("Mongoose connected to " + dbURI);
});

mongoose.connection.on('error', function (req, res, next) {
    console.info("Mongoose error " + dbURI);
});

mongoose.connection.on('disconnected', function () {
    console.info("Mongoose disconnected " + dbURI);
});


module.exports = mongoose;