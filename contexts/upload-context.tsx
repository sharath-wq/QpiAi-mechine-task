'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Upload {
  id: string
  fileName: string
  fileSize: number
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadContextType {
  uploads: Upload[]
  addUpload: (upload: Upload) => void
  updateUpload: (id: string, updates: Partial<Upload>) => void
  removeUpload: (id: string) => void
  clearUploads: () => void
  clearSuccessful: () => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Upload[]>([])

  const addUpload = (upload: Upload) => {
    setUploads((prev) => [...prev, upload])
  }

  const updateUpload = (id: string, updates: Partial<Upload>) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    )
  }

  const removeUpload = (id:string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  const clearUploads = () => {
    setUploads([])
  }

  const clearSuccessful = () => {
    setUploads((prev) => prev.filter((u) => u.status !== 'success'))
  }

  return (
    <UploadContext.Provider
      value={{
        uploads,
        addUpload,
        updateUpload,
        removeUpload,
        clearUploads,
        clearSuccessful,
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export function useUploadContext() {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error('useUploadContext must be used within UploadProvider')
  }
  return context
}
