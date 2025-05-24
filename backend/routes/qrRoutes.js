const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/menu-display/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/payment.html'));
});

module.exports = router;