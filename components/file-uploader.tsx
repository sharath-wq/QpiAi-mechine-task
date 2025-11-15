'use client'

import { useRef, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUploadContext } from '@/contexts/upload-context'
import { useAuth } from '@clerk/nextjs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB limit

interface FileUploadState {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
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
        error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      }
    }

    return { valid: true }
  }, [])

  const uploadFile = useCallback(
    async (fileUpload: FileUploadState) => {
      const uploadId = fileUpload.id
      const formData = new FormData()
      formData.append('file', fileUpload.file)

      try {
        addUpload({
          id: uploadId,
          fileName: fileUpload.file.name,
          fileSize: fileUpload.file.size,
          progress: 0,
          status: 'uploading',
        })

        const token = await getToken()
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            updateUpload(uploadId, { progress })
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            updateUpload(uploadId, {
              status: 'success',
              progress: 100,
            })
          } else {
            const errorResponse = JSON.parse(xhr.responseText)
            updateUpload(uploadId, {
              status: 'error',
              error: errorResponse.error || 'Upload failed',
            })
          }
        })

        xhr.addEventListener('error', () => {
          updateUpload(uploadId, {
            status: 'error',
            error: 'Network error occurred during upload',
          })
        })

        xhr.open('POST', '/api/upload')
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send(formData)
      } catch {
        updateUpload(uploadId, {
          status: 'error',
          error: 'An unexpected error occurred',
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
        className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8"
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
