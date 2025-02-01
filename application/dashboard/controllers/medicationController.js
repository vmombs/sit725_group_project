const PharmacyMedication = require('../models/PharmacyMedication');
const socketManager = require('../../../socketManager');

const medicationController = {
  getAllMedications: async (req, res) => {
    try {
      const medications = await PharmacyMedication.find();
      res.json(medications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getMedicationById: async (req, res) => {
    try {
      const medication = await PharmacyMedication.findById(req.params.id);
      if (!medication) {
        return res.status(404).json({ message: 'Medication not found' });
      }
      res.json(medication);
    } catch (error) {
      console.error(error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Medication not found' });
      }
      res.status(500).json({ message: 'Server Error' });
    }
  },

  updateMedicationPrice: async (req, res) => {
    const { medicationName, price } = req.body;

    try {
      const updatedMedication = await PharmacyMedication.findOneAndUpdate(
        { medicationName: medicationName },
        { price: price }, 
        { new: true, runValidators: true }
      );

      if (!updatedMedication) {
        return res.status(404).json({ message: 'Medication not found' });
      }

      const io = socketManager.getIO();
      io.emit('priceUpdate', { medicationName, price }); // Notify clients

      res.json(updatedMedication); // Send the updated medication data back
    } catch (error) {
      console.error("Error updating medication price:", error);
      res.status(500).json({ message: 'Error updating price' });
    }
  },
};

module.exports = medicationController;