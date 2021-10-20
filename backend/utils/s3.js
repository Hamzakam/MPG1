const S3 = require("aws-sdk/clients/s3");
const {
    AWS_BUCKET_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET_NAME,
} = require("./config");
const fs = require("fs");
const s3 = new S3({
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});
const multer = require("multer");

//uploads the file to S3 bucket

const uploadToS3 = (file) => {
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: fs.createReadStream(file.path),
        Key: `${file.fieldname}/${file.filename}`,
    };
    return s3.upload(uploadParams).promise();
};

const uploadGeneric = (destination)=>{
    const upload = multer({
        dest: `uploads/${destination}/`,
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (
                file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg"
            ) {
                callback(null, true);
            } else {
                callback(null, false);
                return callback({
                    name: "MulterError",
                    message: "Only .png, .jpg and .jpeg format allowed!",
                });
            }
        },
    });
    return upload;
};

module.exports = { uploadToS3,uploadGeneric };
