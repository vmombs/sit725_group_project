const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    email: { type: String, required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    severity: { type: String, required: true},
});

module.exports = mongoose.model('Symptom', symptomSchema);