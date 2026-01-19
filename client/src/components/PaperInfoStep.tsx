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

  const handlePdfMetadata = (metadata: {
    paperTitle: string;
    paperAuthors?: string;
    paperDoi?: string;
    paperYear?: number;
    paperJournal?: string;
    paperAbstract?: string;
  }, fullText?: string) => {
    if (fullText) {
      setPdfFullText(fullText);
    }
    // Update form data with extracted metadata
    const newFormData = {
      paperTitle: metadata.paperTitle || "",
      paperAuthors: metadata.paperAuthors || "",
      paperDoi: metadata.paperDoi || "",
      paperYear: metadata.paperYear || new Date().getFullYear(),
      paperJournal: metadata.paperJournal || "",
      paperAbstract: metadata.paperAbstract || "",
    };
    setFormData(newFormData);

    // Save to database
    if (evaluation) {
      updateMutation.mutate({
        id: evaluationId,
        ...newFormData,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* PDF Uploader */}
      <PdfUploader onMetadataExtracted={handlePdfMetadata} />

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
