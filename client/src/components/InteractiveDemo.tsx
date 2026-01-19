import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, X } from "lucide-react";
import { DEMO_CONTENT, type DemoStep } from "../../../shared/demoContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function InteractiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const demoData = DEMO_CONTENT;
  const step = demoData.steps[currentStep];

  // Total demo progress (steps completed)
  const totalProgress = ((currentStep) / demoData.steps.length) * 100;

  // Current step progress (time remaining)
  const currentStepProgress = isPlaying && step?.duration
    ? ((step.duration - timeLeft) / step.duration) * 100
    : 0;

  // Initialize timeLeft when step changes
  useEffect(() => {
    if (step) {
      setTimeLeft(step.duration || 30);
    }
  }, [currentStep, step]);

  const handleNext = () => {
    if (currentStep < demoData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (demoData.steps[0]) {
      setTimeLeft(demoData.steps[0].duration || 30);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality with 1s interval for countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleNext();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);

  if (!step) return null;

  return (
    <>
      {/* Demo Başlatma Butonu */}
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="w-full sm:w-auto"
      >
        <Play className="w-4 h-4 mr-2" />
        İnteraktif Demo'yu İzle
      </Button>

      {/* Demo Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{demoData.title}</DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground">{demoData.subtitle}</p>
          </DialogHeader>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium"> Toplam İlerleme </span>
                <span className="text-muted-foreground">
                  Adım {currentStep + 1} / {demoData.steps.length}
                </span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>

            {isPlaying && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Otomatik İlerliyor...
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    Kalan: {timeLeft} sn
                  </Badge>
                </div>
                <Progress value={currentStepProgress} className="h-1 bg-primary/20" />
              </div>
            )}

            {!isPlaying && (
              <div className="flex items-center justify-end">
                <Badge variant="outline">
                  Tahmini: {step.duration || 30} sn
                </Badge>
              </div>
            )}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {step.id}
                </span>
                {step.title}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Visual Content */}
              {step.visual && (
                <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
                  {step.visual.type === 'image' && (
                    <div className="text-center space-y-2">
                      <div className="text-6xl">📊</div>
                      <p className="text-sm text-muted-foreground">{step.visual.caption}</p>
                    </div>
                  )}
                  {step.visual.type === 'animation' && (
                    <div className="text-center space-y-2">
                      <div className="text-6xl animate-pulse">🤖</div>
                      <p className="text-sm text-muted-foreground">{step.visual.caption}</p>
                    </div>
                  )}
                  {step.visual.type === 'chart' && (
                    <div className="text-center space-y-2">
                      <div className="text-6xl">📈</div>
                      <p className="text-sm text-muted-foreground">{step.visual.caption}</p>
                    </div>
                  )}
                  {step.visual.type === 'code' && (
                    <div className="text-center space-y-2">
                      <div className="text-6xl">💻</div>
                      <p className="text-sm text-muted-foreground">{step.visual.caption}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {step.actions && step.actions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Bu Adımda Yapabilecekleriniz:</h4>
                  <div className="grid gap-3">
                    {step.actions.map((action: { label: string; description: string }, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{action.label}</p>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <span>💡</span> İpuçları
                  </h4>
                  <ul className="space-y-2">
                    {step.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />

                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === demoData.steps.length - 1}
                  className="w-full"
                >

                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />

                </Button>
                <Button
                  variant={isPlaying ? "destructive" : "default"}
                  size="sm"
                  onClick={handlePlayPause}
                  className="w-full"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />

                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />

                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Final Step CTA */}
          {currentStep === demoData.steps.length - 1 && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-lg">Demo Tamamlandı! 🎉</h3>
                  <p className="text-muted-foreground">
                    Artık kendi makalenizi değerlendirmeye başlayabilirsiniz.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => {
                      setIsOpen(false);
                      window.location.href = '/new';
                    }}>
                      Yeni Değerlendirme Başlat
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Demo'yu Tekrar İzle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
