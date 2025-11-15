import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// File validation constants
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.json', '.csv']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Malware signature detection (basic implementation)
const MALWARE_SIGNATURES = [
  'EICAR',
  'X5O!P%@AP',
  // Common malicious patterns
  'eval(',
  'system(',
  'exec(',
]

/**
 * Check if file contains malware signatures
 */
async function scanForMalware(buffer: Buffer): Promise<boolean> {
  const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 10000))

  for (const signature of MALWARE_SIGNATURES) {
    if (content.includes(signature)) {
      return true
    }
  }

  return false
}

/**
 * Validate file type by extension
 */
function validateFileExtension(filename: string): boolean {
  const extension = `.${filename.split('.').pop()?.toLowerCase()}`
  return SUPPORTED_FORMATS.includes(extension)
}

/**
 * Get Cloudinary resource type from filename
 */
function getResourceType(filename: string): 'image' | 'raw' {
  const extension = `.${filename.split('.').pop()?.toLowerCase()}`
  if (['.jpg', '.jpeg', '.png'].includes(extension)) {
    return 'image'
  }
  return 'raw'
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file extension
    if (!validateFileExtension(file.name)) {
      return NextResponse.json(
        {
          error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(
            ', '
          )}`,
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Scan for malware signatures
    const isMalicious = await scanForMalware(buffer)
    if (isMalicious) {
      return NextResponse.json(
        {
          error: 'File contains potentially malicious content and was rejected',
        },
        { status: 400 }
      )
    }

    // Get resource type for Cloudinary
    const resource_type = getResourceType(file.name)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type,
          context: { userId },
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        url: (uploadResult as any).secure_url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    )
  }
}
