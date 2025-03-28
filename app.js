const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration for HTTPS
app.use(cors({
  origin: [
    'https://localhost:3000', // For React frontend
    'https://localhost:5000' // For API testing
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: "Social Media API (HTTPS)",
    status: "secure",
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      users: "/api/users"
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;