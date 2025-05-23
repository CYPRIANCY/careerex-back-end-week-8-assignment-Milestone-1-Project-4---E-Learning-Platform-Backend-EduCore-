
// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import courseRoutes from './routes/courseRoutes.js';
// import enrollmentRoutes from './routes/enrollmentRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
// import certificateRoutes from './routes/certificateRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/enrollments', enrollmentRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/certificates', certificateRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/admin', adminRoutes);

// app.get('/', (req, res) => res.send('EduCore API running'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('EduCore API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
