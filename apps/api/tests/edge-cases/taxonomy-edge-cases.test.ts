import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { Resource } from '../../src/models/Resource.js';

describe('Phase 4: Failure Scenarios & Edge Cases', () => {
  const universityId = new mongoose.Types.ObjectId();
  const departmentId = new mongoose.Types.ObjectId();
  const courseId = new mongoose.Types.ObjectId();

  const authHeaders = {
    'x-test-user-id': 'usr_edge_test',
    'x-test-user-email': 'edge@peerscharity.org',
  };

  it('Trimming & Normalization: Normalizes batches with leading/trailing whitespace to clean string', async () => {
    const response = await request(app)
      .post('/api/resources')
      .set(authHeaders)
      .field('title', 'Trimmed Batch Test')
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
          batch: '   11   ', // untrimmed batch
          examType: 'CT',
        })
      )
      .attach('file', Buffer.from('mock pdf'), 'test.pdf');

    expect(response.status).toBe(201);
    expect(response.body.data.academicMetadata.batch).toBe('11');

    const saved = await Resource.findById(response.body.data._id);
    expect(saved?.academicMetadata?.batch).toBe('11');
  });

  it('Case Sensitivity: Querying with lowercase ?examType=final normalizes to uppercase FINAL', async () => {
    // Seed one FINAL question
    await Resource.create({
      title: 'Final Exam Sample',
      uploaderId: 'edge_user',
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
      fileUrl: 'http://test.com/final.pdf',
      status: 'PUBLISHED',
    });

    // Query with lowercase 'final'
    const response = await request(app).get('/api/resources?section=question&examType=final');
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].academicMetadata.examType).toBe('FINAL');
  });

  it('Large Payload / Buffer Tests: Oversized strings fail fast at the boundary', async () => {
    const oversizedBatch = 'X'.repeat(200); // MAX_BATCH_LENGTH is 50

    const response = await request(app)
      .post('/api/resources')
      .set(authHeaders)
      .field('title', 'Oversized Batch Test')
      .field('universityId', universityId.toString())
      .field('departmentId', departmentId.toString())
      .field('courseId', courseId.toString())
      .field('semester', 'Level 2 / Term 1')
      .field(
        'academicMetadata',
        JSON.stringify({
          section: 'sessional',
          courseId: courseId.toString(),
          batch: oversizedBatch,
          labNumber: 'Lab 01',
        })
      )
      .attach('file', Buffer.from('mock data'), 'test.pdf');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.issues.some((i: any) => i.path.includes('batch'))).toBe(true);
  });

  it('Oversized Topic: Reject string exceeding maximum topic boundary (200 chars)', async () => {
    const oversizedTopic = 'T'.repeat(500);

    const response = await request(app)
      .post('/api/resources')
      .set(authHeaders)
      .field('title', 'Oversized Topic Test')
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
          labNumber: 'Lab 01',
          topic: oversizedTopic,
        })
      )
      .attach('file', Buffer.from('mock data'), 'test.pdf');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.issues.some((i: any) => i.path.includes('topic'))).toBe(true);
  });

  it('Malformed JSON in academicMetadata: Returns 400 with invalid JSON format error', async () => {
    const response = await request(app)
      .post('/api/resources')
      .set(authHeaders)
      .field('title', 'Malformed JSON Test')
      .field('universityId', universityId.toString())
      .field('departmentId', departmentId.toString())
      .field('courseId', courseId.toString())
      .field('semester', 'Level 2 / Term 1')
      .field('academicMetadata', '{ invalid json...')
      .attach('file', Buffer.from('mock data'), 'test.pdf');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid JSON format');
  });

  it('Missing academicMetadata: Returns 400 when academicMetadata field is omitted', async () => {
    const response = await request(app)
      .post('/api/resources')
      .set(authHeaders)
      .field('title', 'Missing Metadata Test')
      .field('universityId', universityId.toString())
      .field('departmentId', departmentId.toString())
      .field('courseId', courseId.toString())
      .field('semester', 'Level 2 / Term 1')
      .attach('file', Buffer.from('mock data'), 'test.pdf');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('academicMetadata is required');
  });
});
