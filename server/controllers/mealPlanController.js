import mongoose from 'mongoose';
import MealPlan from '../models/MealPlan.js';
import User from '../models/User.js';

export const getMealPlans = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'dietitian') {
      filter = { dietitian: req.user._id };
    } else if (req.user.role === 'user') {
      filter = { assignedTo: req.user._id };
    }

    const mealPlans = await MealPlan.find(filter)
      .populate('assignedTo', 'name email')
      .populate('dietitian', 'name email')
      .sort({ createdAt: -1 });

    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMealPlan = async (req, res) => {
  try {
    const { title, description, breakfast, lunch, dinner, snacks, calories, protein, carbs, fat } =
      req.body;

    if (!title || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ message: 'Please provide title and all macro values' });
    }

    const mealPlan = await MealPlan.create({
      title,
      description,
      breakfast,
      lunch,
      dinner,
      snacks,
      calories,
      protein,
      carbs,
      fat,
      dietitian: req.user._id,
    });

    const populated = await MealPlan.findById(mealPlan._id)
      .populate('assignedTo', 'name email')
      .populate('dietitian', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid meal plan ID' });
    }

    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.dietitian.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this meal plan' });
    }

    const fields = ['title', 'description', 'breakfast', 'lunch', 'dinner', 'snacks', 'calories', 'protein', 'carbs', 'fat'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        mealPlan[field] = req.body[field];
      }
    });

    const updated = await mealPlan.save();
    const populated = await MealPlan.findById(updated._id)
      .populate('assignedTo', 'name email')
      .populate('dietitian', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMealPlan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid meal plan ID' });
    }

    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.dietitian.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this meal plan' });
    }

    await mealPlan.deleteOne();
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignMealPlan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid meal plan ID' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId to assign' });
    }

    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (mealPlan.dietitian.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to assign this meal plan' });
    }

    const client = await User.findById(userId);
    if (!client || client.role !== 'user') {
      return res.status(400).json({ message: 'Invalid client user' });
    }

    mealPlan.assignedTo = userId;
    const updated = await mealPlan.save();

    const populated = await MealPlan.findById(updated._id)
      .populate('assignedTo', 'name email')
      .populate('dietitian', 'name email');

    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
