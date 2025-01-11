const Medication = require('../models/Medication');
const Symptom = require('../models/Symptom');

const addMedication = (req,res) => {
    let medication = req.body;
    Medication.addMedication(medication, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

const addSymptom = (req,res) => {
    let symptom = req.body;
    Symptom.addSymptom(symptom, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

module.exports = {
    addMedication, addSymptom
};