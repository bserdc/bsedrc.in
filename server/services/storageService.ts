import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  HeadObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { config } from '../config';

export type StorageCategory = 'profile' | 'gallery' | 'certificates' | 'forms' | 'documents' | string;

export interface UploadPayload {
  fileName: string;
  fileData: string | Buffer;
  contentType?: string;
  category?: StorageCategory;
  isPrivate?: boolean;
  customKey?: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  signedUrl?: string;
  isPrivate: boolean;
  category: string;
  provider: string;
  sizeBytes: number;
  contentType: string;
}

export class StorageService {
  private r2Client: S3Client | null = null;
  private bucketName: string;

  constructor() {
    this.bucketName = config.cloudflareR2.bucketName || 'bsedrc';
    this.initR2();
  }

  private initR2(): void {
    if (config.cloudflareR2.isConfigured) {
      try {
        this.r2Client = new S3Client({
          region: 'auto',
          endpoint: `https://${config.cloudflareR2.accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: config.cloudflareR2.accessKeyId,
            secretAccessKey: config.cloudflareR2.secretAccessKey
          }
        });
      } catch (err) {
        console.warn('[STORAGE] Cloudflare R2 init warning:', err);
      }
    }
  }

  public isCloudflareConfigured(): boolean {
    return !!this.r2Client;
  }

  public getBucketName(): string {
    return this.bucketName;
  }

  /**
   * Determine storage category directory prefix
   */
  private getCategoryPrefix(category?: string): { prefix: string; defaultPrivate: boolean } {
    const cat = (category || 'documents').toLowerCase();
    switch (cat) {
      case 'profile':
      case 'profiles':
        return { prefix: 'profiles/', defaultPrivate: false };
      case 'gallery':
        return { prefix: 'gallery/', defaultPrivate: false };
      case 'certificate':
      case 'certificates':
        return { prefix: 'certificates/', defaultPrivate: true };
      case 'form':
      case 'forms':
      case 'form_submissions':
        return { prefix: 'forms/', defaultPrivate: true };
      default:
        return { prefix: 'documents/', defaultPrivate: true };
    }
  }

  /**
   * Centralized upload to Cloudflare R2 Object Storage
   * Supports: profile photos, gallery images, certificates, form attachments
   */
  public async uploadFile(payload: UploadPayload): Promise<UploadResult> {
    if (!this.r2Client) {
      throw new Error('Cloudflare R2 Object Storage is not initialized or configured. Check R2 credentials.');
    }

    const { fileName, fileData, contentType, category = 'documents', customKey } = payload;
    if (!fileName || !fileData) {
      throw new Error('Missing required fileName or fileData for Cloudflare R2 upload.');
    }

    // Convert to Buffer
    let buffer: Buffer;
    let detectedMime = contentType || 'application/octet-stream';

    if (Buffer.isBuffer(fileData)) {
      buffer = fileData;
    } else if (typeof fileData === 'string') {
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = contentType || match[1];
        buffer = Buffer.from(match[2], 'base64');
      } else {
        buffer = Buffer.from(fileData, 'base64');
      }
    } else {
      throw new Error('Unsupported fileData type. Expected base64 string or Buffer.');
    }

    const sizeBytes = buffer.length;
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB max for portal documents and images
    if (sizeBytes > MAX_SIZE) {
      throw new Error(`File size (${(sizeBytes / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed size of 10MB.`);
    }

    // Determine category and privacy settings
    const { prefix, defaultPrivate } = this.getCategoryPrefix(category);
    const isPrivate = payload.isPrivate !== undefined ? payload.isPrivate : defaultPrivate;

    // Detect and validate MIME type from extension
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported file format '.${ext}'. Only PDF documents and JPG, PNG, WEBP images are permitted.`);
    }

    if (['jpg', 'jpeg'].includes(ext)) detectedMime = 'image/jpeg';
    else if (ext === 'png') detectedMime = 'image/png';
    else if (ext === 'webp') detectedMime = 'image/webp';
    else if (ext === 'pdf') detectedMime = 'application/pdf';

    const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!ALLOWED_MIMES.includes(detectedMime)) {
      throw new Error(`File MIME type '${detectedMime}' is not permitted. Only PDF documents and standard web images are allowed.`);
    }

    // Path traversal defense & safe unique object key generation
    const cleanBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const sanitizedKey = `${prefix}${Date.now()}_${cleanBaseName}.${ext}`;

    // Upload to Cloudflare R2
    await this.r2Client.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: sanitizedKey,
      Body: buffer,
      ContentType: detectedMime,
      Metadata: {
        category,
        isPrivate: String(isPrivate),
        originalName: encodeURIComponent(fileName.slice(0, 100))
      }
    }));

    // Construct URLs
    let publicUrl = '';
    let signedUrl = '';

    if (!isPrivate) {
      publicUrl = config.cloudflareR2.publicUrl
        ? `${config.cloudflareR2.publicUrl.replace(/\/$/, '')}/${sanitizedKey}`
        : `https://${this.bucketName}.r2.cloudflarestorage.com/${sanitizedKey}`;
    } else {
      // Generate initial secure signed download URL valid for 15 minutes (900s)
      signedUrl = await this.getSignedDownloadUrl(sanitizedKey, 900);
    }

    return {
      success: true,
      url: isPrivate ? `/api/storage/file/${encodeURIComponent(sanitizedKey)}` : publicUrl,
      key: sanitizedKey,
      signedUrl: isPrivate ? signedUrl : undefined,
      isPrivate,
      category,
      provider: 'Cloudflare R2 Object Storage',
      sizeBytes,
      contentType: detectedMime
    };
  }

  /**
   * Generates a time-limited presigned URL for private R2 objects (max 900s / 15 mins)
   */
  public async getSignedDownloadUrl(key: string, expiresInSeconds: number = 900): Promise<string> {
    if (!this.r2Client) {
      throw new Error('Cloudflare R2 client is not initialized.');
    }
    // Strict max expiration: 15 minutes
    const effectiveExpiry = Math.min(Math.max(expiresInSeconds, 60), 900);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    return getSignedUrl(this.r2Client, command, { expiresIn: effectiveExpiry });
  }

  /**
   * Check if a file physically exists in Cloudflare R2
   */
  public async checkFileExists(key: string): Promise<{
    exists: boolean;
    sizeBytes?: number;
    contentType?: string;
    lastModified?: Date;
    metadata?: Record<string, string>;
  }> {
    if (!this.r2Client) {
      return { exists: false };
    }
    try {
      const response = await this.r2Client.send(new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }));
      return {
        exists: true,
        sizeBytes: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata
      };
    } catch (err: any) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }
      throw err;
    }
  }

  /**
   * Get object stream and metadata from Cloudflare R2
   */
  public async getFileObject(key: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength: number;
    lastModified?: Date;
  }> {
    if (!this.r2Client) {
      throw new Error('Cloudflare R2 client is not initialized.');
    }
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    const response = await this.r2Client.send(command);
    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || 'application/octet-stream',
      contentLength: response.ContentLength || 0,
      lastModified: response.LastModified
    };
  }

  /**
   * Delete an object from Cloudflare R2
   */
  public async deleteFile(key: string): Promise<{ success: boolean; key: string }> {
    if (!this.r2Client) {
      throw new Error('Cloudflare R2 client is not initialized.');
    }
    await this.r2Client.send(new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key
    }));
    return { success: true, key };
  }

  /**
   * List objects in Cloudflare R2 by prefix
   */
  public async listObjects(prefix?: string, maxKeys: number = 100): Promise<Array<{
    key: string;
    size?: number;
    lastModified?: Date;
  }>> {
    if (!this.r2Client) {
      return [];
    }
    const response = await this.r2Client.send(new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys
    }));
    return (response.Contents || []).map(item => ({
      key: item.Key || '',
      size: item.Size,
      lastModified: item.LastModified
    }));
  }
}

export const storageService = new StorageService();
