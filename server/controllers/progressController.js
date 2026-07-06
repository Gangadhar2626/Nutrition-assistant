import mongoose from 'mongoose';
import Progress from '../models/Progress.js';
import MealPlan from '../models/MealPlan.js';

export const getProgress = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'user') {
      filter = { user: req.user._id };
    } else if (req.user.role === 'dietitian') {
      const assignedPlans = await MealPlan.find({
        dietitian: req.user._id,
        assignedTo: { $ne: null },
      }).select('assignedTo');

      const clientIds = assignedPlans.map((p) => p.assignedTo);
      filter = { user: { $in: clientIds } };
    }

    const progress = await Progress.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgress = async (req, res) => {
  try {
    const { weight, caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed, date } = req.body;

    if (weight === undefined || !date) {
      return res.status(400).json({ message: 'Please provide weight and date' });
    }

    const progressDate = new Date(date);
    progressDate.setHours(0, 0, 0, 0);

    const existing = await Progress.findOne({
      user: req.user._id,
      date: progressDate,
    });

    if (existing) {
      return res.status(400).json({
        message: 'Progress already exists for this date. Use update instead.',
      });
    }

    const progress = await Progress.create({
      user: req.user._id,
      weight,
      caloriesConsumed: caloriesConsumed || 0,
      proteinConsumed: proteinConsumed || 0,
      carbsConsumed: carbsConsumed || 0,
      fatConsumed: fatConsumed || 0,
      date: progressDate,
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid progress ID' });
    }

    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this progress' });
    }

    const fields = ['weight', 'caloriesConsumed', 'proteinConsumed', 'carbsConsumed', 'fatConsumed', 'date'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'date') {
          const d = new Date(req.body.date);
          d.setHours(0, 0, 0, 0);
          progress.date = d;
        } else {
          progress[field] = req.body[field];
        }
      }
    });

    const updated = await progress.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid progress ID' });
    }

    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this progress' });
    }

    await progress.deleteOne();
    res.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
