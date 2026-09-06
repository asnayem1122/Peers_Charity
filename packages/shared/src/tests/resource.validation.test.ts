import { describe, it, expect } from 'vitest';
import {
  AcademicMetadataSchema,
  QuestionMetadataSchema,
  CourseMaterialMetadataSchema,
  SessionalMetadataSchema,
  ResourceQuerySchema,
  BatchSchema,
  safeUrlSchema,
} from '../validation.js';

describe('Phase 1: Contract & Schema Unit Tests — 3-Tier Academic Taxonomy', () => {
  describe('1. Question Section Validation', () => {
    it('accepts valid question with semester, courseId, batch, and examType = "FINAL"', () => {
      const payload = {
        section: 'question',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        examType: 'FINAL',
      };

      const result = QuestionMetadataSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.section).toBe('question');
        expect(result.data.examType).toBe('FINAL');
        expect(result.data.batch).toBe('11');
      }

      // Also verify via Discriminated Union
      const unionResult = AcademicMetadataSchema.safeParse(payload);
      expect(unionResult.success).toBe(true);
    });

    it('accepts other valid exam types: CT and MID', () => {
      const ctPayload = {
        section: 'question',
        semester: 'Level 1 / Term 2',
        courseId: 'cse-1201',
        batch: '12',
        examType: 'CT',
      };
      expect(QuestionMetadataSchema.safeParse(ctPayload).success).toBe(true);

      const midPayload = {
        section: 'question',
        semester: 'Level 3 / Term 1',
        courseId: 'cse-3101',
        batch: 'Fall 23',
        examType: 'MID',
      };
      expect(QuestionMetadataSchema.safeParse(midPayload).success).toBe(true);
    });

    it('fails when examType is omitted', () => {
      const payload = {
        section: 'question',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
      };

      const result = QuestionMetadataSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('examType'))).toBe(true);
      }
    });

    it('fails when examType is invalid, e.g., "POP_QUIZ"', () => {
      const payload = {
        section: 'question',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        examType: 'POP_QUIZ',
      };

      const result = QuestionMetadataSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('examType'))).toBe(true);
      }
    });

    it('fails when semester is omitted', () => {
      const payload = {
        section: 'question',
        courseId: 'cse-2103',
        batch: '11',
        examType: 'FINAL',
      };

      const result = QuestionMetadataSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('semester'))).toBe(true);
      }
    });
  });

  describe('2. Course Material Validation', () => {
    it('accepts valid slide/note with semester, courseId, batch, and materialType = "SLIDES"', () => {
      const payload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'SLIDES',
      };

      const result = CourseMaterialMetadataSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.materialType).toBe('SLIDES');
        expect(result.data.batch).toBe('11');
      }

      // Also verify via Discriminated Union
      expect(AcademicMetadataSchema.safeParse(payload).success).toBe(true);
    });

    it('accepts valid materialType = "HAND_NOTE"', () => {
      const payload = {
        section: 'course_material',
        semester: 'Level 3 / Term 2',
        courseId: 'cse-3205',
        batch: '10',
        materialType: 'HAND_NOTE',
      };
      expect(CourseMaterialMetadataSchema.safeParse(payload).success).toBe(true);
    });

    it('accepts materialType = "EXTERNAL_LINK" with a valid URL', () => {
      const payload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
        externalLink: 'https://visualgo.net/en/sorting',
      };

      const result = CourseMaterialMetadataSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.externalLink).toBe('https://visualgo.net/en/sorting');
      }
    });

    it('fails when externalLink is not a valid URI (e.g. javascript:alert(1) or random string)', () => {
      const xssPayload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
        externalLink: 'javascript:alert(1)',
      };
      const xssResult = CourseMaterialMetadataSchema.safeParse(xssPayload);
      expect(xssResult.success).toBe(false);
      if (!xssResult.success) {
        expect(xssResult.error.issues.some((i) => i.path.includes('externalLink'))).toBe(true);
      }

      const filePayload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
        externalLink: 'file:///etc/passwd',
      };
      expect(CourseMaterialMetadataSchema.safeParse(filePayload).success).toBe(false);

      const invalidStrPayload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
        externalLink: 'not-a-valid-url',
      };
      expect(CourseMaterialMetadataSchema.safeParse(invalidStrPayload).success).toBe(false);
    });

    it('fails if materialType = "EXTERNAL_LINK" but externalLink is absent or empty', () => {
      const missingPayload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
      };
      const result = CourseMaterialMetadataSchema.safeParse(missingPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('externalLink'))).toBe(true);
      }

      const emptyPayload = {
        section: 'course_material',
        semester: 'Level 2 / Term 1',
        courseId: 'cse-2103',
        batch: '11',
        materialType: 'EXTERNAL_LINK',
        externalLink: '   ',
      };
      expect(CourseMaterialMetadataSchema.safeParse(emptyPayload).success).toBe(false);
    });
  });

  describe('3. Sessional Section Validation', () => {
    it('accepts valid sessional without semester (semester is optional)', () => {
      const payload = {
        section: 'sessional',
        courseId: 'cse-2104',
        batch: '11',
        labNumber: 'Lab 03',
        topic: 'Graph Algorithms',
      };

      const result = SessionalMetadataSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.semester).toBeUndefined();
        expect(result.data.labNumber).toBe('Lab 03');
        expect(result.data.topic).toBe('Graph Algorithms');
      }

      // Also verify via Discriminated Union
      expect(AcademicMetadataSchema.safeParse(payload).success).toBe(true);
    });

    it('accepts valid sessional with optional semester provided', () => {
      const payload = {
        section: 'sessional',
        courseId: 'cse-2104',
        batch: '11',
        labNumber: 2,
        semester: 'Level 2 / Term 1',
      };

      const result = SessionalMetadataSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.semester).toBe('Level 2 / Term 1');
        expect(result.data.labNumber).toBe(2);
      }
    });

    it('rejects when batch is missing', () => {
      const payload = {
        section: 'sessional',
        courseId: 'cse-2104',
        labNumber: 'Lab 01',
      };

      const result = SessionalMetadataSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('batch'))).toBe(true);
      }
    });

    it('rejects when batch is whitespace-only', () => {
      const payload = {
        section: 'sessional',
        courseId: 'cse-2104',
        batch: '     ',
        labNumber: 'Lab 01',
      };

      const result = SessionalMetadataSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('batch'))).toBe(true);
      }
    });
  });

  describe('4. Discriminated Union & Query Schema Normalization', () => {
    it('rejects invalid discriminator section tag', () => {
      const invalidSection = {
        section: 'unknown_section',
        courseId: 'cse-101',
        batch: '11',
      };
      const result = AcademicMetadataSchema.safeParse(invalidSection);
      expect(result.success).toBe(false);
    });

    it('normalizes query parameters: lowercase examType to uppercase and trims batch', () => {
      const rawQuery = {
        section: 'question',
        batch: '  11  ',
        examType: 'final',
        materialType: 'slides',
        search: 'database',
        sort: 'downloads',
        page: '2',
        limit: '25',
      };

      const result = ResourceQuerySchema.safeParse(rawQuery);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.batch).toBe('11');
        expect(result.data.examType).toBe('FINAL');
        expect(result.data.materialType).toBe('SLIDES');
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(25);
      }
    });

    it('handles empty query values by setting undefined', () => {
      const emptyQuery = {
        batch: '',
        examType: '',
        materialType: '',
      };
      const result = ResourceQuerySchema.safeParse(emptyQuery);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.batch).toBeUndefined();
        expect(result.data.examType).toBeUndefined();
        expect(result.data.materialType).toBeUndefined();
      }
    });

    it('validates batch and topic length boundaries', () => {
      const overLongBatch = 'A'.repeat(51);
      const overLongTopic = 'T'.repeat(201);

      const batchCheck = BatchSchema.safeParse(overLongBatch);
      expect(batchCheck.success).toBe(false);

      const sessionalWithOverlongTopic = {
        section: 'sessional',
        courseId: 'cse-101',
        batch: '11',
        labNumber: '1',
        topic: overLongTopic,
      };
      expect(SessionalMetadataSchema.safeParse(sessionalWithOverlongTopic).success).toBe(false);
    });

    it('rejects unsupported protocols like ftp in safeUrlSchema', () => {
      expect(safeUrlSchema.safeParse('ftp://example.com/file.pdf').success).toBe(false);
      expect(safeUrlSchema.safeParse('http://example.com').success).toBe(true);
      expect(safeUrlSchema.safeParse(12345).success).toBe(false);
    });
  });
});
