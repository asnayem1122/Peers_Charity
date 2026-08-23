import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string; // References Better Auth User ID
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  universityId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  semester?: string;
  studentIdNumber?: string;
  verificationStatus: 'UNVERIFIED' | 'EMAIL_VERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  charityPoints: number;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
      default: 'STUDENT',
    },
    universityId: { type: Schema.Types.ObjectId, ref: 'University' },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
    semester: { type: String, trim: true },
    studentIdNumber: { type: String, trim: true },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'EMAIL_VERIFIED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
    },
    charityPoints: { type: Number, default: 0, min: 0 },
    avatarUrl: { type: String },
    bio: { type: String, maxLength: 500 },
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
