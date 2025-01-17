const Medication = require('../models/Medication');
const Symptom = require('../models/Symptom');

const addMedication = async (req, res) => {
    if (!req.user || !req.user.email) {
        // Handle case where user is not authenticated or email is missing
        return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }
    try {
        const record = {
            email: req.user.email,
            date: req.body.date,
            name: req.body.name,
            quantity: req.body.quantity,
        };
        const savedRecord = await Medication.addRecord(record);
        console.log('Record added:', savedRecord);
        res.json({ statusCode: 201, data: record, message: 'success' });
    } catch (error) {
        console.error('Failed to add medication:', error);
    }
}

const addSymptom = async (req, res) => {
    if (!req.user || !req.user.email) {
        // Handle case where user is not authenticated or email is missing
        return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }
    try {
        const record = {
            email: req.user.email,
            date: req.body.date,
            name: req.body.name,
            severity: req.body.severity,
        };
        const savedRecord = await Symptom.addRecord(record);
        console.log('Record added:', savedRecord);
        res.json({ statusCode: 201, data: record, message: 'success' });
    } catch (error) {
        console.error('Failed to add symptom:', error);
    }
}

module.exports = {
    addMedication, addSymptom
};