import { promises as fs } from 'fs'
import path from 'path'
import { Card } from '@/components/ui/card'
import { FileIcon } from 'lucide-react'

// Helper function to determine file type
const getFileType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'image'
  }
  if (ext === '.json') {
    return 'json'
  }
  if (ext === '.csv') {
    return 'csv'
  }
  return 'other'
}

export default async function UploadedFilesPage() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  let files: string[] = []

  try {
    files = await fs.readdir(uploadsDir)
  } catch (error) {
    console.error('Error reading uploads directory:', error)
    // Handle the case where the directory doesn't exist or there's a permission issue
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Uploaded Files</h1>
        <p className="text-red-500">Could not read the uploads directory. It may not exist yet.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Uploaded Files</h1>
      {files.length === 0 ? (
        <p>No files have been uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => {
            const fileType = getFileType(file)
            return (
              <Card key={file} className="p-4 flex flex-col items-center justify-center text-center">
                {fileType === 'image' ? (
                  <img src={`/uploads/${file}`} alt={file} className="w-full h-32 object-cover mb-2 rounded-md" />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2">
                    <FileIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <p className="text-sm font-medium truncate w-full">{file}</p>
                <p className="text-xs text-gray-500 capitalize">{fileType}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
