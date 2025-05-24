const Payment = require('../models/Payment');
const QRCode = require('qrcode');

exports.initiatePayment = async (req, res) => {
    try {
        const { amount, name, note } = req.body;
        if(!amount) return res.status(400).json({message: 'Amount is required'});

        // Get bank/UPI info from settings
        const Settings = require('../models/Settings');
        const settings = await Settings.findOne({});
        if(!settings) return res.status(500).json({message: 'Payment settings not configured'});

        const upiId = settings.upiId;
        const payeeName = settings.payeeName || 'Payee';

        // Generate UPI string
        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note || '')}`;

        // Generate QR code data URL
        const qrCodeUrl = await QRCode.toDataURL(upiString);

        // Save payment with status pending
        const payment = new Payment({
            amount,
            name,
            note,
            qrCode: qrCodeUrl,
            status: 'pending',
            createdAt: new Date()
        });
        await payment.save();

        res.json({paymentId: payment._id, qrCodeUrl});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.uploadProof = async (req, res) => {
    try {
        const { paymentId, utr } = req.body;
        const file = req.file;

        if(!paymentId) return res.status(400).json({message: 'Payment ID is required'});
        if(!file) return res.status(400).json({message: 'Payment proof file is required'});

        const payment = await Payment.findById(paymentId);
        if(!payment) return res.status(404).json({message: 'Payment not found'});

        payment.proofImage = file.filename;
        payment.utr = utr || '';
        payment.status = 'proof_uploaded';
        await payment.save();

        res.json({message: 'Proof uploaded successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if(!payment) return res.status(404).json({message: 'Payment not found'});
        res.json({status: payment.status});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
