const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log('File is Being Uploaded Successfully', response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const handleUnexpectedFields = (allowedFields) => (req, res, next) => {
  const uploadedFields = Object.keys(req.files || {});
  console.log('Uploaded Fields:', uploadedFields);

  const unexpectedFields = uploadedFields.filter(field => !allowedFields.includes(field));

  if (unexpectedFields.length > 0) {
    return res.status(400).json({ error: `Unexpected fields: ${unexpectedFields.join(', ')}` });
  }

  next();
};

const router = express();
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage }).fields([
//   { name: 'Projectlogo', maxCount: 1 },
  { name: 'VideoPitch', maxCount: 1 },
]);

router.use('/uploads', express.static('uploads'));
router.use(express.static(__dirname + '/public'));

router.post('/video', handleUnexpectedFields(['VideoPitch']), upload, async (req, res) => {
    try {
        console.log(req.files);

        console.log('Uploaded VideoPitch:', req.files.VideoPitch);
        const filePath = req.files.VideoPitch[0].path;
        const val = await uploadCloudinary(filePath);
        console.log('Cloudinary Response:', val);
        res.status(201).json(val);
    } catch (error) {
        console.error('Error in /video route:', error);
        res.status(500).json({ error: 'File upload failed.' });
    }
    });

module.exports = router;
