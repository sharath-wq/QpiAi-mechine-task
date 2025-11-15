import { promises as fs } from 'fs'
import path from 'path'
import { Card } from '@/components/ui/card'

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
          {files.map((file) => (
            <Card key={file} className="p-4">
              <img src={`/uploads/${file}`} alt={file} className="w-full h-32 object-cover mb-2" />
              <p className="text-sm font-medium truncate">{file}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
