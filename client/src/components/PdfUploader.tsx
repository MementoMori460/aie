import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { storagePut } from "@/../../server/storage";

interface PdfUploaderProps {
  onMetadataExtracted: (metadata: {
    paperTitle: string;
    paperAuthors?: string;
    paperDoi?: string;
    paperYear?: number;
    paperJournal?: string;
    paperAbstract?: string;
  }, fullText?: string) => void;
  onAIAnalysisRequest?: (fullText: string, metadata: any) => void;
}

export default function PdfUploader({ onMetadataExtracted }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<"idle" | "uploading" | "extracting" | "success" | "error">("idle");

  const uploadMutation = trpc.pdf.upload.useMutation();
  const extractMetadataMutation = trpc.pdf.extractMetadata.useMutation();

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
    setExtractionStatus("uploading");

    try {
      // Convert to Base64 using FileReader to avoid stack overflow
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

      setExtractionStatus("extracting");
      toast.info("Makale bilgileri çıkarılıyor...");

      // Extract metadata
      const metadata = await extractMetadataMutation.mutateAsync({
        localPath: uploadResult.localPath,
      });

      setExtractionStatus("success");
      toast.success("Makale bilgileri başarıyla çıkarıldı!");

      onMetadataExtracted({
        paperTitle: metadata.title,
        paperAuthors: metadata.authors,
        paperDoi: metadata.doi,
        paperYear: metadata.year,
        paperJournal: metadata.journal,
        paperAbstract: metadata.abstract,
      }, metadata.fullText);

    } catch (error) {
      console.error("File processing error:", error);
      setExtractionStatus("error");
      toast.error("Dosya yüklenirken hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (extractionStatus) {
      case "uploading":
      case "extracting":
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (extractionStatus) {
      case "uploading":
        return "PDF yükleniyor...";
      case "extracting":
        return "Makale bilgileri çıkarılıyor...";
      case "success":
        return "Başarıyla tamamlandı!";
      case "error":
        return "Hata oluştu";
      default:
        return "PDF dosyası yükleyin";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Yükle ve Otomatik Doldur</CardTitle>
        <CardDescription>
          Makale PDF'ini yükleyin, bilgiler otomatik olarak çıkarılsın
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
              {extractionStatus === "idle" && (
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

            {extractionStatus === "idle" && (
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
                      <Upload className="w-4 h-4 mr-2" />
                      Dosya Seç
                    </span>
                  </Button>
                </label>
              </>
            )}

            {extractionStatus === "error" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setExtractionStatus("idle");
                  setUploadedFile(null);
                }}
              >
                Tekrar Dene
              </Button>
            )}
          </div>
        </div>

        {extractionStatus === "success" && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ Makale bilgileri başarıyla çıkarıldı ve form alanları dolduruldu.
              Lütfen bilgileri kontrol edin ve gerekirse düzeltin.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
