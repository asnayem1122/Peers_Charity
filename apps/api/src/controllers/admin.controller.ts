import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Resource } from '../models/Resource';
import { Report } from '../models/Report';
import { UserProfile } from '../models/UserProfile';
import { AuditLog } from '../models/AuditLog';

export const getAdminAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [totalUsers, totalResources, pendingResources, totalReports, totalDownloads] = await Promise.all([
      UserProfile.countDocuments(),
      Resource.countDocuments({ status: 'PUBLISHED' }),
      Resource.countDocuments({ status: 'PENDING' }),
      Report.countDocuments({ status: 'PENDING' }),
      Resource.aggregate([{ $group: { _id: null, total: { $sum: '$stats.downloadsCount' } } }]),
    ]);

    const downloadsSum = totalDownloads[0]?.total || 0;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalUsers,
        totalResources,
        pendingResources,
        pendingReports: totalReports,
        totalDownloads: downloadsSum,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingDonations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pending = await Resource.find({ status: 'PENDING' })
      .populate('courseId', 'title code')
      .populate('universityId', 'name code')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: pending });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResourceStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const resource = await Resource.findByIdAndUpdate(id, { status }, { new: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    await AuditLog.create({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: `RESOURCE_${status}`,
      targetType: 'Resource',
      targetId: id,
      metadata: { title: resource.title, reason },
    });

    return res.status(200).json({ success: true, message: `Resource status updated to ${status}`, data: resource });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReports = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('resourceId', 'title resourceType fileUrl uploaderId')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: reports });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, actionTake } = req.body;

    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (actionTake === 'REMOVE_RESOURCE') {
      await Resource.findByIdAndUpdate(report.resourceId, { status: 'REMOVED' });
    }

    await AuditLog.create({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: `REPORT_${status}`,
      targetType: 'Report',
      targetId: id,
      metadata: { actionTake },
    });

    return res.status(200).json({ success: true, message: `Report ${status.toLowerCase()}`, data: report });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
