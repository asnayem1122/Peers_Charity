import { Router } from 'express';
import multer from 'multer';
import { authenticateUser } from '../middleware/auth';
import { validateResourceCreation, validateResourceQuery } from '../middleware/validate';
import {
  checkDuplicate,
  createResource,
  getResources,
  getResourceById,
} from '../controllers/resource.controller';

import path from 'path';

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.doc',
  '.pptx',
  '.ppt',
  '.zip',
  '.png',
  '.jpg',
  '.jpeg',
  '.txt',
  '.c',
  '.cpp',
  '.py',
  '.java',
  '.h',
  '.js',
  '.ts',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`Forbidden file extension: "${ext}".`));
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/', validateResourceQuery, getResources);
router.post('/check-duplicate', checkDuplicate);
router.post(
  '/',
  authenticateUser,
  upload.single('file'),
  validateResourceCreation,
  createResource
);
router.get('/:id', getResourceById);

export default router;
