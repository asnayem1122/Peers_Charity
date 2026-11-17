import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Resource } from '../models/Resource';
import { UserProfile } from '../models/UserProfile';
import { University } from '../models/University';
import { Department } from '../models/Department';
import { Course } from '../models/Course';
import { Bookmark } from '../models/Bookmark';
import { Review } from '../models/Review';
import { Rating } from '../models/Rating';
import { Download } from '../models/Download';
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

    let validUniId = universityId;
    if (!validUniId || !mongoose.Types.ObjectId.isValid(validUniId)) {
      let defaultUni = await University.findOne();
      if (!defaultUni) {
        defaultUni = await University.create({ name: 'Premier University', code: 'PU', domains: ['pu.ac.bd'] });
      }
      validUniId = defaultUni._id;
    }

    let validDeptId = departmentId;
    if (!validDeptId || !mongoose.Types.ObjectId.isValid(validDeptId)) {
      let defaultDept = await Department.findOne({ universityId: validUniId });
      if (!defaultDept) {
        defaultDept = await Department.create({
          name: 'Computer Science & Engineering',
          code: 'CSE',
          universityId: validUniId,
        });
      }
      validDeptId = defaultDept._id;
    }

    let validCourseId = courseId;
    if (!validCourseId || !mongoose.Types.ObjectId.isValid(validCourseId)) {
      const codeStr = typeof courseId === 'string' && courseId.trim() ? courseId.trim() : 'CSE 2103';
      const normCode = codeStr.toUpperCase().replace(/[-_]/g, ' ');
      let existingCourse = await Course.findOne({
        $or: [{ code: normCode }, { code: normCode.replace(/\s+/g, '') }, { code: codeStr }],
      });
      if (!existingCourse) {
        existingCourse = await Course.create({
          title: `${normCode} Course Material`,
          code: normCode,
          departmentId: validDeptId,
          description: `Academic course library for ${normCode}`,
        });
      }
      validCourseId = existingCourse._id;
    }

    const validTypes = [
      'Lecture Notes',
      'Class Notes',
      'Previous Exam Questions',
      'Solved Questions',
      'Lab Reports',
      'Assignments',
      'Presentations',
      'Cheat Sheets',
      'Reference Material',
      'Tutorials',
      'Question Banks',
      'Other',
    ];
    let mappedResourceType = resourceType;
    if (!mappedResourceType || !validTypes.includes(mappedResourceType)) {
      if (parsedAcademicMetadata?.section === 'question') mappedResourceType = 'Previous Exam Questions';
      else if (parsedAcademicMetadata?.section === 'sessional') mappedResourceType = 'Lab Reports';
      else if (parsedAcademicMetadata?.materialType === 'SLIDES') mappedResourceType = 'Presentations';
      else if (parsedAcademicMetadata?.materialType === 'EXTERNAL_LINK') mappedResourceType = 'Reference Material';
      else mappedResourceType = 'Lecture Notes';
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
      universityId: validUniId,
      departmentId: validDeptId,
      courseId: validCourseId,
      semester: semester || 'Level 2 / Term 1',
      ...(teacherId && mongoose.Types.ObjectId.isValid(teacherId) && { teacherId }),
      academicMetadata: parsedAcademicMetadata,
      resourceType: mappedResourceType,
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

export const updateResource = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

    // Tenant / Owner isolation: only uploader or ADMIN can update
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const isOwner = resource.uploaderId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: You can only edit donations you uploaded.',
      });
    }

    const {
      title,
      description,
      topics,
      tags,
      semester,
      resourceType,
      academicMetadata,
      externalUrl,
    } = req.body;

    if (title && typeof title === 'string' && title.trim()) {
      resource.title = title.trim();
    }
    if (description !== undefined) {
      resource.description = typeof description === 'string' ? description.trim() : resource.description;
    }
    if (semester && typeof semester === 'string') {
      resource.semester = semester.trim();
    }
    if (resourceType && typeof resourceType === 'string') {
      resource.resourceType = resourceType as any;
    }
    if (topics) {
      try {
        resource.topics = typeof topics === 'string' ? JSON.parse(topics) : topics;
      } catch {
        resource.topics = Array.isArray(topics) ? topics : resource.topics;
      }
    }
    if (tags) {
      try {
        resource.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        resource.tags = Array.isArray(tags) ? tags : resource.tags;
      }
    }
    if (externalUrl) {
      resource.fileUrl = externalUrl;
      if (resource.academicMetadata) {
        resource.academicMetadata.externalLink = externalUrl;
      }
    }
    if (academicMetadata) {
      let parsed = academicMetadata;
      if (typeof academicMetadata === 'string') {
        try {
          parsed = JSON.parse(academicMetadata);
        } catch {
          parsed = academicMetadata;
        }
      }
      resource.academicMetadata = { ...resource.academicMetadata, ...parsed };
    }

    resource.qualityScore = QualityScoreService.calculateRQS({
      averageRating: resource.stats.averageRating,
      ratingsCount: resource.stats.ratingsCount,
      downloadsCount: resource.stats.downloadsCount,
      bookmarksCount: resource.stats.bookmarksCount,
    });

    await resource.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Donation updated successfully',
      data: resource,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to update resource',
    });
  }
};

export const deleteResource = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Looks like this donation wandered off.',
      });
    }

    // Owner / Admin authorization check
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const isOwner = resource.uploaderId === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden: You can only remove donations you uploaded.',
      });
    }

    // Soft delete / Archival (or hard delete if requested by admin)
    const hardDelete = req.query.hard === 'true' && isAdmin;
    if (hardDelete) {
      await Resource.deleteOne({ _id: id });
      await Promise.all([
        Bookmark.deleteMany({ resourceId: id }),
        Review.deleteMany({ resourceId: id }),
        Rating.deleteMany({ resourceId: id }),
        Download.deleteMany({ resourceId: id }),
      ]);
    } else {
      resource.status = 'REMOVED';
      await resource.save();
    }

    // Deduct charity points if uploader deleted their donation
    if (resource.uploaderId) {
      await UserProfile.findOneAndUpdate(
        { userId: resource.uploaderId },
        { $inc: { charityPoints: -10 } }
      );
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: hardDelete
        ? 'Resource permanently purged.'
        : 'Resource successfully archived and removed from public catalog.',
      data: { id, status: hardDelete ? 'DELETED' : 'REMOVED' },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to delete resource',
    });
  }
};
