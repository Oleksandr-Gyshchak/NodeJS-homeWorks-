var jsonFile = require("../data/db")
var fs = require("fs");
var path = require('path');

var getUserFrofileByid = function () {
    return jsonFile;

    /*
    fs.readFile(path.join(__dirname, "../data/db.json"), "utf8",
        function (error, data) {

            if (error) throw error;
            return data;
        });
    */

};




module.exports = {
    getUserFrofileByid
};