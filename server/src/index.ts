import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload';
import resultRoutes from './routes/results';
import authRoutes from './routes/auth';
import configRoutes from './routes/config';
import { verifyToken, isAdmin } from './middleware/auth';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Placeholder for Mongo URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/markentry';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', verifyToken, isAdmin, uploadRoutes); // Only admin can upload
app.use('/api/results', verifyToken, resultRoutes); // Auth required (Admin or Student)
app.use('/api/config', verifyToken, configRoutes); // Auth required (Read: All, Write: Admin - validation inside route if needed, or separate middleware)

app.get('/', (req, res) => {
  res.send('Mark Entry API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
