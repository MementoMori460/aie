import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, FileText, Calendar, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { parseDate } from "@shared/calculations";
import { AssignChairDialog } from "@/components/AssignChairDialog";

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
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Makale Bilgileri</TableHead>
                  <TableHead className="text-center">Durum</TableHead>
                  <TableHead className="text-center font-bold">HIS</TableHead>
                  <TableHead>Tarihler</TableHead>
                  <TableHead className="text-right w-[100px]">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id} className="group">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(evaluation.id)}
                        onCheckedChange={() => toggleSelection(evaluation.id)}
                      />
                    </TableCell>
                    {/* Row Content */}

                    <TableCell>
                      <div>
                        <Link href={`/evaluations/${evaluation.id}`} className="font-semibold text-primary hover:underline block">
                          {evaluation.paperTitle}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1 space-x-2">
                          {evaluation.paperAuthors && <span>{evaluation.paperAuthors}</span>}
                        </div>
                        {/* Display assigned chair if any */}
                        {evaluation.boardChairId && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 border-purple-200 text-purple-700 bg-purple-50">
                              Başhakem Atandı
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={evaluation.status === "completed" ? "default" : "secondary"}>
                        {evaluation.status === "completed" ? "Tamamlandı" : "Taslak"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {evaluation.scoreHIS ? (
                        <div className="font-bold text-lg text-primary">
                          {Number(evaluation.scoreHIS).toFixed(0)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="w-12">Oluştur:</span>
                          <span>{format(parseDate(evaluation.createdAt), "dd MMM yyyy HH:mm", { locale: tr })}</span>
                        </div>
                        {evaluation.completedAt && (
                          <div className="flex items-center gap-1">
                            <span className="w-12">Tamam:</span>
                            <span>{format(parseDate(evaluation.completedAt), "dd MMM yyyy HH:mm", { locale: tr })}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-1">
                        <AssignChairDialog
                          evaluationId={evaluation.id}
                          currentChairId={evaluation.boardChairId}
                          onAssignSuccess={refetch}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(evaluation.id, evaluation.paperTitle)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
