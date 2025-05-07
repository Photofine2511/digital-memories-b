const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const albumRoutes = require('./routes/albumRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS based on environment
const corsOptions = {
  origin: config.nodeEnv === 'production' 
    ? process.env.FRONTEND_URL || '*' // In production, restrict to your frontend URL
    : '*', // In development, allow all origins
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/albums', albumRoutes);
app.use('/api/upload', uploadRoutes);

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

module.exports = app; 