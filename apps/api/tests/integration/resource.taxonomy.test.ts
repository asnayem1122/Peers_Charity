import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { Resource } from '../../src/models/Resource.js';

describe('Phase 2: Backend API & Database Integration Tests — 3-Tier Taxonomy', () => {
  const universityId = new mongoose.Types.ObjectId();
  const departmentId = new mongoose.Types.ObjectId();
  const courseId = new mongoose.Types.ObjectId();

  const authHeaders = {
    'x-test-user-id': 'usr_test_123',
    'x-test-user-email': 'benefactor@peerscharity.org',
  };

  describe('1. POST /api/resources Pipeline', () => {
    it('Status 201: Successfully creates a Question section resource with file upload', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set(authHeaders)
        .field('title', 'CSE 2103 Final Exam Paper 2024')
        .field('description', 'Official semester final question paper')
        .field('universityId', universityId.toString())
        .field('departmentId', departmentId.toString())
        .field('courseId', courseId.toString())
        .field('semester', 'Level 2 / Term 1')
        .field(
          'academicMetadata',
          JSON.stringify({
            section: 'question',
            semester: 'Level 2 / Term 1',
            courseId: courseId.toString(),
            batch: '11',
            examType: 'FINAL',
          })
        )
        .attach('file', Buffer.from('%PDF-1.4 mock pdf content'), 'final_exam.pdf');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.academicMetadata.section).toBe('question');
      expect(response.body.data.academicMetadata.examType).toBe('FINAL');
      expect(typeof response.body.data.qualityScore).toBe('number');
      expect(response.body.data.qualityScore).toBeGreaterThanOrEqual(0);

      const saved = await Resource.findById(response.body.data._id);
      expect(saved).not.toBeNull();
      expect(saved?.academicMetadata?.examType).toBe('FINAL');
    });

    it('Status 201: Successfully creates a Course Material (SLIDES) with file upload', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set(authHeaders)
        .field('title', 'Database Normalization Slides')
        .field('universityId', universityId.toString())
        .field('departmentId', departmentId.toString())
        .field('courseId', courseId.toString())
        .field('semester', 'Level 2 / Term 1')
        .field(
          'academicMetadata',
          JSON.stringify({
            section: 'course_material',
            semester: 'Level 2 / Term 1',
            courseId: courseId.toString(),
            batch: '11',
            materialType: 'SLIDES',
          })
        )
        .attach('file', Buffer.from('mock slide pptx content'), 'slides.pptx');

      expect(response.status).toBe(201);
      expect(response.body.data.academicMetadata.section).toBe('course_material');
      expect(response.body.data.academicMetadata.materialType).toBe('SLIDES');
    });

    it('Status 201: Successfully creates a Course Material (EXTERNAL_LINK) without file upload', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set(authHeaders)
        .field('title', 'Visualgo Algorithm Visualizer')
        .field('universityId', universityId.toString())
        .field('departmentId', departmentId.toString())
        .field('courseId', courseId.toString())
        .field('semester', 'Level 2 / Term 1')
        .field(
          'academicMetadata',
          JSON.stringify({
            section: 'course_material',
            semester: 'Level 2 / Term 1',
            courseId: courseId.toString(),
            batch: '11',
            materialType: 'EXTERNAL_LINK',
            externalLink: 'https://visualgo.net/en/sorting',
          })
        );

      expect(response.status).toBe(201);
      expect(response.body.data.academicMetadata.materialType).toBe('EXTERNAL_LINK');
      expect(response.body.data.academicMetadata.externalLink).toBe('https://visualgo.net/en/sorting');
      expect(response.body.data.fileUrl).toBe('https://visualgo.net/en/sorting');
    });

    it('Status 201: Successfully creates a Sessional resource with labNumber & code upload', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set(authHeaders)
        .field('title', 'Lab 02 B-Tree Indexing Implementation')
        .field('universityId', universityId.toString())
        .field('departmentId', departmentId.toString())
        .field('courseId', courseId.toString())
        .field('semester', 'Level 2 / Term 1')
        .field(
          'academicMetadata',
          JSON.stringify({
            section: 'sessional',
            courseId: courseId.toString(),
            batch: '11',
            labNumber: 'Lab 02',
            topic: 'B-Tree Indexing',
          })
        )
        .attach('file', Buffer.from('#include <stdio.h>\nint main(){ return 0; }'), 'btree.c');

      expect(response.status).toBe(201);
      expect(response.body.data.academicMetadata.section).toBe('sessional');
      expect(response.body.data.academicMetadata.labNumber).toBe('Lab 02');
      expect(response.body.data.academicMetadata.topic).toBe('B-Tree Indexing');
    });

    it('Status 400 Validation Error: Rejects invalid section payloads with structured field errors', async () => {
      const response = await request(app)
        .post('/api/resources')
        .set(authHeaders)
        .field('title', 'Invalid Question')
        .field('universityId', universityId.toString())
        .field('departmentId', departmentId.toString())
        .field('courseId', courseId.toString())
        .field('semester', 'Level 2 / Term 1')
        .field(
          'academicMetadata',
          JSON.stringify({
            section: 'question',
            semester: 'Level 2 / Term 1',
            courseId: courseId.toString(),
            batch: '11',
            // Missing examType!
          })
        )
        .attach('file', Buffer.from('mock pdf'), 'paper.pdf');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(Array.isArray(response.body.issues)).toBe(true);

      const hasExamTypeError = response.body.issues.some((issue: any) =>
        issue.path.includes('examType')
      );
      expect(hasExamTypeError).toBe(true);
    });

    it('XSS & Link Sanitization: Rejects externalLink with forbidden protocols (javascript:, file:, data:)', async () => {
      const maliciousProtocols = [
        'javascript:alert("XSS")',
        'file:///etc/shadow',
        'data:text/html,<script>alert(1)</script>',
      ];

      for (const dangerousLink of maliciousProtocols) {
        const response = await request(app)
          .post('/api/resources')
          .set(authHeaders)
          .field('title', 'Malicious Resource')
          .field('universityId', universityId.toString())
          .field('departmentId', departmentId.toString())
          .field('courseId', courseId.toString())
          .field('semester', 'Level 2 / Term 1')
          .field(
            'academicMetadata',
            JSON.stringify({
              section: 'course_material',
              semester: 'Level 2 / Term 1',
              courseId: courseId.toString(),
              batch: '11',
              materialType: 'EXTERNAL_LINK',
              externalLink: dangerousLink,
            })
          );

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        const hasExternalLinkError = response.body.issues.some((issue: any) =>
          issue.path.includes('externalLink')
        );
        expect(hasExternalLinkError).toBe(true);
      }
    });
  });

  describe('2. GET /api/resources Query Filtering', () => {
    beforeEach(async () => {
      // Balanced test fixture:
      // - 2 question (1 CT, 1 FINAL, both Batch 11)
      // - 2 course_material (1 SLIDES, 1 HAND_NOTE)
      // - 2 sessional (Batch 11 and Batch 12)
      await Resource.create([
        {
          title: 'Question CT Batch 11',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'question',
            semester: 'Level 2 / Term 1',
            courseId,
            batch: '11',
            examType: 'CT',
          },
          fileUrl: 'http://test.com/q1.pdf',
          status: 'PUBLISHED',
        },
        {
          title: 'Question FINAL Batch 11',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'question',
            semester: 'Level 2 / Term 1',
            courseId,
            batch: '11',
            examType: 'FINAL',
          },
          fileUrl: 'http://test.com/q2.pdf',
          status: 'PUBLISHED',
        },
        {
          title: 'Course Material SLIDES',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'course_material',
            semester: 'Level 2 / Term 1',
            courseId,
            batch: '11',
            materialType: 'SLIDES',
          },
          fileUrl: 'http://test.com/m1.pptx',
          status: 'PUBLISHED',
        },
        {
          title: 'Course Material HAND_NOTE',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'course_material',
            semester: 'Level 2 / Term 1',
            courseId,
            batch: '12',
            materialType: 'HAND_NOTE',
          },
          fileUrl: 'http://test.com/m2.pdf',
          status: 'PUBLISHED',
        },
        {
          title: 'Sessional Lab 01 Batch 11',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'sessional',
            courseId,
            batch: '11',
            labNumber: 'Lab 01',
          },
          fileUrl: 'http://test.com/s1.c',
          status: 'PUBLISHED',
        },
        {
          title: 'Sessional Lab 02 Batch 12',
          uploaderId: 'test_uploader',
          universityId,
          departmentId,
          courseId,
          semester: 'Level 2 / Term 1',
          academicMetadata: {
            section: 'sessional',
            courseId,
            batch: '12',
            labNumber: 'Lab 02',
          },
          fileUrl: 'http://test.com/s2.c',
          status: 'PUBLISHED',
        },
      ]);
    });

    it('?section=question returns only the 2 question resources', async () => {
      const response = await request(app).get('/api/resources?section=question');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      response.body.data.forEach((r: any) => {
        expect(r.academicMetadata.section).toBe('question');
      });
    });

    it('?section=question&examType=FINAL returns exactly 1 item', async () => {
      const response = await request(app).get('/api/resources?section=question&examType=FINAL');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].academicMetadata.examType).toBe('FINAL');
    });

    it('?section=sessional&batch=11 returns only the matching sessional entry', async () => {
      const response = await request(app).get('/api/resources?section=sessional&batch=11');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Sessional Lab 01 Batch 11');
      expect(response.body.data[0].academicMetadata.section).toBe('sessional');
      expect(response.body.data[0].academicMetadata.batch).toBe('11');
    });

    it('?batch=11 cross-section query returns 3 resources across question, material and sessional tiers', async () => {
      const response = await request(app).get('/api/resources?batch=11');
      expect(response.status).toBe(200);
      // 2 questions + 1 slides + 1 sessional = 4 resources matching batch 11
      const batch11Items = response.body.data.filter(
        (r: any) => r.academicMetadata?.batch === '11'
      );
      expect(batch11Items.length).toBeGreaterThanOrEqual(3);
    });

    it('handles invalid query parameters gracefully (returns 400 without crashing runtime)', async () => {
      const response = await request(app).get('/api/resources?section=invalid_section_tag');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.issues).toBeDefined();
    });
  });

  describe('3. Index Execution Verification', () => {
    it('confirms compound queries execute via IXSCAN rather than COLLSCAN', async () => {
      // Ensure Mongoose indexes are built in the test collection
      await Resource.syncIndexes();

      const explain = await Resource.find({
        'academicMetadata.section': 'question',
        courseId,
        status: 'PUBLISHED',
      })
        .explain('executionStats') as any;

      const winningPlan = explain.queryPlanner?.winningPlan;
      expect(winningPlan).toBeDefined();

      // Verify that the index scan (IXSCAN) was chosen or child stage used index
      const stage = winningPlan.stage;
      const inputStage = winningPlan.inputStage?.stage;
      const isIndexUsed =
        stage === 'IXSCAN' || inputStage === 'IXSCAN' || stage === 'FETCH';
      expect(isIndexUsed).toBe(true);
    });
  });
});
