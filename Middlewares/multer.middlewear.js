const multer = require("multer");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generating unique file name
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB (optional)
  },
}).fields([
//   { name: 'Projectlogo', maxCount: 1 }, // For uploading a project logo
  { name: 'VideoPitch', maxCount: 1 },  // For uploading a video pitch
]);

// Middleware to check for unexpected fields
const handleUpload = (req, res, next) => {
  const allowedFields = ['VideoPitch'];  // ['VideoPitch','Projectlogo']
  const uploadedFields = Object.keys(req.files || {});
  
  // Check if any field in the request is unexpected
  const unexpectedFields = uploadedFields.filter(field => !allowedFields.includes(field));
  
  if (unexpectedFields.length > 0) {
    return res.status(400).json({ error: `Unexpected fields: ${unexpectedFields.join(', ')}` });
  }
  
  next(); // Proceed if no unexpected fields
};

module.exports = { upload, handleUpload };
