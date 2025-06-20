const express = require('express');
const { fireReportController } = require('../controllers/fireController');
const upload = require('../middlewares/uploadMiddleware'); // Your Cloudinary/multer setup

const router = express.Router();

router.post('/fire-report', upload.single('image'), fireReportController);

module.exports = router;