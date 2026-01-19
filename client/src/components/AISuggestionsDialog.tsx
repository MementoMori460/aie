import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface IndicatorSuggestion {
  code: string;
  value: number | string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AISuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: IndicatorSuggestion[];
  overallAssessment: string;
  onAcceptAll: () => void;
  onAcceptSelected: (codes: string[]) => void;
  loading?: boolean;
}

export function AISuggestionsDialog({
  open,
  onOpenChange,
  suggestions,
  overallAssessment,
  onAcceptAll,
  onAcceptSelected,
  loading = false,
}: AISuggestionsDialogProps) {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    new Set(suggestions.map(s => s.code))
  );

  const toggleSelection = (code: string) => {
    const newSelected = new Set(selectedCodes);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCodes(newSelected);
  };

  const handleAcceptSelected = () => {
    onAcceptSelected(Array.from(selectedCodes));
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    onAcceptAll();
    onOpenChange(false);
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge variant="default" className="bg-green-500">Yüksek Güven</Badge>;
      case 'medium':
        return <Badge variant="secondary">Orta Güven</Badge>;
      case 'low':
        return <Badge variant="outline">Düşük Güven</Badge>;
      default:
        return null;
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Gösterge Önerileri</DialogTitle>
          <DialogDescription>
            Yapay zeka, makale içeriğini analiz ederek 33 gösterge için değer önerileri oluşturdu.
            Kabul etmek istediğiniz önerileri seçin.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Makale analiz ediliyor...</span>
          </div>
        ) : (
          <>
            {/* Overall Assessment */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Genel Değerlendirme
              </h4>
              <p className="text-sm text-muted-foreground">{overallAssessment}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{suggestions.length}</div>
                <div className="text-xs text-muted-foreground">Toplam Öneri</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {suggestions.filter(s => s.confidence === 'high').length}
                </div>
                <div className="text-xs text-muted-foreground">Yüksek Güven</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {selectedCodes.size}
                </div>
                <div className="text-xs text-muted-foreground">Seçili</div>
              </div>
            </div>

            {/* Suggestions List */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.code}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCodes.has(suggestion.code)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleSelection(suggestion.code)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCodes.has(suggestion.code)}
                          onChange={() => toggleSelection(suggestion.code)}
                          className="rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="font-mono text-sm font-semibold">
                          {suggestion.code}
                        </span>
                        {getConfidenceIcon(suggestion.confidence)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getConfidenceBadge(suggestion.confidence)}
                        <Badge variant="secondary">
                          Değer: {suggestion.value}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {suggestion.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            variant="secondary"
            onClick={handleAcceptSelected}
            disabled={selectedCodes.size === 0 || loading}
          >
            Seçilenleri Kabul Et ({selectedCodes.size})
          </Button>
          <Button onClick={handleAcceptAll} disabled={loading}>
            Tümünü Kabul Et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
