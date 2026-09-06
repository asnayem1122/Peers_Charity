import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Resource } from '../models/Resource.js';
import { Course } from '../models/Course.js';

export const getSessionalData = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const courseQuery = mongoose.isValidObjectId(courseId)
      ? { $or: [{ _id: courseId }, { code: courseId.toUpperCase().replace('-', ' ') }] }
      : { code: courseId.toUpperCase().replace('-', ' ') };

    const course = await Course.findOne(courseQuery).populate('departmentId', 'name code');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const resources = await Resource.find({
      courseId: course._id,
      status: 'PUBLISHED',
      'academicMetadata.section': 'sessional',
    }).sort({ 'academicMetadata.batch': 1, 'academicMetadata.labNumber': 1, qualityScore: -1 });

    // Group by batch
    const batchMap: Record<string, typeof resources> = {};
    resources.forEach((r) => {
      const batch = r.academicMetadata?.batch || 'General';
      if (!batchMap[batch]) batchMap[batch] = [];
      batchMap[batch].push(r);
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Sessional data loaded.',
      data: {
        course,
        stats: {
          totalSessionalResources: resources.length,
          batchCount: Object.keys(batchMap).length,
        },
        batches: batchMap,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
