import { storagePut } from "./storage";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export interface UploadResult {
  fileKey: string;
  url: string;
  localPath: string;
}

/**
 * Upload PDF file from base64 string to S3 and save locally for processing
 */
export async function uploadPdfFromBase64(base64Data: string, filename: string): Promise<UploadResult> {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique file key
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `pdf-uploads/${timestamp}-${randomSuffix}-${filename}`;

    // Save to temporary local file for PDF processing
    const localPath = join(tmpdir(), `${timestamp}-${randomSuffix}-${filename}`);
    writeFileSync(localPath, buffer);

    // Upload to S3
    const { url } = await storagePut(fileKey, buffer, "application/pdf");

    return {
      fileKey,
      url,
      localPath,
    };
  } catch (error) {
    console.error("PDF upload error:", error);
    throw new Error("PDF yükleme başarısız oldu");
  }
}

/**
 * Clean up temporary local file
 */
export function cleanupTempFile(localPath: string): void {
  try {
    unlinkSync(localPath);
  } catch (error) {
    console.error("Temp file cleanup error:", error);
  }
}
