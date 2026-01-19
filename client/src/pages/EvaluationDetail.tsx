import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import EvaluationWizard from "@/components/EvaluationWizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function EvaluationDetail() {
  const [, params] = useRoute("/evaluations/:id");
  const [, setLocation] = useLocation();
  const evaluationId = params?.id ? parseInt(params.id) : 0;

  const { data: evaluation, isLoading } = trpc.evaluation.get.useQuery(
    { id: evaluationId },
    { enabled: evaluationId > 0 }
  );

  const handleComplete = () => {
    setLocation("/evaluations");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Değerlendirme bulunamadı</h2>
          <Button asChild>
            <Link href="/evaluations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <EvaluationWizard evaluationId={evaluationId} onComplete={handleComplete} />
    </div>
  );
}
