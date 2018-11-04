var jsonFile = require("../data/list.json")


var getList = function () {
    return jsonFile;
};
var getListItemById = function (id) {
    return jsonFile.find((item) => {
        return item.id === id;
    });
};



module.exports = {
    getList,
    getListItemById
};