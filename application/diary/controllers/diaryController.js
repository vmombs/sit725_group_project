const Medication = require('../models/Medication');

const addMedication = (req,res) => {
    let medication = req.body;
    Medication.addMedication(medication, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

module.exports = {
    addMedication
};