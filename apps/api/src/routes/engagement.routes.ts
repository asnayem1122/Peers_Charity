import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import {
  addRating,
  addReview,
  getReviews,
  toggleBookmark,
  recordDownload,
  submitReport,
} from '../controllers/engagement.controller';

const router = Router();

router.post('/:resourceId/rating', authenticateUser, addRating);
router.post('/:resourceId/reviews', authenticateUser, addReview);
router.get('/:resourceId/reviews', getReviews);
router.post('/:resourceId/bookmark', authenticateUser, toggleBookmark);
router.post('/:resourceId/download', recordDownload);
router.post('/:resourceId/report', authenticateUser, submitReport);

export default router;
