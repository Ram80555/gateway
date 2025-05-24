const express = require('express');
const router = express.Router();
const basicAuth = require('../authMiddleware');
router.use(basicAuth);
const { getPayments, updatePaymentStatus, updateBankDetails, getBankDetails } = require('../controllers/adminController');

// Get payments (with optional filters)
router.get('/payments', getPayments);

// Update payment status (approve/reject)
router.post('/update-status', updatePaymentStatus);

// Update bank/UPI details
router.post('/bank-details', updateBankDetails);

// Get bank details
router.get('/bank-details', getBankDetails);

module.exports = router;
