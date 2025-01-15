const Medication = require('../../../diary/models/Medication');
const Symptom = require('../../../diary/models/Symptom');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Method to delete user account
userSchema.methods.deleteAccount = async function () {
    try {
      const userEmail = this.email; 
  
      // Delete user data from dependent models (in this case it's just symptoms, medications)
      await Symptom.deleteByEmail(userEmail); 
      await Medication.deleteByEmail(userEmail); 
  
      // Delete user data from the User collection
      await this.model('User').deleteOne({ _id: this._id });
  
      return { message: 'Account deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete account');
    }
  };

module.exports = mongoose.model("User", userSchema);
