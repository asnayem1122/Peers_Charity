import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Resource } from '../models/Resource';
import { UserProfile } from '../models/UserProfile';
import { storageService, StorageService } from '../services/StorageService';
import { QualityScoreService } from '../services/QualityScoreService';

export const checkDuplicate = async (req: Request, res: Response) => {
  try {
    const { fileHash } = req.body;
    if (!fileHash || typeof fileHash !== 'string') {
      return res.status(400).json({ success: false, message: 'fileHash string is required' });
    }

    // Defensive check against NoSQL injection operators
    const sanitizedHash = fileHash.trim();
    if (!/^[a-fA-F0-9]{64}$/.test(sanitizedHash)) {
      return res.status(400).json({ success: false, message: 'Invalid fileHash format (expected 64-char hex SHA-256)' });
    }

    const existing = await Resource.findOne({ fileHash: sanitizedHash, status: 'PUBLISHED' })
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
    const {
      title,
      description,
      universityId,
      departmentId,
      courseId,
      semester,
      teacherId,
      resourceType,
      academicMetadata,
      externalUrl,
      topics,
      tags,
    } = req.body;

    let parsedAcademicMetadata = undefined;
    if (academicMetadata) {
      try {
        parsedAcademicMetadata = typeof academicMetadata === 'string' ? JSON.parse(academicMetadata) : academicMetadata;
      } catch (e) {
        parsedAcademicMetadata = academicMetadata;
      }
    }

    const isExternalLink =
      (parsedAcademicMetadata?.section === 'course_material' &&
        parsedAcademicMetadata?.materialType === 'EXTERNAL_LINK') ||
      resourceType === 'External Link' ||
      Boolean(externalUrl) ||
      Boolean(parsedAcademicMetadata?.externalLink);

    if (!req.file && !isExternalLink) {
      return res.status(400).json({ success: false, message: 'File is required for this resource type' });
    }

    let uploadResult = {
      fileUrl: externalUrl || parsedAcademicMetadata?.externalLink || '',
      fileKey: '',
      sizeBytes: 0,
    };
    let fileHash = '';

    if (req.file) {
      fileHash = StorageService.calculateFileHash(req.file.buffer);

      const existing = await Resource.findOne({ fileHash, status: 'PUBLISHED' });
      if (existing && !req.body.overrideDuplicate) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: 'Hold your horses, fellow philanthropist. A very similar donation already exists.',
          data: { duplicateResource: existing },
        });
      }

      uploadResult = await storageService.upload(req.file, 'resources');
    }

    let parsedTopics: string[] = [];
    try {
      parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics || [];
    } catch {
      parsedTopics = [];
    }

    let parsedTags: string[] = [];
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
    } catch {
      parsedTags = [];
    }

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
      academicMetadata: parsedAcademicMetadata,
      resourceType,
      topics: parsedTopics,
      tags: parsedTags,
      fileUrl: uploadResult.fileUrl,
      fileKey: uploadResult.fileKey,
      fileHash: fileHash || undefined,
      mimeType: req.file ? req.file.mimetype : 'application/link',
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
      section,
      batch,
      examType,
      materialType,
      sort = 'quality',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = { status: 'PUBLISHED' };

    if (universityId) query.universityId = universityId;
    if (departmentId) query.departmentId = departmentId;
    if (courseId) query.courseId = courseId;
    if (resourceType) query.resourceType = resourceType;
    if (section) query['academicMetadata.section'] = section;
    if (batch) query['academicMetadata.batch'] = batch;
    if (examType) query['academicMetadata.examType'] = examType;
    if (materialType) query['academicMetadata.materialType'] = materialType;

    if (search) {
      query.$text = { $search: search as string };
    }

    const sortOptions: any = {};
    if (sort === 'quality') sortOptions.qualityScore = -1;
    else if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'rating') sortOptions['stats.averageRating'] = -1;
    else if (sort === 'downloads') sortOptions['stats.downloadsCount'] = -1;
    else sortOptions.createdAt = -1;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit as string, 10) || 10), 100);
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

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
