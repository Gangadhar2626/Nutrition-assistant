import User from '../models/User.js';
import MealPlan from '../models/MealPlan.js';

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;

    if (req.body.email) {
      const emailExists = await User.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = req.body.email.toLowerCase();
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDietitians = await User.countDocuments({ role: 'dietitian' });
    const totalMealPlans = await MealPlan.countDocuments();

    res.json({ totalUsers, totalDietitians, totalMealPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveDietitian = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'dietitian') {
      return res.status(400).json({ message: 'User is not a dietitian' });
    }

    user.isApproved = true;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'dietitian', 'user'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    if (role === 'dietitian') {
      user.isApproved = false;
    } else {
      user.isApproved = true;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssignedClients = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({
      dietitian: req.user._id,
      assignedTo: { $ne: null },
    }).populate('assignedTo', 'name email');

    const clientsMap = new Map();
    mealPlans.forEach((plan) => {
      if (plan.assignedTo) {
        clientsMap.set(plan.assignedTo._id.toString(), plan.assignedTo);
      }
    });

    res.json(Array.from(clientsMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableClients = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name email role').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
