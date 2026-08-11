import { Router } from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth';
import {
  getAdminAnalytics,
  getPendingDonations,
  updateResourceStatus,
  getReports,
  resolveReport,
  getAuditLogs,
} from '../controllers/admin.controller';

const router = Router();

router.use(authenticateUser, authorizeRole(['MODERATOR', 'ADMIN', 'SUPER_ADMIN']));

router.get('/analytics', getAdminAnalytics);
router.get('/resources/pending', getPendingDonations);
router.patch('/resources/:id/status', updateResourceStatus);
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);
router.get('/audit-logs', getAuditLogs);

export default router;
