import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  code: string;
  departmentId: mongoose.Types.ObjectId;
  description?: string;
  pantryHealthScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    description: { type: String },
    pantryHealthScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

CourseSchema.index({ departmentId: 1, code: 1 }, { unique: true });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
