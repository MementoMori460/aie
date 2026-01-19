import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import IndicatorInput from "./IndicatorInput";
import type { DimensionDefinition } from "@shared/indicators";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { calculateSubDimensionScore, calculateDimensionScore } from "@shared/calculations";

interface DimensionStepProps {
  dimension: DimensionDefinition;
  evaluationId: number;
  aiSuggestedValues?: Record<string, number>;
}

export default function DimensionStep({ dimension, evaluationId, aiSuggestedValues }: DimensionStepProps) {
  const [indicatorValues, setIndicatorValues] = useState<Record<string, { raw: string; normalized: number }>>({});
  const [subDimensionScores, setSubDimensionScores] = useState<Record<string, number>>({});
  const [dimensionScore, setDimensionScore] = useState<number>(0);

  // Load existing indicator values
  const { data: existingIndicators } = trpc.indicator.list.useQuery({ evaluationId });

  const saveIndicatorMutation = trpc.indicator.save.useMutation({
    onError: (error) => {
      toast.error("Kayıt hatası: " + error.message);
    },
  });

  const updateEvaluationMutation = trpc.evaluation.update.useMutation();

  // Initialize indicator values from database
  useEffect(() => {
    if (existingIndicators) {
      const values: Record<string, { raw: string; normalized: number }> = {};
      existingIndicators.forEach((ind) => {
        values[ind.indicatorCode] = {
          raw: ind.rawValue || "",
          normalized: parseFloat(ind.normalizedScore || "0"),
        };
      });
      setIndicatorValues(values);
    }
  }, [existingIndicators]);

  // Calculate scores whenever indicator values change
  useEffect(() => {
    calculateScores();
  }, [indicatorValues]);

  const calculateScores = () => {
    const subDimScores: Record<string, number> = {};

    // Calculate each sub-dimension score
    dimension.subDimensions.forEach((subDim) => {
      const indicatorScores = subDim.indicators.map((ind) => {
        return indicatorValues[ind.code]?.normalized || 0;
      });

      const weights = subDim.indicators.map(() => 1 / subDim.indicators.length);
      subDimScores[subDim.code] = calculateSubDimensionScore(indicatorScores, weights);
    });

    setSubDimensionScores(subDimScores);

    // Calculate dimension score
    const subDimScoreArray = dimension.subDimensions.map((sd) => subDimScores[sd.code] || 0);
    const subDimWeights = dimension.subDimensions.map((sd) => sd.weight);
    const dimScore = calculateDimensionScore(subDimScoreArray, subDimWeights);
    setDimensionScore(dimScore);

    // Update evaluation with dimension score
    const scoreField = `score${dimension.code}` as "scoreD1" | "scoreD2" | "scoreD3" | "scoreD4";
    updateEvaluationMutation.mutate({
      id: evaluationId,
      [scoreField]: dimScore.toFixed(2),
    });
  };

  const handleIndicatorChange = (indicatorCode: string, rawValue: string, normalizedScore: number) => {
    // Update local state
    setIndicatorValues((prev) => ({
      ...prev,
      [indicatorCode]: { raw: rawValue, normalized: normalizedScore },
    }));

    // Save to database
    saveIndicatorMutation.mutate({
      evaluationId,
      indicatorCode,
      rawValue,
      normalizedScore: normalizedScore.toFixed(2),
    });
  };

  const getTotalIndicators = () => {
    return dimension.subDimensions.reduce((sum, sd) => sum + sd.indicators.length, 0);
  };

  const getCompletedIndicators = () => {
    return Object.values(indicatorValues).filter((v) => v.raw !== "").length;
  };

  const getCompletionPercentage = () => {
    const total = getTotalIndicators();
    const completed = getCompletedIndicators();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Dimension Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{dimension.name}</CardTitle>
              <CardDescription className="text-base mt-2">{dimension.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{dimensionScore.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Boyut Skoru</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Tamamlanma Durumu</span>
              <span className="font-medium">
                {getCompletedIndicators()} / {getTotalIndicators()} gösterge
              </span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Sub-dimensions */}
      {dimension.subDimensions.map((subDim, subDimIndex) => (
        <div key={subDim.code} className="space-y-4">
          {/* Sub-dimension Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {subDimIndex + 1}
                </span>
                {subDim.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ağırlık: {(subDim.weight * 100).toFixed(0)}% • {subDim.indicators.length} gösterge
              </p>
            </div>
            <Badge variant="secondary" className="text-base px-4 py-1">
              {(subDimensionScores[subDim.code] || 0).toFixed(1)}
            </Badge>
          </div>

          {/* Indicators */}
          <div className="space-y-3 pl-10">
            {subDim.indicators.map((indicator) => (
              <IndicatorInput
                key={indicator.code}
                indicator={indicator}
                value={indicatorValues[indicator.code]?.raw}
                onChange={(raw, normalized) => handleIndicatorChange(indicator.code, raw, normalized)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
