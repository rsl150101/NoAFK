const multer = require('multer');
const path = require('path');
const fs = require('fs');

const profileImage = '/../static/images/profileImage'
const uploadPath = 'profileImage/'

fs.readdirSync(profileImage);

const uploadImage = multer({
  storage: multer.diskStorage({
    // 경로 설정
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    // 파일 이름 변환
    filename: (req, file, cb) => {
      const base = path.basename(file.originalname);
      const ext =  path.extname(file.originalname);
      cb(null, base + new Date().valueOf() + ext);
    },
  }),
  // 이미지 업로드 용량 5MB 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadImage;