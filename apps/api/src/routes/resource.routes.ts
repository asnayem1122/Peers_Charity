import { Router } from 'express';
import multer from 'multer';
import { authenticateUser } from '../middleware/auth';
import {
  checkDuplicate,
  createResource,
  getResources,
  getResourceById,
} from '../controllers/resource.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = Router();

router.get('/', getResources);
router.post('/check-duplicate', checkDuplicate);
router.post('/', authenticateUser, upload.single('file'), createResource);
router.get('/:id', getResourceById);

export default router;
