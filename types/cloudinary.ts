export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  created_at: string; // e.g., "2023-10-27T10:00:00Z"
  tags: string[];
  bytes: number;
  type: 'upload' | 'private' | 'authenticated';
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  api_key: string;
  // Depending on the upload options, other fields might be present:
  pages?: number; // For multi-page documents like PDFs
  is_animated?: boolean; // For GIFs
  frame_rate?: number; // For videos
  duration?: number; // For videos
  rotation?: number;
  // If eager transformations are applied
  eager?: Array<{
    transformation: string;
    width: number;
    height: number;
    url: string;
    secure_url: string;
  }>;
  // If moderation is enabled
  moderation?: Array<{
    status: 'pending' | 'approved' | 'rejected';
    kind: string;
    response?: unknown;
  }>;
  // If accessibility analysis is enabled
  accessibility_analysis?: {
    color_info: Array<Array<number>>; // e.g., [[r, g, b, percentage], ...]
    // ... other analysis data
  };
  // If image metadata is extracted
  image_metadata?: {
    Make?: string;
    Model?: string;
    // ... other EXIF/IPTC data
  };
  // If colors are extracted
  colors?: Array<Array<string | number>>; // e.g., [["#RRGGBB", percentage], ...]
}

export interface CloudinaryResource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  type: 'upload' | 'private' | 'authenticated';
  created_at: string; // ISO 8601 format
  bytes: number;
  width: number;
  height: number;
  url: string; // HTTP URL
  secure_url: string; // HTTPS URL
  tags: string[];
  context?: {
    [key: string]: string;
  };
  metadata?: {
    [key: string]: string;
  };
  access_mode: 'public' | 'authenticated';
  access_control?: unknown[]; // Depending on specific access control settings
  etag: string;
  placeholder: boolean;
  colors?: string[][];
  pages?: number; // For multi-page resources like PDFs
  is_animated?: boolean; // For images/videos
  is_web_optimized?: boolean; // For images/videos
  // Add other fields as needed based on specific API calls and options
}
