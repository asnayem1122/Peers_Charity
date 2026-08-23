import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Resource } from '../models/Resource';
import { UserProfile } from '../models/UserProfile';
import { storageService, StorageService } from '../services/StorageService';
import { QualityScoreService } from '../services/QualityScoreService';

export const checkDuplicate = async (req: Request, res: Response) => {
  try {
    const { fileHash } = req.body;
    if (!fileHash) {
      return res.status(400).json({ success: false, message: 'fileHash is required' });
    }

    const existing = await Resource.findOne({ fileHash, status: 'PUBLISHED' })
      .populate('courseId', 'title code')
      .populate('universityId', 'name code');

    if (existing) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          exists: true,
          resource: existing,
        },
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: { exists: false },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createResource = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    const {
      title,
      description,
      universityId,
      departmentId,
      courseId,
      semester,
      teacherId,
      resourceType,
      topics,
      tags,
    } = req.body;

    const fileHash = StorageService.calculateFileHash(req.file.buffer);

    const existing = await Resource.findOne({ fileHash, status: 'PUBLISHED' });
    if (existing && !req.body.overrideDuplicate) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Hold your horses, fellow philanthropist. A very similar donation already exists.',
        data: { duplicateResource: existing },
      });
    }

    const uploadResult = await storageService.upload(req.file, 'resources');

    const parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics || [];
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];

    const initialRQS = QualityScoreService.calculateRQS({
      averageRating: 0,
      ratingsCount: 0,
      downloadsCount: 0,
      bookmarksCount: 0,
    });

    const resource = await Resource.create({
      title,
      description,
      uploaderId: req.user?.id || 'anonymous',
      universityId,
      departmentId,
      courseId,
      semester,
      ...(teacherId && { teacherId }),
      resourceType,
      topics: parsedTopics,
      tags: parsedTags,
      fileUrl: uploadResult.fileUrl,
      fileKey: uploadResult.fileKey,
      fileHash,
      mimeType: req.file.mimetype,
      sizeBytes: uploadResult.sizeBytes,
      status: 'PUBLISHED',
      qualityScore: initialRQS,
    });

    if (req.user?.id) {
      await UserProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { charityPoints: 10 } }
      );
    }

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Donation created successfully! You earned +10 Charity Points.',
      data: resource,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create resource' });
  }
};

export const getResources = async (req: Request, res: Response) => {
  try {
    const {
      search,
      universityId,
      departmentId,
      courseId,
      resourceType,
      sort = 'quality',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = { status: 'PUBLISHED' };

    if (universityId) query.universityId = universityId;
    if (departmentId) query.departmentId = departmentId;
    if (courseId) query.courseId = courseId;
    if (resourceType) query.resourceType = resourceType;

    if (search) {
      query.$text = { $search: search as string };
    }

    const sortOptions: any = {};
    if (sort === 'quality') sortOptions.qualityScore = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'rating') sortOptions['stats.averageRating'] = -1;
    else if (sort === 'downloads') sortOptions['stats.downloadsCount'] = -1;
    else sortOptions.createdAt = -1;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('courseId', 'title code')
        .populate('universityId', 'name code')
        .populate('departmentId', 'name code')
        .populate('teacherId', 'name title')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Resource.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Resources retrieved successfully',
      data: resources,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'stats.viewsCount': 1 } },
      { new: true }
    )
      .populate('courseId', 'title code description pantryHealthScore')
      .populate('universityId', 'name code logoUrl')
      .populate('departmentId', 'name code')
      .populate('teacherId', 'name title');

    if (!resource) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

    const uploaderProfile = await UserProfile.findOne({ userId: resource.uploaderId }).select(
      'name avatarUrl charityPoints verificationStatus'
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        ...resource.toObject(),
        uploader: uploaderProfile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
