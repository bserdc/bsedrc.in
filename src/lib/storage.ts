/**
 * Cloudflare R2 Storage Client Helper
 * Centralized client for Cloudflare R2 Object Storage
 * All files (profile photos, gallery images, certificates, form attachments)
 * are stored strictly in Cloudflare R2.
 */

export interface UploadOptions {
  category?: 'profile' | 'gallery' | 'certificates' | 'forms' | 'documents';
  preferredFileName?: string;
  isPrivate?: boolean;
}

export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  signedUrl?: string;
  isPrivate: boolean;
  category: string;
  provider: string;
  sizeBytes?: number;
  message?: string;
}

/**
 * Uploads a file to Cloudflare R2 Object Storage via the server /api/storage/upload endpoint.
 * Credentials remain strictly server-side.
 */
export async function uploadToCloudflareR2(
  fileInput: File | Blob | string,
  optionsOrPreferredName?: string | UploadOptions
): Promise<UploadResult> {
  const options: UploadOptions = typeof optionsOrPreferredName === 'string'
    ? { preferredFileName: optionsOrPreferredName }
    : (optionsOrPreferredName || {});

  let fileData: string;
  let fileName = options.preferredFileName || `upload_${Date.now()}`;
  let contentType = 'application/octet-stream';

  if (typeof fileInput === 'string') {
    fileData = fileInput;
    if (fileData.startsWith('data:image/jpeg')) contentType = 'image/jpeg';
    else if (fileData.startsWith('data:image/png')) contentType = 'image/png';
    else if (fileData.startsWith('data:image/webp')) contentType = 'image/webp';
    else if (fileData.startsWith('data:application/pdf')) contentType = 'application/pdf';
  } else {
    fileName = options.preferredFileName || (fileInput as File).name || `upload_${Date.now()}`;
    contentType = fileInput.type || 'application/octet-stream';
    fileData = await fileToBase64(fileInput);
  }

  const response = await fetch('/api/storage/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName,
      fileData,
      contentType,
      category: options.category || 'documents',
      isPrivate: options.isPrivate
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Cloudflare R2 upload failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to upload to Cloudflare R2');
  }

  return {
    success: true,
    url: data.url,
    key: data.key,
    signedUrl: data.signedUrl,
    isPrivate: Boolean(data.isPrivate),
    category: data.category || options.category || 'documents',
    provider: data.provider || 'Cloudflare R2 Object Storage',
    sizeBytes: data.sizeBytes
  };
}

/**
 * Generates a signed download URL for private R2 objects (certificates, form attachments)
 */
export async function getSignedUrlFromR2(
  key: string,
  expiresInSeconds: number = 3600,
  token?: string
): Promise<string> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `/api/storage/signed-url?key=${encodeURIComponent(key)}&expiresIn=${expiresInSeconds}`,
    { headers }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to generate signed URL (${response.status})`);
  }

  const data = await response.json();
  return data.signedUrl;
}

/**
 * Deletes a file from Cloudflare R2 (Requires admin token)
 */
export async function deleteFromCloudflareR2(key: string, token: string): Promise<boolean> {
  const response = await fetch('/api/storage/file', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ key })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete from Cloudflare R2 (${response.status})`);
  }

  const data = await response.json();
  return Boolean(data.success);
}

/**
 * Checks if a file physically exists in Cloudflare R2
 */
export async function checkR2FileExists(key: string): Promise<{
  exists: boolean;
  sizeBytes?: number;
  contentType?: string;
  lastModified?: string;
}> {
  const response = await fetch(`/api/storage/verify/${encodeURIComponent(key)}`);
  if (!response.ok) {
    return { exists: false };
  }
  return response.json();
}

/**
 * Fetches status of Cloudflare R2 Storage integration
 */
export async function getR2StorageStatus(): Promise<{
  success: boolean;
  cloudflareR2Available: boolean;
  bucketName: string;
  storageType: string;
  publicUrlConfigured: boolean;
  publicBaseUrl: string;
}> {
  const response = await fetch('/api/storage/status');
  if (!response.ok) {
    throw new Error('Failed to query storage status');
  }
  return response.json();
}

/**
 * Helper to convert Blob/File to Base64
 */
function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
