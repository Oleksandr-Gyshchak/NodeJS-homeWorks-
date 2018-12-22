const saveImg = function (req, res, next) {
    if (req.files) {
        let pictureName = Date.now();
        let pictureItem = req.files.picture;
        let filePath = '/images/' + pictureName + '.jpeg';
        pictureItem.mv(__dirname + '/../public' + filePath, function (err) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                req.filePath = filePath;
                next();
            }
        });

    } else {
        let imgUrl = req.body['picture'];
        req.filePath = imgUrl;
        next();
    }

};

module.exports = {
    saveImg
};