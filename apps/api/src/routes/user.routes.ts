import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { getMyProfile, updateMyProfile, getPublicProfile } from '../controllers/user.controller';

const router = Router();

router.get('/me', authenticateUser, getMyProfile);
router.patch('/me', authenticateUser, updateMyProfile);
router.get('/:id/profile', getPublicProfile);

export default router;
