require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDB, sequelize } = require('./config/db');
require('./models');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const rideRoutes = require('./routes/ride.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const messageRoutes = require('./routes/message.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API healthy', data: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('auth:join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    // no-op
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
