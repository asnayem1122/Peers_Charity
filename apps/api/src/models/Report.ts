import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  resourceId: mongoose.Types.ObjectId;
  reporterId: string;
  reason:
    | 'incorrect information'
    | 'wrong course'
    | 'duplicate'
    | 'spam'
    | 'inappropriate content'
    | 'copyright concern'
    | 'malicious file'
    | 'misleading title'
    | 'other';
  details?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    reporterId: { type: String, required: true, index: true },
    reason: {
      type: String,
      required: true,
      enum: [
        'incorrect information',
        'wrong course',
        'duplicate',
        'spam',
        'inappropriate content',
        'copyright concern',
        'malicious file',
        'misleading title',
        'other',
      ],
    },
    details: { type: String, trim: true },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
