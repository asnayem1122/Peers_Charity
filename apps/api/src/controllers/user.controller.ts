import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { UserProfile } from '../models/UserProfile';

export const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user?.id })
      .populate('universityId', 'name code domains')
      .populate('departmentId', 'name code');

    if (!profile) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to fetch user profile',
    });
  }
};

export const updateMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { semester, studentIdNumber, bio, avatarUrl, universityId, departmentId } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user?.id },
      {
        $set: {
          ...(semester && { semester }),
          ...(studentIdNumber && { studentIdNumber }),
          ...(bio !== undefined && { bio }),
          ...(avatarUrl && { avatarUrl }),
          ...(universityId && { universityId }),
          ...(departmentId && { departmentId }),
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const getPublicProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await UserProfile.findById(req.params.id)
      .select('-studentIdNumber -email')
      .populate('universityId', 'name code')
      .populate('departmentId', 'name code');

    if (!profile) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Benefactor profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Public profile retrieved',
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || 'Failed to fetch public profile',
    });
  }
};
