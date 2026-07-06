import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserStats,
  deleteUser,
  approveDietitian,
  updateUserRole,
  getAssignedClients,
  getAvailableClients,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/stats', protect, authorize('admin'), getUserStats);
router.get('/clients', protect, authorize('dietitian'), getAssignedClients);
router.get('/available-clients', protect, authorize('dietitian'), getAvailableClients);
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/approve', protect, authorize('admin'), approveDietitian);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
