import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getProgress,
  createProgress,
  updateProgress,
  deleteProgress,
} from '../controllers/progressController.js';

const router = express.Router();

router.get('/', protect, getProgress);
router.post('/', protect, authorize('user'), createProgress);
router.put('/:id', protect, authorize('user'), updateProgress);
router.delete('/:id', protect, authorize('user'), deleteProgress);

export default router;
