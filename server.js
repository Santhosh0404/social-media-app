require('dotenv').config();
const https = require('https');
const fs = require('fs');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Enhanced SSL configuration
const sslOptions = {
  key: fs.readFileSync('./cert.key'),
  cert: fs.readFileSync('./cert.crt'),
  minVersion: 'TLSv1.2',
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256'
  ].join(':'),
  honorCipherOrder: true
};

// Database connection
connectDB();

// HTTPS Server
const server = https.createServer(sslOptions, app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
   Server running in ${process.env.NODE_ENV || 'development'} mode
   HTTPS: https://localhost:${PORT}
   Network: https://${getIPAddress()}:${PORT}
  `);
});

// Get local IP address for network access
function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}