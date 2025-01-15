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

// [VM} Added method to delete records by email
symptomSchema.statics.deleteByEmail = async function (email) {
    try {
      const deletedCount = await this.deleteMany({ email });
      return { deletedCount: deletedCount.deletedCount }; // This returns the number of documents deleted
    } catch (error) {
      console.error('Error deleting symptom records:', error);
      throw error;
    }
  };
symptomSchema.statics.getRecords = async function (email) {
    try {
        return await this.find({ email });
    } catch (error) {
        console.error('Error getting symptom records:', error);
        throw error;
    }
}

symptomSchema.statics.deleteById = async function (id) {
    try {
        return await this.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting symptom record:', error);
        throw error;
    }
}

module.exports = mongoose.model('Symptom', symptomSchema);