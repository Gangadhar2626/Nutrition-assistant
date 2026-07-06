import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  assignMealPlan,
} from '../controllers/mealPlanController.js';

const router = express.Router();

router.get('/', protect, getMealPlans);
router.post('/', protect, authorize('dietitian'), createMealPlan);
router.put('/:id', protect, authorize('dietitian'), updateMealPlan);
router.delete('/:id', protect, authorize('dietitian'), deleteMealPlan);
router.put('/:id/assign', protect, authorize('dietitian'), assignMealPlan);

export default router;
