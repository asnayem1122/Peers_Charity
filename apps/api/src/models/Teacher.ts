import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  title?: string;
  departmentId: mongoose.Types.ObjectId;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    email: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
