import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, CheckCircle2 } from "lucide-react";
import { ALL_DIMENSIONS, D1_ACADEMIC_IMPACT, D2_SOCIAL_PRACTICAL_IMPACT, D3_NEGATIVE_IMPACT, D4_ETHICS_RESPONSIBILITY } from "@shared/indicators";
import DimensionStep from "./DimensionStep";
import PaperInfoStep from "./PaperInfoStep";
import ResultsStep from "./ResultsStep";

interface EvaluationWizardProps {
  evaluationId: number;
  onComplete: () => void;
}

type WizardStep = "paper-info" | "D1" | "D2" | "D3" | "D4" | "results";

export default function EvaluationWizard({ evaluationId, onComplete }: EvaluationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("paper-info");
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [aiSuggestedIndicators, setAiSuggestedIndicators] = useState<Record<string, number>>({});

  const steps: { id: WizardStep; title: string; description: string }[] = [
    {
      id: "paper-info",
      title: "Makale Bilgileri",
      description: "Temel makale bilgilerini girin"
    },
    {
      id: "D1",
      title: "Akademik Etki",
      description: "Bilimsel topluluk içindeki etki"
    },
    {
      id: "D2",
      title: "Toplumsal ve Pratik Etki",
      description: "Akademi dışındaki dünyada yarattığı değişim"
    },
    {
      id: "D3",
      title: "Negatif Etki ve Risk",
      description: "Yarattığı veya yaratabileceği zararlar"
    },
    {
      id: "D4",
      title: "Etik ve Sorumluluk",
      description: "Araştırmanın etik standartları"
    },
    {
      id: "results",
      title: "Sonuçlar",
      description: "Bütünsel etki skoru ve rapor"
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    // Move to next step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: WizardStep) => {
    setCurrentStep(stepId);
  };
  
  const handleAISuggestionsAccepted = (suggestions: Record<string, number>) => {
    // Store AI suggestions in state
    // They will be saved when user navigates to each dimension step
    setAiSuggestedIndicators(suggestions);
  };

  return (
    <div className="container max-w-6xl py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Makale Değerlendirmesi</h2>
          <span className="text-sm text-muted-foreground">
            Adım {currentStepIndex + 1} / {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.has(step.id);
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${isActive ? "border-primary bg-primary/5" : "border-border"}
                ${isCompleted ? "bg-green-50 dark:bg-green-950" : ""}
                hover:border-primary/50
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`
                  text-xs font-medium px-2 py-0.5 rounded
                  ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}
                `}>
                  {index + 1}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="text-sm font-medium truncate">{step.title}</div>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[currentStepIndex].title}</CardTitle>
              <CardDescription>{steps[currentStepIndex].description}</CardDescription>
            </div>
            {currentStep !== "paper-info" && currentStep !== "results" && (
              <Badge variant="outline">
                {ALL_DIMENSIONS.find(d => d.code === currentStep)?.subDimensions.length || 0} Alt Boyut
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Step-specific content will be rendered here */}
          <div className="min-h-[400px]">
            {currentStep === "paper-info" && (
              <PaperInfoStep 
                evaluationId={evaluationId} 
                onAISuggestionsAccepted={handleAISuggestionsAccepted}
              />
            )}
            {currentStep === "D1" && (
              <DimensionStep 
                dimension={D1_ACADEMIC_IMPACT} 
                evaluationId={evaluationId}
                aiSuggestedValues={aiSuggestedIndicators}
              />
            )}
            {currentStep === "D2" && (
              <DimensionStep 
                dimension={D2_SOCIAL_PRACTICAL_IMPACT} 
                evaluationId={evaluationId}
                aiSuggestedValues={aiSuggestedIndicators}
              />
            )}
            {currentStep === "D3" && (
              <DimensionStep 
                dimension={D3_NEGATIVE_IMPACT} 
                evaluationId={evaluationId}
                aiSuggestedValues={aiSuggestedIndicators}
              />
            )}
            {currentStep === "D4" && (
              <DimensionStep 
                dimension={D4_ETHICS_RESPONSIBILITY} 
                evaluationId={evaluationId}
                aiSuggestedValues={aiSuggestedIndicators}
              />
            )}
            {currentStep === "results" && <ResultsStep evaluationId={evaluationId} />}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Önceki
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>

          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Sonraki
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={onComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tamamla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
