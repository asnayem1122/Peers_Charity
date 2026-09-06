import { Router } from 'express';
import { getSessionalData } from '../controllers/sessional.controller';

const router = Router();

router.get('/:courseId', getSessionalData);

export default router;
