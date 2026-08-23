import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: string;
  resourceId: mongoose.Types.ObjectId;
  collectionName?: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: String, required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    collectionName: { type: String, default: 'General' },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
