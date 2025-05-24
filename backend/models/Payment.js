const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    name: String,
    note: String,
    qrCode: String,
    status: {type: String, default: 'pending'}, // pending, proof_uploaded, approved, rejected
    proofImage: String,
    utr: String,
    createdAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
