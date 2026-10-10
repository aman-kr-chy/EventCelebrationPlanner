import app from './app.js';
import connectDB from './config/db.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { autoSeed } from './utils/autoSeed.js';

dotenv.config();

// Connect to database and seed if empty
connectDB().then(() => {
  autoSeed();
});

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === 'http://localhost:5173') return callback(null, true);
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      callback(new Error('Socket CORS error'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Custom events will be handled here
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible globally if needed, e.g., in controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
