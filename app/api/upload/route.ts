import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// File validation constants
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.json', '.csv']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

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
 * Sanitize filename to prevent directory traversal
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^\.+/, '')
    .substring(0, 255)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file extension
    if (!validateFileExtension(file.name)) {
      return NextResponse.json(
        {
          error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
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
        { error: 'File contains potentially malicious content and was rejected' },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Sanitize and save filename with timestamp
    const sanitizedName = sanitizeFilename(file.name)
    const timestamp = Date.now()
    const finalFilename = `${timestamp}_${sanitizedName}`
    const filepath = join(UPLOAD_DIR, finalFilename)

    // Save file to disk
    await writeFile(filepath, buffer)

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        filename: finalFilename,
        url: `/uploads/${finalFilename}`,
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
