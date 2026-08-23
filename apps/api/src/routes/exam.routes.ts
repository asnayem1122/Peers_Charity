import { Router } from 'express';
import { getExamEmergencyData } from '../controllers/exam.controller';

const router = Router();

router.get('/:courseId', getExamEmergencyData);

export default router;
