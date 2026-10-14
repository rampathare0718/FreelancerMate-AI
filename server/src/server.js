import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'FreelancerMate AI API is running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 FreelancerMate AI Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Base URL: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Free the port or run: npx kill-port ${PORT}`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

