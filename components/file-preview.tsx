import Image from "next/image"
import { FileIcon, FileJson, FileSpreadsheet } from "lucide-react"

interface FilePreviewProps {
  file: {
    filename: string
    url: string
    resource_type: string
  }
  content: string | null
}

const getFileType = (filename: string) => {
  const ext = `.${filename.split(".").pop()?.toLowerCase()}`
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
    return "image"
  }
  if (ext === ".json") {
    return "json"
  }
  if (ext === ".csv") {
    return "csv"
  }
  return "other"
}

export function FilePreview({ file, content }: FilePreviewProps) {
  const fileType = getFileType(file.filename)

  /** ---------------- IMAGE PREVIEW ---------------- */
  if (fileType === "image") {
    return (
      <div className="w-full h-32 mb-2 rounded-md relative overflow-hidden">
        <Image
          src={file.url}
          alt={file.filename}
          fill
          className="object-cover rounded-md"
        />
      </div>
    )
  }

  /** ---------------- JSON PREVIEW ---------------- */
  if (fileType === "json" && content) {
    try {
      const jsonContent = JSON.parse(content)
      return (
        <div className="w-full h-32 overflow-auto text-left bg-gray-100 dark:bg-gray-800 rounded-md mb-2 p-2">
          <pre className="text-xs">{JSON.stringify(jsonContent, null, 2)}</pre>
        </div>
      )
    } catch {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2">
          <FileJson className="h-16 w-16 text-gray-400" />
        </div>
      )
    }
  }

  /** ---------------- CSV PREVIEW ---------------- */
  if (fileType === "csv" && content) {
    const rows = content.split("\n").slice(0, 5)
    return (
      <div className="w-full h-32 overflow-auto text-left bg-gray-100 dark:bg-gray-800 rounded-md mb-2 p-2">
        <table className="w-full text-xs table-auto">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.split(",").map((cell, j) => (
                  <td
                    key={j}
                    className="p-1 border border-gray-300 dark:border-gray-700 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  /** ---------------- GENERIC FILE PREVIEW ---------------- */
  let Icon = FileIcon
  if (fileType === "json") Icon = FileJson
  if (fileType === "csv") Icon = FileSpreadsheet

  return (
    <div className="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md mb-2">
      <Icon className="h-16 w-16 text-gray-400" />
    </div>
  )
}
