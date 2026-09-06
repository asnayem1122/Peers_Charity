import { describe, it, expect } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../../src/app';

describe('VAPT: File Upload Defense & Static Serving Security Tests', () => {
  it('1. Rejects dangerous executable extensions (.exe, .sh, .bat, .php) on upload', async () => {
    const dangerousExtensions = ['malware.exe', 'exploit.sh', 'backdoor.php', 'script.bat'];

    for (const filename of dangerousExtensions) {
      const res = await request(app)
        .post('/api/resources')
        .set('x-test-user-id', 'test-uploader')
        .attach('file', Buffer.from('malicious binary content'), filename)
        .field('title', 'Exploit attempt')
        .field('courseId', 'CSE 2104')
        .field('batch', '11')
        .field('section', 'question')
        .field('semester', 'Level 2 / Term 1')
        .field('examType', 'CT');

      // Multer fileFilter or StorageService rejects forbidden extension
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  });

  it('2. Static uploads directory serves files with X-Content-Type-Options: nosniff and Content-Disposition: attachment', async () => {
    // Ensure test file exists in uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const testFilePath = path.join(uploadsDir, 'security-test.txt');
    fs.writeFileSync(testFilePath, 'Safe academic content');

    const res = await request(app).get('/uploads/security-test.txt');

    expect(res.status).toBe(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-disposition']).toMatch(/attachment/i);
    expect(res.headers['content-security-policy']).toMatch(/default-src 'none'/i);

    // Teardown
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('3. Prohibits dotfiles access (.env, .git) in uploads directory', async () => {
    const res = await request(app).get('/uploads/.env');
    // dotfiles: 'deny' returns 403 or 404
    expect([403, 404]).toContain(res.status);
  });
});
