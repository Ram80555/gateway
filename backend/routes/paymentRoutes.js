const express = require('express');
const router = express.Router();
const { initiatePayment, uploadProof, getPaymentStatus } = require('../controllers/paymentController');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage});

// Initiate payment
router.post('/initiate', initiatePayment);

// Upload proof
router.post('/upload-proof', upload.single('proof'), uploadProof);

// Get payment status
router.get('/status/:paymentId', getPaymentStatus);

module.exports = router;
