'use client'

import { useState, useEffect } from 'react'
import { Bell, ChevronDown, X } from 'lucide-react'
import { useUploadContext } from '@/contexts/upload-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function UploadNotification() {
  const { uploads, removeUpload, clearSuccessful } = useUploadContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    if (uploads.length > 0) {
      setIsClosed(false)
    }
  }, [uploads])

  const activeCount = uploads.filter(
    (u) => u.status === 'uploading' || u.status === 'pending'
  ).length
  const successCount = uploads.filter((u) => u.status === 'success').length
  const errorCount = uploads.filter((u) => u.status === 'error').length
  const totalProgress =
    uploads.length > 0
      ? Math.round(
          uploads.reduce((sum, u) => sum + u.progress, 0) / uploads.length
        )
      : 0

  if (uploads.length === 0 || isClosed) return null

  const hasErrors = errorCount > 0
  const isProcessing = activeCount > 0

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm px-4">
      <Card className="border shadow-lg">
        <div className="w-full p-4 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center justify-between hover:bg-secondary/50 transition-colors px-0 py-0"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-primary" />
                {activeCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {activeCount}
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">
                  {activeCount > 0
                    ? `Uploading ${activeCount} file${
                        activeCount !== 1 ? 's' : ''
                      }`
                    : `${uploads.length} file${
                        uploads.length !== 1 ? 's' : ''
                      } uploaded`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isProcessing
                    ? `${totalProgress}% complete`
                    : successCount > 0
                    ? `${successCount} successful${
                        errorCount > 0 ? `, ${errorCount} failed` : ''
                      }`
                    : ''}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-2 shrink-0"
            onClick={() => setIsClosed(true)}
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {isExpanded && (
          <div className="border-t max-h-96 overflow-y-auto">
            <div className="p-3 space-y-2">
              {uploads.map((upload) => {
                return (
                  <div
                    key={upload.id}
                    className="flex items-start gap-2 p-2 hover:bg-secondary/50 rounded transition-colors"
                  >
                    <div className="flex-1 min-w-0 grow">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-medium truncate">
                          {upload.fileName}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 shrink-0"
                          onClick={() => removeUpload(upload.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>

                      {upload.status === 'uploading' && (
                        <div className="mt-1.5">
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-primary mt-1">
                            {upload.progress}%
                          </p>
                        </div>
                      )}

                      {upload.status === 'success' && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed
                        </p>
                      )}

                      {upload.status === 'error' && (
                        <p className="text-xs text-destructive mt-1">
                          {upload.error}
                        </p>
                      )}

                      {upload.status === 'pending' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Queued
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {successCount > 0 && !isProcessing && (
              <div className="border-t p-2 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearSuccessful}
                  className="text-xs"
                >
                  Clear Completed
                </Button>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="border-t px-4 py-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
