import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userAvatarUrl: { type: String },
    content: { type: String, required: true, trim: true, maxLength: 1000 },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
