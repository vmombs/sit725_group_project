const medicationSchema = new mongoose.Schema({
    date: { type: Date, required: true},
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model('Medication', medicationSchema);