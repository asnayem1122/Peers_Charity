import mongoose, { Schema, Document } from 'mongoose';

export interface IResourceStats {
  viewsCount: number;
  downloadsCount: number;
  ratingsCount: number;
  averageRating: number;
  bookmarksCount: number;
}

export type AcademicSection = 'question' | 'course_material' | 'sessional';
export type ExamType = 'CT' | 'MID' | 'FINAL';
export type MaterialType = 'HAND_NOTE' | 'SLIDES' | 'EXTERNAL_LINK';

export interface IAcademicMetadata {
  section: AcademicSection;
  semester?: string;
  courseId?: mongoose.Types.ObjectId;
  batch: string;
  examType?: ExamType;
  materialType?: MaterialType;
  externalLink?: string;
  labNumber?: string | number;
}

export interface IResource extends Document {
  title: string;
  description: string;
  uploaderId: string;
  universityId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  semester: string;
  teacherId?: mongoose.Types.ObjectId;
  academicMetadata?: IAcademicMetadata;
  resourceType?:
    | 'Lecture Notes'
    | 'Class Notes'
    | 'Previous Exam Questions'
    | 'Solved Questions'
    | 'Lab Reports'
    | 'Assignments'
    | 'Presentations'
    | 'Cheat Sheets'
    | 'Reference Material'
    | 'Tutorials'
    | 'Question Banks'
    | 'Other';
  topics: string[];
  tags: string[];
  fileUrl?: string;
  fileKey?: string;
  fileHash?: string;
  mimeType?: string;
  sizeBytes?: number;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'REMOVED' | 'ARCHIVED';
  qualityScore: number;
  stats: IResourceStats;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, trim: true, index: 'text' },
    uploaderId: { type: String, required: true, index: true },
    universityId: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    semester: { type: String, required: true, trim: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    academicMetadata: {
      section: {
        type: String,
        enum: ['question', 'course_material', 'sessional'],
        index: true,
      },
      semester: { type: String, trim: true },
      batch: { type: String, trim: true },
      examType: {
        type: String,
        enum: ['CT', 'MID', 'FINAL'],
      },
      materialType: {
        type: String,
        enum: ['HAND_NOTE', 'SLIDES', 'EXTERNAL_LINK'],
      },
      externalLink: { type: String, trim: true },
      labNumber: { type: Schema.Types.Mixed },
    },
    resourceType: {
      type: String,
      required: false,
      enum: [
        'Lecture Notes',
        'Class Notes',
        'Previous Exam Questions',
        'Solved Questions',
        'Lab Reports',
        'Assignments',
        'Presentations',
        'Cheat Sheets',
        'Reference Material',
        'Tutorials',
        'Question Banks',
        'Other',
      ],
      index: true,
    },
    topics: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    fileUrl: { type: String },
    fileKey: { type: String },
    fileHash: { type: String, index: true },
    mimeType: { type: String },
    sizeBytes: { type: Number },
    status: {
      type: String,
      required: true,
      enum: ['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED', 'REMOVED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    qualityScore: { type: Number, default: 50, min: 0, max: 100, index: true },
    stats: {
      viewsCount: { type: Number, default: 0 },
      downloadsCount: { type: Number, default: 0 },
      ratingsCount: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      bookmarksCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ResourceSchema.index({ courseId: 1, status: 1, qualityScore: -1 });
ResourceSchema.index({ 'academicMetadata.section': 1, courseId: 1, status: 1 });
ResourceSchema.index({ 'academicMetadata.section': 1, 'academicMetadata.batch': 1, status: 1 });

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
