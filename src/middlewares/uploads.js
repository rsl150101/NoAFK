const multer = require('multer');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

require('dotenv').config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-2',
});

const uploads = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    key(req, file, cb) {
      const base = path.basename(file.originalname);
      const ext =  path.extname(file.originalname);
      cb(null, 'profile/' + base + new Date().valueOf() + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('.png, .jpg, .jpeg 파일만 업로드 가능합니다.'));
    }
  },
  // 이미지 업로드 용량 2MB 제한
  limits: { fileSize: 2 * 1024 * 1024 },
})

const uploadProjectImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    key(req, file, cb) {
      const base = path.basename(file.originalname);
      const ext =  path.extname(file.originalname);
      cb(null, 'project/' + base + new Date().valueOf() + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('.png, .jpg, .jpeg 파일만 업로드 가능합니다.'));
    }
  },
  // 이미지 업로드 용량 2MB 제한
  limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = { uploads, uploadProjectImage };