const express = require('express');
const FireOffice = require('../models/fireOfficeSchema'); // Adjust the path as necessary
const createOffice = require('../controllers/createOfficeController');

const router = express.Router();

// Create Office Route
router.post('/create', createOffice);

module.exports = router;
