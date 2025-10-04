require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');

const app = express();
app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// setup server + socket.io
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user; // { id, role, model }
    socket.join(socket.user.role + 's'); // e.g. students, clerks, wardens
    socket.join('user_' + socket.user.id);
    next();
  } catch (err) {
    next();
  }
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id, socket.user?.role);
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on ' + PORT));
