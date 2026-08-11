import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  userId?: string;
  resourceId: mongoose.Types.ObjectId;
  ipHash?: string;
  createdAt: Date;
}

const DownloadSchema = new Schema<IDownload>(
  {
    userId: { type: String, index: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    ipHash: { type: String },
  },
  { timestamps: true }
);

export const Download = mongoose.model<IDownload>('Download', DownloadSchema);
