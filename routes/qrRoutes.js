
const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

router.get('/generate-qr', async (req, res) => {
    const { upi, amount } = req.query;
    if (!upi || !amount) {
        return res.status(400).json({ error: 'UPI ID and amount are required' });
    }

    const upiString = `upi://pay?pa=${upi}&pn=Merchant&am=${amount}&cu=INR`;
    try {
        const qrDataUrl = await QRCode.toDataURL(upiString);
        res.json({ qr: qrDataUrl });
    } catch (err) {
        res.status(500).json({ error: 'QR generation failed' });
    }
});

module.exports = router;
