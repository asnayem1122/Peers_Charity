import { z } from 'zod';

// URL validator ensuring http/https and rejecting dangerous protocols
export const safeUrlSchema = z
  .string({ invalid_type_error: 'externalLink must be a string' })
  .trim()
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'externalLink must be a valid HTTP or HTTPS URL' }
  );

// Maximum string lengths to prevent buffer / oversized payload attacks
export const MAX_BATCH_LENGTH = 50;
export const MAX_TOPIC_LENGTH = 200;
export const MAX_COURSE_ID_LENGTH = 100;
export const MAX_SEMESTER_LENGTH = 100;
export const MAX_TITLE_LENGTH = 250;
export const MAX_DESC_LENGTH = 5000;

// Batch schema with automatic trimming and whitespace-only rejection
export const BatchSchema = z
  .string({ required_error: 'batch is required' })
  .transform((val) => val.trim())
  .pipe(
    z
      .string()
      .min(1, 'batch cannot be empty or whitespace-only')
      .max(MAX_BATCH_LENGTH, `batch cannot exceed ${MAX_BATCH_LENGTH} characters`)
  );

// 1. Question Section Schema
export const QuestionMetadataSchema = z.object({
  section: z.literal('question', {
    required_error: 'section is required',
    invalid_type_error: 'section must be question',
  }),
  semester: z
    .string({ required_error: 'semester is required' })
    .trim()
    .min(1, 'semester cannot be empty')
    .max(MAX_SEMESTER_LENGTH, `semester cannot exceed ${MAX_SEMESTER_LENGTH} characters`),
  courseId: z
    .string({ required_error: 'courseId is required' })
    .trim()
    .min(1, 'courseId cannot be empty')
    .max(MAX_COURSE_ID_LENGTH),
  batch: BatchSchema,
  examType: z.enum(['CT', 'MID', 'FINAL'], {
    required_error: 'examType is required',
    invalid_type_error: 'examType must be CT, MID, or FINAL',
  }),
  externalLink: z.undefined().optional(),
  labNumber: z.undefined().optional(),
  topic: z.string().trim().max(MAX_TOPIC_LENGTH).optional(),
});

// Helper refinement for Course Material External Link validation
export const validateExternalLinkRefinement = (
  data: { materialType: 'HAND_NOTE' | 'SLIDES' | 'EXTERNAL_LINK'; externalLink?: string },
  ctx: z.RefinementCtx
) => {
  if (data.materialType === 'EXTERNAL_LINK') {
    if (!data.externalLink || data.externalLink.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'externalLink is required when materialType is EXTERNAL_LINK',
        path: ['externalLink'],
      });
    } else {
      const urlCheck = safeUrlSchema.safeParse(data.externalLink);
      if (!urlCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'externalLink must be a valid HTTP or HTTPS URL',
          path: ['externalLink'],
        });
      }
    }
  }
};

// 2. Base Course Material Schema (raw ZodObject for discriminated union)
export const BaseCourseMaterialMetadataSchema = z.object({
  section: z.literal('course_material', {
    required_error: 'section is required',
    invalid_type_error: 'section must be course_material',
  }),
  semester: z
    .string({ required_error: 'semester is required' })
    .trim()
    .min(1, 'semester cannot be empty')
    .max(MAX_SEMESTER_LENGTH, `semester cannot exceed ${MAX_SEMESTER_LENGTH} characters`),
  courseId: z
    .string({ required_error: 'courseId is required' })
    .trim()
    .min(1, 'courseId cannot be empty')
    .max(MAX_COURSE_ID_LENGTH),
  batch: BatchSchema,
  materialType: z.enum(['HAND_NOTE', 'SLIDES', 'EXTERNAL_LINK'], {
    required_error: 'materialType is required',
    invalid_type_error: 'materialType must be HAND_NOTE, SLIDES, or EXTERNAL_LINK',
  }),
  externalLink: z.string().trim().optional(),
  examType: z.undefined().optional(),
  labNumber: z.undefined().optional(),
  topic: z.string().trim().max(MAX_TOPIC_LENGTH).optional(),
});

// Refined Course Material Schema
export const CourseMaterialMetadataSchema = BaseCourseMaterialMetadataSchema.superRefine((data, ctx) =>
  validateExternalLinkRefinement(data, ctx)
);

// 3. Sessional Schema
export const SessionalMetadataSchema = z.object({
  section: z.literal('sessional', {
    required_error: 'section is required',
    invalid_type_error: 'section must be sessional',
  }),
  courseId: z
    .string({ required_error: 'courseId is required' })
    .trim()
    .min(1, 'courseId cannot be empty')
    .max(MAX_COURSE_ID_LENGTH),
  batch: BatchSchema,
  labNumber: z
    .union([z.string().trim().min(1, 'labNumber cannot be empty'), z.number()], {
      required_error: 'labNumber is required',
      invalid_type_error: 'labNumber must be a string or number',
    }),
  topic: z.string().trim().max(MAX_TOPIC_LENGTH, `topic cannot exceed ${MAX_TOPIC_LENGTH} characters`).optional(),
  semester: z.string().trim().min(1).max(MAX_SEMESTER_LENGTH).optional(),
  examType: z.undefined().optional(),
  materialType: z.undefined().optional(),
  externalLink: z.undefined().optional(),
});

// Discriminated Union across the 3 sections (with external link refinement)
export const AcademicMetadataSchema = z
  .discriminatedUnion('section', [
    QuestionMetadataSchema,
    BaseCourseMaterialMetadataSchema,
    SessionalMetadataSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.section === 'course_material') {
      validateExternalLinkRefinement(data, ctx);
    }
  });

// Full Resource Creation Schema
export const CreateResourceInputSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(MAX_TITLE_LENGTH),
  description: z.string().trim().max(MAX_DESC_LENGTH).optional(),
  universityId: z.string().trim().optional(),
  departmentId: z.string().trim().optional(),
  courseId: z.string().trim().min(1, 'courseId is required'),
  semester: z.string().trim().optional(),
  academicMetadata: AcademicMetadataSchema,
  topics: z.array(z.string().trim()).optional(),
  tags: z.array(z.string().trim()).optional(),
  externalUrl: safeUrlSchema.optional(),
});

// Query Filter Schema with normalization
export const ResourceQuerySchema = z.object({
  section: z.enum(['question', 'course_material', 'sessional']).optional(),
  courseId: z.string().trim().optional(),
  batch: z
    .string()
    .trim()
    .max(MAX_BATCH_LENGTH)
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  examType: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? (val.toUpperCase() as any) : undefined))
    .pipe(z.enum(['CT', 'MID', 'FINAL']).optional()),
  materialType: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? (val.toUpperCase() as any) : undefined))
    .pipe(z.enum(['HAND_NOTE', 'SLIDES', 'EXTERNAL_LINK']).optional()),
  search: z.string().trim().optional(),
  sort: z.enum(['quality', 'newest', 'rating', 'downloads']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type QuestionMetadataInput = z.infer<typeof QuestionMetadataSchema>;
export type CourseMaterialMetadataInput = z.infer<typeof CourseMaterialMetadataSchema>;
export type SessionalMetadataInput = z.infer<typeof SessionalMetadataSchema>;
export type AcademicMetadataInput = z.infer<typeof AcademicMetadataSchema>;
export type CreateResourceInput = z.infer<typeof CreateResourceInputSchema>;
export type ResourceQueryInput = z.infer<typeof ResourceQuerySchema>;
