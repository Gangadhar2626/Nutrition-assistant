import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  breakfast: { type: String, trim: true, default: '' },
  lunch: { type: String, trim: true, default: '' },
  dinner: { type: String, trim: true, default: '' },
  snacks: { type: String, trim: true, default: '' },
  calories: { type: Number, required: [true, 'Calories is required'], min: 0 },
  protein: { type: Number, required: [true, 'Protein is required'], min: 0 },
  carbs: { type: Number, required: [true, 'Carbs is required'], min: 0 },
  fat: { type: Number, required: [true, 'Fat is required'], min: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dietitian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;
