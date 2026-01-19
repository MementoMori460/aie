import { storagePut } from "./storage";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";

export interface UploadResult {
  fileKey: string;
  url: string;
  localPath: string;
}

/**
 * Upload PDF file from base64 string to persistent local storage
 */
export async function uploadPdfFromBase64(base64Data: string, filename: string): Promise<UploadResult> {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Sanitize filename to prevent directory traversal
    const safeFilename = basename(filename);

    // Generate unique file key
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `pdf-uploads/${timestamp}-${randomSuffix}-${safeFilename}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "uploads");

    // Create directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      try {
        mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created uploads directory at: ${uploadsDir}`);
      } catch (mkdirError) {
        console.error(`Failed to create uploads directory at ${uploadsDir}:`, mkdirError);
        throw new Error(`Upload dizini oluşturulamadı: ${mkdirError instanceof Error ? mkdirError.message : String(mkdirError)}`);
      }
    }

    // Save to local persistent file
    const localPath = join(uploadsDir, `${timestamp}-${randomSuffix}-${safeFilename}`);

    try {
      writeFileSync(localPath, buffer);
      console.log(`Saved PDF to: ${localPath}`);
    } catch (writeError) {
      console.error(`Failed to write file to ${localPath}:`, writeError);
      throw new Error(`Dosya yazılamadı: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
    }

    // Return URL for static access (served via express static)
    // Note: This assumes /uploads is mounted as static middleware
    const url = `/uploads/${timestamp}-${randomSuffix}-${safeFilename}`;

    return {
      fileKey,
      url,
      localPath,
    };
  } catch (error) {
    console.error("PDF upload error:", error);
    // Propagate the actual error message for debugging
    throw new Error(`PDF yükleme başarısız oldu: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Clean up temporary local file
 * Note: For persistent uploads, we typically DON'T call this anymore unless we want to delete it.
 */
export function cleanupTempFile(localPath: string): void {
  try {
    if (existsSync(localPath)) {
      unlinkSync(localPath);
    }
  } catch (error) {
    console.error("Temp file cleanup error:", error);
  }
}
