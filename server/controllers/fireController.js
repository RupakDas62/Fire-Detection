const { findNearestOffice } = require('./Helpers/geoService');
const { sendNotification } = require('./Helpers/notificationService');

/**
 * Controller to handle fire report submissions
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fireReportController = async (req, res) => {
  const { description } = req.body;
  const location = JSON.parse(req.body.location); // Parse GeoJSON location
  const image = req.file ? req.file.path : null; // Get image path

  if (!location) {
    return res.status(400).json({ success: false, message: 'Location is required.' });
  }

  try {
    // console.log("Req reached, ", location);
    const nearestOffice = await findNearestOffice(location);
    console.log(nearestOffice);
    if (!nearestOffice) {
      return res.status(404).json({ success: false, message: 'No nearby office found for this location.' });
    }

    const message = `Fire reported at ${description}. Please respond ${nearestOffice.name}.`;
    console.log(message);

    await sendNotification(nearestOffice, message);

    // Respond with success message and image URL
    return res.status(200).json({
      success: true,
      message: 'Fire report sent.',
      imageUrl: image, // Cloudinary URL or null if no image uploaded
    });
  } catch (error) {
    console.error('Error processing fire report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing fire report.',
      error: error.message,
    });
  }
};

module.exports = {
  fireReportController,
};
