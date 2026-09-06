import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('VAPT: NoSQL Injection & Query Tampering Tests', () => {
  it('1. Rejects MongoDB query operator injection ({ "$ne": null }) in checkDuplicate', async () => {
    const res = await request(app)
      .post('/api/resources/check-duplicate')
      .send({ fileHash: { $ne: null } });

    // Expect fail-fast rejection (400 Bad Request), not 200 or 500
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('2. Rejects regex operator injection ({ "$regex": ".*" }) in checkDuplicate', async () => {
    const res = await request(app)
      .post('/api/resources/check-duplicate')
      .send({ fileHash: { $regex: '.*' } });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('3. Rejects non-hex or non-SHA256 string payloads in checkDuplicate', async () => {
    const res = await request(app)
      .post('/api/resources/check-duplicate')
      .send({ fileHash: 'invalid-hash-string' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('4. Successfully accepts valid 64-character hex SHA-256 string in checkDuplicate', async () => {
    const validHash = 'a'.repeat(64);
    const res = await request(app)
      .post('/api/resources/check-duplicate')
      .send({ fileHash: validHash });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.exists).toBe(false);
  });
});
