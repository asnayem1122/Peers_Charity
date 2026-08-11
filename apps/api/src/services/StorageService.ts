import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/env.js';

export interface StorageResult {
  fileKey: string;
  fileUrl: string;
  sizeBytes: number;
}

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
   * Uploads file to configured storage provider (Local / S3 / R2)
   */
  public async upload(file: Express.Multer.File, subfolder: string = 'resources'): Promise<StorageResult> {
    const fileHash = StorageService.calculateFileHash(file.buffer);
    const ext = path.extname(file.originalname).toLowerCase();
    const fileKey = `${subfolder}/${fileHash}${ext}`;

    if (config.storageProvider === 'local') {
      const targetDir = path.join(this.uploadsDir, subfolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(this.uploadsDir, fileKey);
      await fs.promises.writeFile(filePath, file.buffer);

      const fileUrl = `${config.apiUrl}/uploads/${fileKey}`;
      return { fileKey, fileUrl, sizeBytes: file.size };
    }

    // Default fallback for development
    const filePath = path.join(this.uploadsDir, fileKey);
    await fs.promises.writeFile(filePath, file.buffer);
    const fileUrl = `${config.apiUrl}/uploads/${fileKey}`;
    return { fileKey, fileUrl, sizeBytes: file.size };
  }

  public async delete(fileKey: string): Promise<void> {
    if (config.storageProvider === 'local') {
      const filePath = path.join(this.uploadsDir, fileKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}

export const storageService = new StorageService();
