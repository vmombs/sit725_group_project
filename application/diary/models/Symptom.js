const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    email: { type: String, required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    severity: { type: String, required: true},
});

symptomSchema.statics.addRecord = async function (record) {
    try {
        const symptom = new this(record);
        return await symptom.save();
    } catch (error) {
        console.error('Error adding symptom record:', error);
        throw error;
    }
};

module.exports = mongoose.model('Symptom', symptomSchema);