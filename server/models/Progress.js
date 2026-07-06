import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: [true, 'Weight is required'], min: 0 },
  caloriesConsumed: { type: Number, required: true, min: 0, default: 0 },
  proteinConsumed: { type: Number, required: true, min: 0, default: 0 },
  carbsConsumed: { type: Number, required: true, min: 0, default: 0 },
  fatConsumed: { type: Number, required: true, min: 0, default: 0 },
  date: { type: Date, required: [true, 'Date is required'] },
});

progressSchema.index({ user: 1, date: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
