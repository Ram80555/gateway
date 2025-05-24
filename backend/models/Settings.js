const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    upiId: String,
    payeeName: String,
    bankName: String,
    qrCodeUrl: String,
});

module.exports = mongoose.model('Settings', settingsSchema);
