import { FileUploader } from '@/components/file-uploader'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">File Upload Manager</h1>
          <p className="text-muted-foreground mb-8">
            Upload files securely with real-time progress tracking
          </p>
          <FileUploader />
        </div>
      </div>
    </main>
  )
}
