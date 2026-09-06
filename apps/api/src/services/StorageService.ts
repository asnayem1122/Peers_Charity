import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/env.js';

export interface StorageResult {
  fileKey: string;
  fileUrl: string;
  sizeBytes: number;
}

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.doc',
  '.pptx',
  '.ppt',
  '.zip',
  '.png',
  '.jpg',
  '.jpeg',
  '.txt',
  '.c',
  '.cpp',
  '.py',
  '.java',
  '.h',
  '.js',
  '.ts',
]);

export class StorageService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Generates SHA-256 cryptographic hash of a file buffer
   */
  public static calculateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Resolves a key safely within the uploads directory, strictly prohibiting path traversal
   */
  public resolveSecurePath(relativeKey: string): string {
    if (!relativeKey || typeof relativeKey !== 'string') {
      throw new Error('Security Error: Invalid fileKey');
    }

    // Block null bytes and control characters
    if (/\0/.test(relativeKey)) {
      throw new Error('Security Error: Null byte injection detected');
    }

    // Check for explicit path traversal patterns
    if (relativeKey.includes('..') || path.isAbsolute(relativeKey)) {
      throw new Error('Security Error: Path traversal attempt detected');
    }

    const resolvedPath = path.resolve(this.uploadsDir, relativeKey);
    const normalizedUploadsDir = path.resolve(this.uploadsDir);

    if (!resolvedPath.startsWith(normalizedUploadsDir + path.sep)) {
      throw new Error('Security Error: Path traversal attempt detected');
    }

    return resolvedPath;
  }

  /**
   * Uploads file to configured storage provider (Local / S3 / R2) with extension whitelist
   */
  public async upload(file: Express.Multer.File, subfolder: string = 'resources'): Promise<StorageResult> {
    // Sanitize subfolder against traversal
    const safeSubfolder = subfolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'resources';
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new Error(`Forbidden file extension: "${ext}". Permitted types: PDF, DOCX, PPTX, ZIP, PNG, JPG.`);
    }

    const fileHash = StorageService.calculateFileHash(file.buffer);
    const fileKey = `${safeSubfolder}/${fileHash}${ext}`;

    const filePath = this.resolveSecurePath(fileKey);
    const targetDir = path.dirname(filePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, file.buffer);
    const fileUrl = `${config.apiUrl}/uploads/${fileKey}`;
    return { fileKey, fileUrl, sizeBytes: file.size };
  }

  public async delete(fileKey: string): Promise<void> {
    if (config.storageProvider === 'local') {
      const filePath = this.resolveSecurePath(fileKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}

export const storageService = new StorageService();
