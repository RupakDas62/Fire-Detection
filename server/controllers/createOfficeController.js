const FireOffice = require('../models/fireOfficeSchema') 
 const createOffice = async(req, res) => {
    const { name, email, location, contactNumber, address } = req.body;
  
    if (!name || !location || !contactNumber || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    try {
      const office = new FireOffice({
        name,
        email,
        location,
        contactNumber,
        address,
      });
  
      await office.save();
      console.log("Fireoffice created successfully", office);
      res.status(201).json({
        success: true,
        message: 'Fire office created successfully!',
        office,
      });
    } catch (error) {
      console.error('Error creating fire office:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating fire office.',
        error: error.message,
      });
    }
  };

  module.exports = createOffice;