import { Router } from 'express';
import {
  getUniversities,
  getDepartments,
  getCourses,
  getTeachers,
} from '../controllers/taxonomy.controller';

const router = Router();

router.get('/universities', getUniversities);
router.get('/departments', getDepartments);
router.get('/courses', getCourses);
router.get('/teachers', getTeachers);

export default router;
