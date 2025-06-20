const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage object for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Innovation Project', // Change folder name to your preferred folder
    allowedFormats: ['jpg', 'png', 'jpeg'], // Accepted image formats
  },
});

// Create an upload middleware using multer
const upload = multer({ storage });

module.exports = upload;
