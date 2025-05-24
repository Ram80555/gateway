const Payment = require('../models/Payment');
const Settings = require('../models/Settings');

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({}).sort({createdAt: -1});
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId, status } = req.body;
        if(!paymentId || !status) return res.status(400).json({message: 'paymentId and status are required'});
        if(!['approved', 'rejected'].includes(status)) return res.status(400).json({message: 'Invalid status'});

        const payment = await Payment.findById(paymentId);
        if(!payment) return res.status(404).json({message: 'Payment not found'});

        payment.status = status;
        await payment.save();

        res.json({message: 'Status updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.updateBankDetails = async (req, res) => {
    try {
        const { upiId, payeeName, bankName, qrCodeUrl } = req.body;

        let settings = await Settings.findOne({});
        if(!settings) {
            settings = new Settings({ upiId, payeeName, bankName, qrCodeUrl });
        } else {
            settings.upiId = upiId;
            settings.payeeName = payeeName;
            settings.bankName = bankName;
            settings.qrCodeUrl = qrCodeUrl;
        }
        await settings.save();

        res.json({message: 'Bank details updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getBankDetails = async (req, res) => {
    try {
        const settings = await Settings.findOne({});
        res.json(settings || {});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
