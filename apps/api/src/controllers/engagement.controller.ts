import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Rating } from '../models/Rating';
import { Review } from '../models/Review';
import { Bookmark } from '../models/Bookmark';
import { Download } from '../models/Download';
import { Report } from '../models/Report';
import { Resource } from '../models/Resource';
import { UserProfile } from '../models/UserProfile';
import { QualityScoreService } from '../services/QualityScoreService';

export const addRating = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { stars } = req.body;
    const userId = req.user!.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.uploaderId === userId) {
      return res.status(400).json({ success: false, message: 'You cannot rate your own donation.' });
    }

    await Rating.findOneAndUpdate(
      { resourceId, userId },
      { stars },
      { upsert: true, new: true }
    );

    const ratings = await Rating.find({ resourceId });
    const count = ratings.length;
    const avg = ratings.reduce((sum: number, r: any) => sum + r.stars, 0) / count;

    resource.stats.ratingsCount = count;
    resource.stats.averageRating = parseFloat(avg.toFixed(2));
    
    resource.qualityScore = QualityScoreService.calculateRQS({
      averageRating: resource.stats.averageRating,
      ratingsCount: count,
      downloadsCount: resource.stats.downloadsCount,
      bookmarksCount: resource.stats.bookmarksCount,
    });

    await resource.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Rating saved successfully',
      data: { averageRating: resource.stats.averageRating, qualityScore: resource.qualityScore },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    const review = await Review.create({
      resourceId,
      userId,
      userName: req.user!.name,
      content,
    });

    await UserProfile.findOneAndUpdate({ userId }, { $inc: { charityPoints: 2 } });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Review posted! You earned +2 Charity Points.',
      data: review,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await Review.find({ resourceId: req.params.resourceId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user!.id;

    const existing = await Bookmark.findOne({ userId, resourceId });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      await Resource.findByIdAndUpdate(resourceId, { $inc: { 'stats.bookmarksCount': -1 } });
      return res.status(200).json({ success: true, message: 'Removed from My Treasure', data: { bookmarked: false } });
    }

    await Bookmark.create({ userId, resourceId });
    await Resource.findByIdAndUpdate(resourceId, { $inc: { 'stats.bookmarksCount': 1 } });
    return res.status(200).json({ success: true, message: 'Saved to My Treasure', data: { bookmarked: true } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const recordDownload = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user?.id;

    await Download.create({ resourceId, userId });
    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { 'stats.downloadsCount': 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Download recorded',
      data: { downloadUrl: resource.fileUrl, filename: resource.title },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const { reason, details } = req.body;
    const reporterId = req.user!.id;

    const report = await Report.create({
      resourceId,
      reporterId,
      reason,
      details,
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted to Charity Police moderation queue.',
      data: report,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
