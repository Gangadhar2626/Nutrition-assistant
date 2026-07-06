import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Nutrition Assistant API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/progress', progressRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
