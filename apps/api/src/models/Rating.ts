import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: string;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    userId: { type: String, required: true, index: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Enforce one rating per user per resource
RatingSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
