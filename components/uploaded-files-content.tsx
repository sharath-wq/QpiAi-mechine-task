import { v2 as cloudinary } from "cloudinary";
import { Card } from "@/components/ui/card";
import { FilePreview } from "@/components/file-preview";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to determine file type
const getFileType = (filename: string) => {
  const ext = `.${filename.split(".").pop()?.toLowerCase()}`;

  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
    return "image";
  }
  if (ext === ".json") return "json";
  if (ext === ".csv") return "csv";

  return "other";
};

export async function UploadedFilesContent() {
  let filesWithContent: {
    filename: string;
    url: string;
    resource_type: string;
    content: string | null;
  }[] = [];

  try {
    // Fetch both image and raw resources
    const fetchImages = cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "qpiai/",
      max_results: 500,
    });

    const fetchRaw = cloudinary.api.resources({
      resource_type: "raw",
      type: "upload",
      prefix: "qpiai/",
      max_results: 500,
    });

    const [images, raw] = await Promise.all([fetchImages, fetchRaw]);

    // Merge results
    const resources = [...images.resources, ...raw.resources];

    console.log("Fetched resources from Cloudinary:", resources);

    filesWithContent = await Promise.all(
      resources.map(async (resource: any) => {
        const url = resource.secure_url;
        const filename = url.substring(url.lastIndexOf("/") + 1);
        const fileType = getFileType(filename);

        let content: string | null = null;

        if (fileType === "json" || fileType === "csv") {
          try {
            const response = await fetch(url);
            if (response.ok) {
              content = await response.text();
            }
          } catch (fetchError) {
            console.error(
              `Failed to fetch content for ${resource.public_id}:`,
              fetchError
            );
          }
        }

        return {
          filename,
          url,
          resource_type: resource.resource_type,
          content,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching resources from Cloudinary:", error);

    return (
      <div className="text-red-500">
        Could not fetch uploaded files from Cloudinary. Please check your
        environment variables and network connection.
      </div>
    );
  }

  return (
    <>
      {filesWithContent.length === 0 ? (
        <p>No files have been uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filesWithContent.map((file) => (
            <Card
              key={file.filename}
              className="p-4 flex flex-col items-center justify-center text-center"
            >
              <FilePreview file={file} content={file.content} />

              <p className="text-sm font-medium truncate w-full mt-2">
                {file.filename}
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {getFileType(file.filename)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
