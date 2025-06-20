const mongoose = require('mongoose');

const fireOfficeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // Specify that this is a GeoJSON Point
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create a GeoJSON index for efficient querying
fireOfficeSchema.index({ location: '2dsphere' });

// Use the default mongoose connection (from app.js)
const FireOffice = mongoose.model('FireOffice', fireOfficeSchema);

module.exports = FireOffice;
