import { describe, it, expect } from 'vitest';
import { storageService } from '../../src/services/StorageService';

describe('VAPT: Path Traversal & Sandbox Escape Vulnerability Tests', () => {
  it('1. Rejects relative path traversal sequences with parent directory traversal (../)', () => {
    const maliciousKeys = [
      '../package.json',
      '../../src/server.ts',
      '../../../etc/passwd',
      'resources/../../config/env.ts',
      '..\\..\\windows\\system32',
    ];

    for (const key of maliciousKeys) {
      expect(() => storageService.resolveSecurePath(key)).toThrow(/Path traversal attempt detected/i);
    }
  });

  it('2. Rejects absolute paths attempting to escape storage root', () => {
    const absoluteKeys = [
      '/etc/shadow',
      '/var/log/syslog',
      'C:\\Windows\\System32\\calc.exe',
      'D:\\Code\\peers-charity\\package.json',
    ];

    for (const key of absoluteKeys) {
      expect(() => storageService.resolveSecurePath(key)).toThrow(/Path traversal attempt detected/i);
    }
  });

  it('3. Rejects null byte injection (%00 / \\0) attacks', () => {
    const nullByteKeys = [
      'resources/valid.pdf\0.exe',
      'resources/report.pdf\0/../../server.ts',
    ];

    for (const key of nullByteKeys) {
      expect(() => storageService.resolveSecurePath(key)).toThrow(/Null byte injection detected/i);
    }
  });

  it('4. Rejects invalid and non-string keys defensively', () => {
    // @ts-expect-error testing invalid runtime types
    expect(() => storageService.resolveSecurePath(null)).toThrow(/Invalid fileKey/i);
    // @ts-expect-error testing invalid runtime types
    expect(() => storageService.resolveSecurePath('')).toThrow(/Invalid fileKey/i);
  });

  it('5. Allows legitimate keys within the storage sandbox', () => {
    const validKey = 'resources/0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef.pdf';
    const resolved = storageService.resolveSecurePath(validKey);
    expect(resolved).toContain('uploads');
    expect(resolved).toContain('.pdf');
  });
});
