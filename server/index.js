const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Simple Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Broad CORS support for dev
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(helmet());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('B2B Barter API Running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const tradeRoutes = require('./routes/trades');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/trades', tradeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
