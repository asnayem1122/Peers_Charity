import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  code: string;
  domains: string[];
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    domains: [{ type: String, trim: true, lowercase: true }],
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export const University = mongoose.model<IUniversity>('University', UniversitySchema);
