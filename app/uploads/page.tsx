import { Suspense } from "react";
import { UploadedFilesContent } from "@/components/uploaded-files-content";

export default async function UploadedFilesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Uploaded Files</h1>
      <Suspense fallback={<div>Loading uploaded files...</div>}>
        <UploadedFilesContent />
      </Suspense>
    </div>
  );
}
