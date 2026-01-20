import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PdfUploaderProps {
  onUploadComplete: (filePath: string) => void;
}

export default function PdfUploader({ onUploadComplete }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const uploadMutation = trpc.pdf.upload.useMutation();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (!pdfFile) {
      toast.error("Lütfen bir PDF dosyası yükleyin");
      return;
    }

    await processFile(pdfFile);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Lütfen bir PDF dosyası yükleyin");
      return;
    }

    await processFile(file);
  }, []);

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus("uploading");

    try {
      // Convert to Base64 using FileReader
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove "data:application/pdf;base64," prefix or similar
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      toast.info("PDF yükleniyor...");

      // Upload PDF
      const uploadResult = await uploadMutation.mutateAsync({
        base64Data: base64,
        filename: file.name,
      });

      setUploadStatus("success");
      toast.success("PDF başarıyla yüklendi!");

      // Notify parent with the local file path
      onUploadComplete(uploadResult.localPath);

    } catch (error) {
      console.error("File processing error:", error);
      setUploadStatus("error");
      toast.error("Dosya yüklenirken hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "PDF yükleniyor...";
      case "success":
        return "PDF Yüklendi";
      case "error":
        return "Hata oluştu";
      default:
        return "PDF Yükle";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Adım: PDF Dosyası Yükle</CardTitle>
        <CardDescription>
          Değerlendirmek istediğiniz makale dosyasını yükleyin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            {getStatusIcon()}

            <div>
              <p className="text-sm font-medium">{getStatusText()}</p>
              {uploadStatus === "idle" && (
                <p className="text-xs text-muted-foreground mt-1">
                  PDF dosyasını buraya sürükleyin veya tıklayarak seçin
                </p>
              )}
            </div>

            {uploadedFile && (
              <div className="text-xs text-muted-foreground">
                <FileText className="w-4 h-4 inline mr-1" />
                {uploadedFile.name}
              </div>
            )}

            {uploadStatus === "idle" && (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      Dosya Seç
                    </span>
                  </Button>
                </label>
              </>
            )}

            {uploadStatus === "error" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUploadStatus("idle");
                  setUploadedFile(null);
                }}
              >
                Tekrar Dene
              </Button>
            )}

            {uploadStatus === "success" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  setUploadStatus("idle");
                  setUploadedFile(null);
                }}
              >
                Farklı dosya yükle
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
