const mongoose = require("mongoose");

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
    console.error("Error adding medication record:", error);
    throw error;
  }
};

// [VM} Added method to delete records by email
medicationSchema.statics.deleteByEmail = async function (email) {
  try {
    const deletedCount = await this.deleteMany({ email });
    return { deletedCount: deletedCount.deletedCount }; // This returns the number of documents deleted
  } catch (error) {
    console.error("Error deleting symptom records:", error);
    throw error;
  }
};

medicationSchema.statics.getRecords = async function (email) {
    try {
        return await this.find({ email });
    } catch (error) {
        console.error('Error getting medication records:', error);
        throw error;
    }
};

medicationSchema.statics.deleteById = async function (id) {
    try {
        return await this.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting medication record:', error);
        throw error;
    }
}

module.exports = mongoose.model("Medication", medicationSchema);
