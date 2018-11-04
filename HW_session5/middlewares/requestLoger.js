var fs = require("fs");

const requestLoger = (req, res, next) => {
    var now = new Date();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var data = `${hour}:${minutes}:${seconds} ${req.method} ${req.url} ${req.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function () {});
    next();
}

module.exports = {
    requestLoger
};