import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info, Lightbulb, Database } from "lucide-react";
import type { IndicatorDefinition } from "@shared/indicators";
import { normalizeIndicator } from "@shared/calculations";

interface IndicatorInputProps {
  indicator: IndicatorDefinition;
  value: string | undefined;
  onChange: (value: string, normalizedScore: number) => void;
}

export default function IndicatorInput({ indicator, value, onChange }: IndicatorInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rawValue = value || "";

  const handleChange = (newValue: string) => {
    const numValue = parseFloat(newValue) || 0;
    const normalized = normalizeIndicator(numValue, indicator.normalization);
    onChange(newValue, normalized);
  };

  const getNormalizedScore = () => {
    if (!rawValue) return 0;
    const numValue = parseFloat(rawValue) || 0;
    return normalizeIndicator(numValue, indicator.normalization);
  };

  const renderInput = () => {
    switch (indicator.type) {
      case "quantitative":
        return (
          <div className="space-y-2">
            <Label htmlFor={indicator.code}>{indicator.name}</Label>
            <Input
              id={indicator.code}
              type="number"
              value={rawValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Sayısal değer girin"
              min={0}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ham Değer: {rawValue || "0"}</span>
              <Badge variant="secondary">
                Normalize Puan: {getNormalizedScore().toFixed(1)}
              </Badge>
            </div>
          </div>
        );

      case "qualitative":
        return (
          <div className="space-y-3">
            <Label>{indicator.name}</Label>
            <RadioGroup
              value={rawValue}
              onValueChange={handleChange}
              className="flex gap-2"
            >
              {[1, 2, 3, 4, 5].map((score) => (
                <div key={score} className="flex items-center space-x-2">
                  <RadioGroupItem value={score.toString()} id={`${indicator.code}-${score}`} />
                  <Label
                    htmlFor={`${indicator.code}-${score}`}
                    className="cursor-pointer font-normal"
                  >
                    {score}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                1 = Çok Düşük, 5 = Çok Yüksek
              </span>
              <Badge variant="secondary">
                Normalize Puan: {getNormalizedScore().toFixed(1)}
              </Badge>
            </div>
          </div>
        );

      case "binary":
        return (
          <div className="space-y-3">
            <Label>{indicator.name}</Label>
            <RadioGroup
              value={rawValue}
              onValueChange={handleChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`${indicator.code}-yes`} />
                <Label htmlFor={`${indicator.code}-yes`} className="cursor-pointer font-normal">
                  Evet / Var
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id={`${indicator.code}-no`} />
                <Label htmlFor={`${indicator.code}-no`} className="cursor-pointer font-normal">
                  Hayır / Yok
                </Label>
              </div>
            </RadioGroup>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">İkili seçim</span>
              <Badge variant="secondary">
                Puan: {getNormalizedScore().toFixed(0)}
              </Badge>
            </div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{indicator.code}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {indicator.type === "quantitative" && "Nicel"}
                {indicator.type === "qualitative" && "Nitel (1-5)"}
                {indicator.type === "binary" && "İkili"}
              </Badge>
            </div>
            <CardDescription>{indicator.description}</CardDescription>
          </div>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="w-4 h-4 mr-1" />
                Detay
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Field */}
        {renderInput()}

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4 pt-4 border-t">
            {/* Data Source */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="w-4 h-4" />
                Veri Kaynağı
              </div>
              <p className="text-sm text-muted-foreground">{indicator.dataSource}</p>
            </div>

            {/* Measurement Method */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4" />
                Ölçüm Yöntemi
              </div>
              <p className="text-sm text-muted-foreground">{indicator.measurementMethod}</p>
            </div>

            {/* Examples */}
            {indicator.examples.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Örnekler</div>
                <ul className="space-y-1">
                  {indicator.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {indicator.tips.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  İpuçları
                </div>
                <ul className="space-y-1">
                  {indicator.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-yellow-500/30">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
