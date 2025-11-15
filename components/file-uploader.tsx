'use client'

import { useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUploadContext } from '@/contexts/upload-context'
import { useAuth } from '@clerk/nextjs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface FileUploadState {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
}

interface UploadUpdatePayload {
  status?: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  url?: string
  error?: string
  fileName?: string
  fileSize?: number
}

const getFileType = (filename: string): 'image' | 'raw' => {
  const ext = `.${filename.split('.').pop()?.toLowerCase()}`
  return ['.jpg', '.jpeg', '.png'].includes(ext) ? 'image' : 'raw'
}

export function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragOverRef = useRef(false)
  const { addUpload, updateUpload } = useUploadContext()
  const { getToken } = useAuth()

  const validateFile = useCallback((file: File) => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/json', 'text/csv']

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload JPG, PNG, JSON, or CSV files.',
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB`,
      }
    }

    return { valid: true }
  }, [])

  const uploadFile = useCallback(
    async (fileUpload: FileUploadState) => {
      const uploadId = fileUpload.id
      const file = fileUpload.file

      try {
        addUpload({
          id: uploadId,
          fileName: file.name,
          fileSize: file.size,
          progress: 0,
          status: 'uploading',
        })

        const token = await getToken()
        const resourceType = getFileType(file.name)

        const signatureResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            resource_type: resourceType,
          }),
        })

        if (!signatureResponse.ok) {
          const err = await signatureResponse.json()
          throw new Error(err.error || 'Failed to get upload signature')
        }

        const {
          signature,
          timestamp,
          cloudname,
          api_key,
          public_id,
          folder,
        }: {
          signature: string
          timestamp: number
          cloudname: string
          api_key: string
          public_id: string
          folder: string
        } = await signatureResponse.json()

        const cloudinaryFormData = new FormData()
        cloudinaryFormData.append('file', file)
        cloudinaryFormData.append('api_key', api_key)
        cloudinaryFormData.append('timestamp', timestamp.toString())
        cloudinaryFormData.append('signature', signature)
        cloudinaryFormData.append('public_id', public_id)
        cloudinaryFormData.append('folder', folder)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            updateUpload(uploadId, { progress })
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            updateUpload(uploadId, {
              status: 'success',
              progress: 100,
              url: response.secure_url,
            } as UploadUpdatePayload)
          } else {
            const errorResponse = JSON.parse(xhr.responseText)
            updateUpload(uploadId, {
              status: 'error',
              error: errorResponse.error?.message || 'Cloudinary upload failed',
            })
          }
        })

        xhr.addEventListener('error', () => {
          updateUpload(uploadId, {
            status: 'error',
            error: 'Network error during direct Cloudinary upload',
          })
        })

        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${cloudname}/${resourceType}/upload`
        )
        xhr.send(cloudinaryFormData)
      } catch (err) {
        updateUpload(uploadId, {
          status: 'error',
          error: err instanceof Error ? err.message : 'Unexpected upload error',
        })
      }
    },
    [addUpload, updateUpload, getToken]
  )

  const handleFiles = useCallback(
    (files: FileList) => {
      Array.from(files).forEach((file) => {
        const validation = validateFile(file)
        const id = Math.random().toString(36).substr(2, 9)

        if (!validation.valid) {
          addUpload({
            id,
            fileName: file.name,
            fileSize: file.size,
            progress: 0,
            status: 'error',
            error: validation.error,
          })
        } else {
          uploadFile({
            id,
            file,
            status: 'pending',
          })
        }
      })
    },
    [uploadFile, addUpload, validateFile]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = true
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = false
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = false

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className="border-2 border-dashed border-border hover:border-primary/50 
        transition-colors cursor-pointer p-8"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-semibold text-foreground">Drag and drop your files here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, JSON, CSV • Max 10MB per file
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.json,.csv"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
          }}
        />
      </Card>
    </div>
  )
}
