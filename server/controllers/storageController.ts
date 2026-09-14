import { Request, Response } from 'express';
import { storageService, StorageCategory } from '../services/storageService';
import { verifyAdminToken } from '../services/authService';
import { config } from '../config';

export class StorageController {
  /**
   * Helper to check authentication for private files
   */
  private isAuthorized(req: Request): boolean {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader) {
      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token.trim();
    }

    if (!token) return false;
    const user = verifyAdminToken(token);
    return !!user;
  }

  /**
   * POST /api/storage/upload
   * Centralized Cloudflare R2 upload for:
   * - Profile photos (public)
   * - Gallery images (public)
   * - Certificates (private)
   * - Form submissions & attachments (private)
   */
  public async upload(req: Request, res: Response): Promise<void> {
    const { fileName, fileData, contentType, category, isPrivate, customKey } = req.body;

    if (!fileName || !fileData) {
      res.status(400).json({
        success: false,
        message: 'fileName and fileData (base64 string or buffer) are required.'
      });
      return;
    }

    try {
      const result = await storageService.uploadFile({
        fileName,
        fileData,
        contentType,
        category: category as StorageCategory,
        isPrivate: typeof isPrivate === 'boolean' ? isPrivate : undefined,
        customKey
      });

      res.status(201).json(result);
    } catch (err: any) {
      console.error('[R2 UPLOAD ERROR]', err);
      res.status(500).json({
        success: false,
        message: err.message || 'File upload to Cloudflare R2 failed'
      });
    }
  }

  /**
   * GET /api/storage/file/:key(*)
   * Download / Stream file from Cloudflare R2
   * Protects private files (certificates, forms, documents)
   */
  public async getFile(req: Request, res: Response): Promise<void> {
    const rawKey = req.params.key || (req.query.key as string);
    if (!rawKey) {
      res.status(400).json({ success: false, message: 'File key is required.' });
      return;
    }

    const key = decodeURIComponent(rawKey);

    // Determine privacy based on prefix
    const isPrivate = key.startsWith('certificates/') || 
                      key.startsWith('forms/') || 
                      key.startsWith('documents/');

    // Check authorization for private files
    if (isPrivate && !this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access to private documents and certificates in Cloudflare R2 requires authentication.'
      });
      return;
    }

    try {
      const { exists } = await storageService.checkFileExists(key);
      if (!exists) {
        res.status(404).json({
          success: false,
          error: 'NotFound',
          message: `Object with key '${key}' does not exist in Cloudflare R2 bucket '${storageService.getBucketName()}'.`
        });
        return;
      }

      const fileObj = await storageService.getFileObject(key);
      
      res.setHeader('Content-Type', fileObj.contentType);
      if (fileObj.contentLength) {
        res.setHeader('Content-Length', fileObj.contentLength);
      }
      if (fileObj.lastModified) {
        res.setHeader('Last-Modified', fileObj.lastModified.toUTCString());
      }
      
      // Inline display for images, attachment download for certificates/documents
      const ext = key.split('.').pop()?.toLowerCase() || '';
      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
      res.setHeader('Content-Disposition', isImg ? 'inline' : `attachment; filename="${key.split('/').pop()}"`);

      fileObj.stream.pipe(res);
    } catch (err: any) {
      console.error('[R2 GET FILE ERROR]', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to retrieve file from Cloudflare R2'
      });
    }
  }

  /**
   * GET /api/storage/signed-url
   * Generate time-limited presigned URL for private R2 objects
   */
  public async getSignedUrl(req: Request, res: Response): Promise<void> {
    const rawKey = (req.query.key as string) || '';
    if (!rawKey) {
      res.status(400).json({ success: false, message: 'Query parameter "key" is required.' });
      return;
    }

    const key = decodeURIComponent(rawKey);
    const isPrivate = key.startsWith('certificates/') || 
                      key.startsWith('forms/') || 
                      key.startsWith('documents/');

    if (isPrivate && !this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Generating signed URLs for private objects requires authentication.'
      });
      return;
    }

    try {
      const expiresIn = req.query.expiresIn ? Math.min(Number(req.query.expiresIn), 604800) : 3600;
      const signedUrl = await storageService.getSignedDownloadUrl(key, expiresIn);

      res.json({
        success: true,
        key,
        signedUrl,
        expiresInSeconds: expiresIn
      });
    } catch (err: any) {
      console.error('[R2 SIGNED URL ERROR]', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to generate signed URL'
      });
    }
  }

  /**
   * DELETE /api/storage/file
   * Delete object from Cloudflare R2 (Admin protected)
   */
  public async deleteFile(req: Request, res: Response): Promise<void> {
    const rawKey = req.body.key || (req.query.key as string) || req.params.key;
    if (!rawKey) {
      res.status(400).json({ success: false, message: 'File key is required for deletion.' });
      return;
    }

    const key = decodeURIComponent(rawKey);

    // Require admin authentication for deletion
    if (!this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Deleting files from Cloudflare R2 requires admin authentication.'
      });
      return;
    }

    try {
      const existsResult = await storageService.checkFileExists(key);
      if (!existsResult.exists) {
        res.status(404).json({
          success: false,
          message: `File '${key}' was not found in Cloudflare R2 bucket.`
        });
        return;
      }

      await storageService.deleteFile(key);

      res.json({
        success: true,
        message: `File '${key}' successfully deleted from Cloudflare R2.`,
        key
      });
    } catch (err: any) {
      console.error('[R2 DELETE ERROR]', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to delete file from Cloudflare R2'
      });
    }
  }

  /**
   * GET /api/storage/verify/:key(*)
   * Check physical existence of file in R2
   */
  public async verifyFile(req: Request, res: Response): Promise<void> {
    const rawKey = req.params.key || (req.query.key as string);
    if (!rawKey) {
      res.status(400).json({ success: false, message: 'File key is required.' });
      return;
    }

    const key = decodeURIComponent(rawKey);

    try {
      const check = await storageService.checkFileExists(key);
      res.json({
        success: true,
        key,
        bucket: storageService.getBucketName(),
        exists: check.exists,
        sizeBytes: check.sizeBytes,
        contentType: check.contentType,
        lastModified: check.lastModified
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Verification check failed'
      });
    }
  }

  /**
   * GET /api/storage/status
   */
  public async getStatus(req: Request, res: Response): Promise<void> {
    const isConfigured = storageService.isCloudflareConfigured();
    res.json({
      success: true,
      cloudflareR2Available: isConfigured,
      bucketName: storageService.getBucketName(),
      storageType: 'Cloudflare R2 Object Storage',
      publicUrlConfigured: !!config.cloudflareR2.publicUrl,
      publicBaseUrl: config.cloudflareR2.publicUrl || ''
    });
  }

  /**
   * GET /api/storage/list
   * Admin-only object listing in R2
   */
  public async list(req: Request, res: Response): Promise<void> {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ success: false, error: 'Unauthorized', message: 'Admin authentication required.' });
      return;
    }

    try {
      const prefix = req.query.prefix as string | undefined;
      const maxKeys = req.query.maxKeys ? Number(req.query.maxKeys) : 100;
      const objects = await storageService.listObjects(prefix, maxKeys);

      res.json({
        success: true,
        bucket: storageService.getBucketName(),
        count: objects.length,
        objects
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'List failed' });
    }
  }
}

export const storageController = new StorageController();
