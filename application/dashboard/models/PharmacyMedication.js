const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: true,
    unique: true, // Ensure medication names are unique
    trim: true, // Remove leading/trailing whitespace
    lowercase: true, // Store names in lowercase for consistency
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,       // Price cannot be negative
  },
  // FUTURE TO DO: add other fields (e.g. description, manufacturer, available quantity etc.). 
});

const PharmacyMedication = mongoose.model('PharmacyMedication', medicationSchema, 'pharmacy_medications');

module.exports = PharmacyMedication;