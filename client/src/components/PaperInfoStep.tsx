import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import PdfUploader from "./PdfUploader";
import { AISuggestionsDialog } from "@/components/AISuggestionsDialog";

interface PaperInfoStepProps {
  evaluationId: number;
  onAISuggestionsAccepted?: (suggestions: Record<string, number>) => void;
}

export default function PaperInfoStep({ evaluationId, onAISuggestionsAccepted }: PaperInfoStepProps) {
  const { data: evaluation } = trpc.evaluation.get.useQuery({ id: evaluationId });
  const updateMutation = trpc.evaluation.update.useMutation({
    onSuccess: () => {
      toast.success("Bilgiler kaydedildi");
    },
    onError: (error) => {
      toast.error("Hata: " + error.message);
    },
  });

  const [pdfFullText, setPdfFullText] = useState<string>("");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const analyzeIndicatorsMutation = trpc.ai.analyzeAllIndicators.useMutation();

  const [formData, setFormData] = useState({
    paperTitle: "",
    paperAuthors: "",
    paperDoi: "",
    paperYear: new Date().getFullYear(),
    paperJournal: "",
    paperAbstract: "",
  });

  const [uploadedPdfPath, setUploadedPdfPath] = useState<string | null>(null);

  const extractMetadataMutation = trpc.pdf.extractMetadata.useMutation();

  useEffect(() => {
    if (evaluation) {
      setFormData({
        paperTitle: evaluation.paperTitle || "",
        paperAuthors: evaluation.paperAuthors || "",
        paperDoi: evaluation.paperDoi || "",
        paperYear: evaluation.paperYear || new Date().getFullYear(),
        paperJournal: evaluation.paperJournal || "",
        paperAbstract: evaluation.paperAbstract || "",
      });
    }
  }, [evaluation]);

  const handleBlur = (field: keyof typeof formData) => {
    if (evaluation && formData[field] !== (evaluation[field] || "")) {
      updateMutation.mutate({
        id: evaluationId,
        [field]: formData[field],
      });
    }
  };

  const handleUploadComplete = (filePath: string) => {
    setUploadedPdfPath(filePath);
  };

  const handleExtractMetadata = async () => {
    if (!uploadedPdfPath) return;

    try {
      toast.info("AI makale bilgilerini analiz ediyor...");
      const metadata = await extractMetadataMutation.mutateAsync({
        localPath: uploadedPdfPath,
      });

      if (metadata.fullText) {
        setPdfFullText(metadata.fullText);
      }
      // Update form data with extracted metadata
      const newFormData = {
        paperTitle: metadata.title || "",
        paperAuthors: metadata.authors || "",
        paperDoi: metadata.doi || "",
        paperYear: metadata.year || new Date().getFullYear(),
        paperJournal: metadata.journal || "",
        paperAbstract: metadata.abstract || "",
      };
      setFormData(newFormData);

      // Save to database
      if (evaluation) {
        updateMutation.mutate({
          id: evaluationId,
          ...newFormData,
        });
      }
      toast.success("Bilgiler başarıyla dolduruldu!");

    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Bilgiler alınırken bir hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* PDF Uploader */}
      <PdfUploader onUploadComplete={handleUploadComplete} />

      {/* AI Analysis Trigger (Only visible after upload) */}
      {uploadedPdfPath && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">PDF Yüklendi</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Makale içeriğini analiz edip formu otomatik doldurmak ister misiniz?</p>
          </div>
          <Button
            onClick={handleExtractMetadata}
            disabled={extractMetadataMutation.isPending}
            className="gap-2"
          >
            {extractMetadataMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI ile Analiz Et ve Doldur
          </Button>
        </div>
      )}

      {/* Show existing PDF if available (for reviewers) */}
      {evaluation?.pdfPath && !uploadedPdfPath && (
        <div className="bg-muted/50 border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4h4" /></svg>
            </div>
            <div>
              <h4 className="font-medium">Yüklenmiş Makale PDF'i</h4>
              <p className="text-sm text-muted-foreground">Makale tam metnine buradan ulaşabilirsiniz.</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <a href={`/uploads/${evaluation.pdfPath.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
              PDF'i Görüntüle / İndir
            </a>
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Veya manuel olarak girin
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="paperTitle">
          Makale Başlığı <span className="text-destructive">*</span>
        </Label>
        <Input
          id="paperTitle"
          value={formData.paperTitle}
          onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
          onBlur={() => handleBlur("paperTitle")}
          placeholder="Örn: Yapay Zeka Etikleri Üzerine Bir Çalışma"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paperAuthors">Yazarlar</Label>
        <Input
          id="paperAuthors"
          value={formData.paperAuthors}
          onChange={(e) => setFormData({ ...formData, paperAuthors: e.target.value })}
          onBlur={() => handleBlur("paperAuthors")}
          placeholder="Örn: Smith, J., Johnson, A., Williams, B."
        />
        <p className="text-sm text-muted-foreground">Yazarları virgülle ayırarak girin</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paperDoi">DOI</Label>
          <Input
            id="paperDoi"
            value={formData.paperDoi}
            onChange={(e) => setFormData({ ...formData, paperDoi: e.target.value })}
            onBlur={() => handleBlur("paperDoi")}
            placeholder="10.1000/xyz123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paperYear">Yayın Yılı</Label>
          <Input
            id="paperYear"
            type="number"
            value={formData.paperYear}
            onChange={(e) => setFormData({ ...formData, paperYear: parseInt(e.target.value) })}
            onBlur={() => handleBlur("paperYear")}
            min={1900}
            max={new Date().getFullYear() + 1}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paperJournal">Dergi / Konferans</Label>
        <Input
          id="paperJournal"
          value={formData.paperJournal}
          onChange={(e) => setFormData({ ...formData, paperJournal: e.target.value })}
          onBlur={() => handleBlur("paperJournal")}
          placeholder="Örn: Nature, Science, IEEE Conference"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paperAbstract">Özet (Abstract)</Label>
        <Textarea
          id="paperAbstract"
          value={formData.paperAbstract}
          onChange={(e) => setFormData({ ...formData, paperAbstract: e.target.value })}
          onBlur={() => handleBlur("paperAbstract")}
          placeholder="Makalenin özetini buraya yapıştırın..."
          rows={6}
        />
        <p className="text-sm text-muted-foreground">
          Özet, değerlendirme sürecinde referans olarak kullanılacaktır
        </p>
      </div>

      {/* AI Analysis Button */}
      {pdfFullText && formData.paperTitle && (
        <div className="pt-4 border-t">
          <Button
            onClick={handleAIAnalysis}
            disabled={analyzeIndicatorsMutation.isPending}
            className="w-full"
            size="lg"
          >
            {analyzeIndicatorsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Makale Analiz Ediliyor...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Tüm Göstergeleri AI ile Otomatik Doldur
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            AI, makale içeriğini analiz edip 33 gösterge için değer önerecek
          </p>
        </div>
      )}

      {/* AI Suggestions Dialog */}
      <AISuggestionsDialog
        open={showAISuggestions}
        onOpenChange={setShowAISuggestions}
        suggestions={aiSuggestions?.suggestions || []}
        overallAssessment={aiSuggestions?.overallAssessment || ""}
        onAcceptAll={handleAcceptAllSuggestions}
        onAcceptSelected={handleAcceptSelectedSuggestions}
        loading={analyzeIndicatorsMutation.isPending}
      />
    </div>
  );

  async function handleAIAnalysis() {
    if (!pdfFullText || !formData.paperTitle) {
      toast.error("Lütfen önce PDF yükleyin ve makale başlığını girin");
      return;
    }

    try {
      const result = await analyzeIndicatorsMutation.mutateAsync({
        paperText: pdfFullText,
        paperMetadata: {
          title: formData.paperTitle,
          authors: formData.paperAuthors,
          year: formData.paperYear,
          journal: formData.paperJournal,
          abstract: formData.paperAbstract,
        },
      });

      setAiSuggestions(result);
      setShowAISuggestions(true);
      toast.success(`${result.suggestions.length} gösterge için öneri oluşturuldu`);
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("AI analizi sırasında bir hata oluştu");
    }
  }

  function handleAcceptAllSuggestions() {
    if (!aiSuggestions || !onAISuggestionsAccepted) return;

    const indicators: Record<string, number> = {};
    for (const suggestion of aiSuggestions.suggestions) {
      const value = typeof suggestion.value === 'string'
        ? parseFloat(suggestion.value)
        : suggestion.value;
      if (!isNaN(value)) {
        indicators[suggestion.code] = value;
      }
    }

    onAISuggestionsAccepted(indicators);
    toast.success("Tüm AI önerileri kabul edildi ve göstergelere uygulandı");
  }

  function handleAcceptSelectedSuggestions(codes: string[]) {
    if (!aiSuggestions || !onAISuggestionsAccepted) return;

    const indicators: Record<string, number> = {};
    for (const suggestion of aiSuggestions.suggestions) {
      if (codes.includes(suggestion.code)) {
        const value = typeof suggestion.value === 'string'
          ? parseFloat(suggestion.value)
          : suggestion.value;
        if (!isNaN(value)) {
          indicators[suggestion.code] = value;
        }
      }
    }

    onAISuggestionsAccepted(indicators);
    toast.success(`${codes.length} AI önerisi kabul edildi ve göstergelere uygulandı`);
  }
}
