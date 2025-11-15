'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUploadContext } from '@/contexts/upload-context'
import { useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface FileUploadState {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
}

export function FileUploader() {
  const [localUploads, setLocalUploads] = useState<FileUploadState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragOverRef = useRef(false)
  const { addUpload, updateUpload } = useUploadContext()
  const { getToken } = useAuth()

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'application/json',
      'text/csv',
    ]
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload JPG, PNG, JSON, or CSV files.',
      }
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Your file is ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`,
      }
    }

    return { valid: true }
  }

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
            const response = JSON.parse(xhr.responseText)
            updateUpload(uploadId, {
              status: 'success',
              progress: 100,
            })
            // Remove from local state after success
            setLocalUploads((prev) => prev.filter((u) => u.id !== uploadId))
          } else {
            const response = JSON.parse(xhr.responseText)
            updateUpload(uploadId, {
              status: 'error',
              error: response.error || 'Upload failed',
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
      } catch (error) {
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
      const newUploads: FileUploadState[] = []

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
          newUploads.push({
            id,
            file,
            status: 'error',
            error: validation.error,
          })
        } else {
          const uploadState: FileUploadState = {
            id,
            file,
            status: 'pending',
          }
          newUploads.push(uploadState)
        }
      })

      setLocalUploads((prev) => [...prev, ...newUploads])

      // Upload all valid files
      newUploads.forEach((upload) => {
        if (upload.status === 'pending') {
          uploadFile(upload)
        }
      })
    },
    [uploadFile, addUpload]
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

  const removeUpload = (id: string) => {
    setLocalUploads((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
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
            <p className="font-semibold text-foreground">
              Drag and drop your files here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse
            </p>
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
            if (e.target.files) {
              handleFiles(e.target.files)
            }
          }}
        />
      </Card>

      {/* Local Upload Queue - for validation feedback */}
      {/* {localUploads.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Queue</h2>
          <div className="space-y-2">
            {localUploads.map((upload) => (
              <Card key={upload.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {upload.error && (
                    <p className="text-xs text-destructive mt-1">
                      {upload.error}
                    </p>
                  )}
                  {upload.status === 'uploading' && (
                    <div className="relative h-2 w-full rounded-full bg-secondary mt-2">
                      <div
                        className={cn(
                          'h-full rounded-full bg-primary transition-all',
                          upload.progress === 100 && 'bg-green-500'
                        )}
                        style={{ width: `${upload.progress}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
                        {upload.progress}%
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUpload(upload.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

