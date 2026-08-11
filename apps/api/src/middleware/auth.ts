import { Request, Response, NextFunction } from 'express';
import { auth } from '../auth/auth';
import { UserProfile } from '../models/UserProfile';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session?: any;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized: Session missing or expired',
      });
    }

    let profile = await UserProfile.findOne({ userId: session.user.id });
    if (!profile) {
      profile = await UserProfile.create({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: 'STUDENT',
        verificationStatus: 'UNVERIFIED',
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: profile.role,
    };
    req.session = session.session;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Authentication failed',
    });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized: Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `Forbidden: Insufficient privileges. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};
