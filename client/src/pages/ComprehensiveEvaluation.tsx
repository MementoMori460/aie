import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { COMPREHENSIVE_DIMENSIONS } from "../../../shared/comprehensiveDimensions";
import { calculateHIS } from "../../../shared/weightingSystem";
import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";

export default function ComprehensiveEvaluation() {
  const [, params] = useRoute("/evaluation/comprehensive/:id");
  const [, setLocation] = useLocation();
  const evaluationId = params?.id ? parseInt(params.id) : null;

  const { data: evaluation, isLoading } = trpc.evaluation.get.useQuery(
    { id: evaluationId! },
    { enabled: !!evaluationId }
  );

  const updateMutation = trpc.evaluation.update.useMutation();
  const cascadeMutation = trpc.cascade.calculate.useMutation();

  // Dimension scores (0-100)
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize scores from evaluation data
  useEffect(() => {
    if (evaluation) {
      const scores: Record<string, number> = {};
      for (let i = 1; i <= 16; i++) {
        const key = `scoreD${i}` as keyof typeof evaluation;
        const value = evaluation[key];
        if (value) {
          scores[`D${i}`] = parseFloat(value as string);
        }
      }
      setDimensionScores(scores);
    }
  }, [evaluation]);

  const handleScoreChange = (dimensionCode: string, value: number[]) => {
    setDimensionScores(prev => ({
      ...prev,
      [dimensionCode]: value[0]
    }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!evaluationId) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Prepare update data with dimension scores
      // Backend will auto-calculate HIS and cascade multipliers
      const updateData: any = {
        id: evaluationId,
      };

      // Add dimension scores (D1-D15, D16 is auto-calculated)
      for (let i = 1; i <= 15; i++) {
        const code = `D${i}`;
        const score = dimensionScores[code];
        if (score !== undefined) {
          updateData[code] = score; // Send as D1, D2, etc. (numbers)
        }
      }

      // Update evaluation (backend auto-calculates HIS and cascade multipliers)
      await updateMutation.mutateAsync(updateData);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save evaluation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!evaluationId) return;

    await handleSave();

    // Navigate to report
    setLocation(`/evaluation/report/${evaluationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertDescription>Değerlendirme bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  const completedCount = Object.keys(dimensionScores).length;
  const totalCount = COMPREHENSIVE_DIMENSIONS.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard'a Dön
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kapsamlı Değerlendirme</h1>
              <p className="text-muted-foreground">{evaluation.paperTitle}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completedCount}/{totalCount} Boyut
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <Alert className="mb-6">
          <AlertDescription>
            Her boyut için 0-100 arası puan verin. Puanlar makalenin o boyuttaki etkisini yansıtmalıdır.
            Tüm boyutları değerlendirdikten sonra sistem otomatik olarak zincirleme etkileri ve çarpan katsayılarını hesaplayacaktır.
          </AlertDescription>
        </Alert>

        {/* Dimension Evaluation Cards */}
        <div className="space-y-6 mb-8">
          {COMPREHENSIVE_DIMENSIONS.map((dimension) => {
            const score = dimensionScores[dimension.code] || 0;

            return (
              <Card key={dimension.code}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-primary">{dimension.code}</span>
                        <span>{dimension.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {dimension.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {score.toFixed(0)}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Slider */}
                  <div className="mb-4">
                    <Slider
                      value={[score]}
                      onValueChange={(value) => handleScoreChange(dimension.code, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Examples */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Değerlendirme Rehberi:</p>
                    <p className="text-sm text-muted-foreground">
                      {dimension.evaluationGuidance}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dimension.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 sticky bottom-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Kaydedildi</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || completedCount === 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </>
              )}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isSaving || completedCount < totalCount}
            >
              Değerlendirmeyi Tamamla
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
