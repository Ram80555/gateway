require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const auth = require('./authMiddleware');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve widget as customer frontend
app.use(express.static(path.join(__dirname, '../widget')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../widget/index.html'));
});

// Protect admin panel with auth middleware
app.get('/admin', auth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', auth, adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});