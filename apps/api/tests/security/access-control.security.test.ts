import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';

describe('VAPT: Broken Access Control & Privilege Escalation Tests', () => {
  it('1. Unauthenticated requests to admin analytics endpoint are rejected with 401', async () => {
    const res = await request(app).get('/api/admin/analytics');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('2. Unauthenticated requests to admin reports endpoint are rejected with 401', async () => {
    const res = await request(app).get('/api/admin/reports');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('3. Unauthenticated requests to admin audit-logs endpoint are rejected with 401', async () => {
    const res = await request(app).get('/api/admin/audit-logs');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('4. STUDENT role attempting to access admin endpoints is rejected with 403 Forbidden', async () => {
    // Authenticated as regular student
    const res = await request(app)
      .get('/api/admin/analytics')
      .set('x-test-user-id', 'student-attacker-id')
      .set('x-test-user-email', 'attacker@student.university.edu');

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Forbidden: Insufficient privileges/i);
  });

  it('5. Unauthenticated requests to record download are rejected with 401', async () => {
    const fakeResourceId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).post(`/api/engagement/${fakeResourceId}/download`);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
