const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

medicationSchema.statics.addRecord = async function (record) {
    try {
        const medication = new this(record);
        return await medication.save();
    } catch (error) {
        console.error('Error adding medication record:', error);
        throw error;
    }
};

module.exports = mongoose.model('Medication', medicationSchema);