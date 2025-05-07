const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const albumRoutes = require('./routes/albumRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const testRoutes = require('./routes/testRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Debug configuration
console.log('Node Environment:', config.nodeEnv);
console.log('Frontend URL:', config.frontendUrl);

// CORS preflight options handling
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  // Allow the Vercel app origin
  if (origin === 'https://digital-memories.vercel.app') {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
  } else {
    res.status(200).end();
  }
});

// Configure permissive CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // In production, only allow the Vercel app origin
  if (config.nodeEnv === 'production') {
    if (origin === 'https://digital-memories.vercel.app') {
      res.header('Access-Control-Allow-Origin', origin);
    }
  } else {
    // In development, allow all origins
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  // Simple logging in production
  app.use(morgan('combined'));
}

// Redirects for missing /api prefix
app.use('/albums', (req, res) => {
  console.log(`Redirecting ${req.method} ${req.originalUrl} to /api/albums`);
  res.redirect(307, `/api/albums${req.path === '/' ? '' : req.path}`);
});

app.use('/upload', (req, res) => {
  console.log(`Redirecting ${req.method} ${req.originalUrl} to /api/upload`);
  res.redirect(307, `/api/upload${req.path === '/' ? '' : req.path}`);
});

// API Routes
app.use('/api/albums', albumRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testRoutes);

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    env: config.nodeEnv,
    cors: {
      frontend: config.frontendUrl || 'Not set'
    }
  });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  console.log(`CORS origin in production: ${config.frontendUrl || 'https://digital-memories.vercel.app'}`);
});

module.exports = app; 