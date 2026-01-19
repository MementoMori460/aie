import { useState } from "react";
import { Check, Zap, Rocket, Clock, Target, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVALUATION_MODES, type EvaluationMode } from "../../../shared/evaluationModes";

interface ModeSelectionProps {
  onSelect: (mode: EvaluationMode) => void;
}

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  const [selectedMode, setSelectedMode] = useState<EvaluationMode | null>(null);

  const handleModeSelect = (mode: EvaluationMode) => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (selectedMode) {
      onSelect(selectedMode);
    }
  };

  const quickMode = EVALUATION_MODES.quick;
  const comprehensiveMode = EVALUATION_MODES.comprehensive;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Değerlendirme Modu Seçin</h1>
        <p className="text-muted-foreground">
          İhtiyacınıza uygun değerlendirme modunu seçerek başlayın
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Quick Mode Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "quick"
              ? "border-primary border-2 shadow-lg"
              : "border-border"
          }`}
          onClick={() => handleModeSelect("quick")}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-10 h-10 text-primary" />
              {selectedMode === "quick" && (
                <Badge variant="default" className="bg-primary">
                  <Check className="w-4 h-4 mr-1" />
                  Seçildi
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{quickMode.name}</CardTitle>
            <CardDescription className="text-base">
              {quickMode.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-semibold">{quickMode.indicatorCount} Gösterge</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{quickMode.estimatedTime}</span>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2 text-sm">Özellikler:</p>
                <ul className="space-y-1">
                  {quickMode.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2 text-sm">Boyutlar:</p>
                <ul className="space-y-1">
                  {quickMode.dimensions.map((dim: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {dim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comprehensive Mode Card */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedMode === "comprehensive"
              ? "border-primary border-2 shadow-lg"
              : "border-border"
          }`}
          onClick={() => handleModeSelect("comprehensive")}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Rocket className="w-10 h-10 text-primary" />
              {selectedMode === "comprehensive" && (
                <Badge variant="default" className="bg-primary">
                  <Check className="w-4 h-4 mr-1" />
                  Seçildi
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              {comprehensiveMode.name}
              <Badge variant="secondary" className="text-xs">
                Gelişmiş
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              {comprehensiveMode.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-semibold">{comprehensiveMode.indicatorCount} Gösterge</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{comprehensiveMode.estimatedTime}</span>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2 text-sm">Özellikler:</p>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {comprehensiveMode.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2 text-sm">Boyutlar:</p>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {comprehensiveMode.dimensions.map((dim: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {dim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedMode}
          className="min-w-48"
        >
          {selectedMode ? `${EVALUATION_MODES[selectedMode].name} ile Devam Et` : "Bir Mod Seçin"}
        </Button>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          <strong>İpucu:</strong> İlk kez kullanıyorsanız veya hızlı bir değerlendirme istiyorsanız{" "}
          <strong>Hızlı Mod</strong>'u seçin. Detaylı araştırma raporları ve zincirleme etki analizi için{" "}
          <strong>Kapsamlı Mod</strong>'u tercih edin.
        </p>
      </div>
    </div>
  );
}
