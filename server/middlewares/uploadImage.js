const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const fileType = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}${Date.now()}.${fileType}`);
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype !== "image/png" &&
        file.mimetype !== "image/jpg"&&
        file.mimetype !== "image/jpeg"){
        req.body.error = new Error('File must has file type jpg, jpeg or png');
        cb(null, false);
        return;
    }
    cb(null, true)
};


let upload = multer(
    { storage: storage,
            fileFilter: fileFilter,
            limits: { fileSize: 100000}})
    .single('file');

module.exports = upload;