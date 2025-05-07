const express = require('express');
const router = express.Router();

// Test endpoint that returns CORS headers for debugging
router.get('/cors-test', (req, res) => {
  const response = {
    message: 'CORS test successful',
    headers: {
      received: {
        origin: req.headers.origin || 'No origin header',
        referer: req.headers.referer || 'No referer header',
        host: req.headers.host || 'No host header',
        method: req.method,
        'user-agent': req.headers['user-agent'] || 'No user-agent'
      },
      sent: {
        'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin') || 'Not set',
        'access-control-allow-methods': res.getHeader('Access-Control-Allow-Methods') || 'Not set',
        'access-control-allow-headers': res.getHeader('Access-Control-Allow-Headers') || 'Not set',
        'access-control-allow-credentials': res.getHeader('Access-Control-Allow-Credentials') || 'Not set'
      }
    }
  };
  
  res.json(response);
});

// Return JSON data with the current request information
router.get('/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    timestamp: new Date().toISOString()
  });
});

// Handle any method to test CORS preflight
router.all('/preflight-test', (req, res) => {
  res.json({
    success: true,
    method: req.method,
    headers: req.headers,
    body: req.body,
    message: 'If you see this, CORS preflight is working correctly'
  });
});

module.exports = router; 