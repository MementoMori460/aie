import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, FileText, Calendar, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function EvaluationList() {
  const [, setLocation] = useLocation();
  const { data: evaluations, isLoading, refetch } = trpc.evaluation.list.useQuery();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const deleteMutation = trpc.evaluation.delete.useMutation({
    onSuccess: () => {
      toast.success("Değerlendirme silindi");
      refetch();
    },
    onError: (error) => {
      toast.error("Hata: " + error.message);
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`"${title}" değerlendirmesini silmek istediğinizden emin misiniz?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) {
      toast.error("Karşılaştırmak için en az 2 değerlendirme seçmelisiniz");
      return;
    }
    setLocation(`/compare?ids=${selectedIds.join(",")}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Değerlendirme Geçmişi</h1>
              <p className="text-muted-foreground">
                Tamamlanmış ve devam eden değerlendirmeleriniz
              </p>
            </div>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <Button variant="outline" onClick={handleCompare} className="border-primary text-primary">
                  <Layers className="w-4 h-4 mr-2" />
                  Karşılaştır ({selectedIds.length})
                </Button>
              )}
              <Button asChild>
                <Link href="/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Değerlendirme
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Evaluations List */}
        {!evaluations || evaluations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Henüz değerlendirme yok</h3>
              <p className="text-muted-foreground mb-4">
                İlk değerlendirmenizi oluşturarak başlayın
              </p>
              <Button asChild>
                <Link href="/evaluations/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Değerlendirme
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedIds.includes(evaluation.id)}
                      onCheckedChange={() => toggleSelection(evaluation.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">
                          <Link href={`/evaluations/${evaluation.id}`} className="hover:underline">
                            {evaluation.paperTitle}
                          </Link>
                        </CardTitle>
                        <Badge variant={evaluation.status === "completed" ? "default" : "secondary"}>
                          {evaluation.status === "completed" ? "Tamamlandı" : "Taslak"}
                        </Badge>
                      </div>
                      <CardDescription className="space-y-1">
                        {evaluation.paperAuthors && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Yazarlar:</span>
                            <span>{evaluation.paperAuthors}</span>
                          </div>
                        )}
                        {evaluation.paperJournal && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Dergi:</span>
                            <span>{evaluation.paperJournal}</span>
                          </div>
                        )}
                        {evaluation.paperYear && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{evaluation.paperYear}</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(evaluation.id, evaluation.paperTitle)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                {evaluation.scoreHIS && (
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {parseFloat(evaluation.scoreHIS).toFixed(0)}
                        </div>
                        <div className="text-sm text-muted-foreground">HIS Skoru</div>
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                        {evaluation.scoreD1 && (
                          <div>
                            <div className="font-medium">D1: {parseFloat(evaluation.scoreD1).toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Akademik</div>
                          </div>
                        )}
                        {evaluation.scoreD2 && (
                          <div>
                            <div className="font-medium">D2: {parseFloat(evaluation.scoreD2).toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Toplumsal</div>
                          </div>
                        )}
                        {evaluation.scoreD3 && (
                          <div>
                            <div className="font-medium">D3: {parseFloat(evaluation.scoreD3).toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Negatif</div>
                          </div>
                        )}
                        {evaluation.scoreD4 && (
                          <div>
                            <div className="font-medium">D4: {parseFloat(evaluation.scoreD4).toFixed(0)}</div>
                            <div className="text-muted-foreground text-xs">Etik</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      Oluşturulma: {format(new Date(evaluation.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })}
                    </div>
                    {evaluation.completedAt && (
                      <div>
                        Tamamlanma: {format(new Date(evaluation.completedAt), "dd MMMM yyyy HH:mm", { locale: tr })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
