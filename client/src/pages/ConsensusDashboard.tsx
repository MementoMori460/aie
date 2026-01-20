import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Scale, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function ConsensusDashboard() {
    const { user } = useAuth();
    const { data: evaluations, isLoading } = trpc.evaluation.list.useQuery();
    const [showOnlyMyAssignments, setShowOnlyMyAssignments] = useState(true);

    // Logic to identify evaluations that need consensus (e.g., status is draft but has reviews)
    const consensusNeeded = evaluations?.filter(ev =>
        ev.status === "draft" &&
        (showOnlyMyAssignments ? (ev.boardChairId === user?.id) : true)
    ) || [];

    if (isLoading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Uzlaşma Paneli (Board Chair)</h1>
                    <p className="text-muted-foreground">Hakem puanları arasındaki farkları inceleyin ve nihai kararı verin.</p>
                </div>
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg">
                    <span className={`text-sm cursor-pointer ${showOnlyMyAssignments ? "font-bold text-primary" : "text-muted-foreground"}`} onClick={() => setShowOnlyMyAssignments(true)}>Bana Atananlar</span>
                    <div className="bg-background rounded-full p-1 cursor-pointer" onClick={() => setShowOnlyMyAssignments(!showOnlyMyAssignments)}>
                        {showOnlyMyAssignments ? <div className="w-8 h-4 bg-primary rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute right-1 top-0.5"></div></div> : <div className="w-8 h-4 bg-muted-foreground rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute left-1 top-0.5"></div></div>}
                    </div>
                    <span className={`text-sm cursor-pointer ${!showOnlyMyAssignments ? "font-bold text-primary" : "text-muted-foreground"}`} onClick={() => setShowOnlyMyAssignments(false)}>Tümü</span>
                </div>
            </div>

            <div className="space-y-6">
                {consensusNeeded.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/20">
                        <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">
                            {showOnlyMyAssignments ? "Size Atanmış Bekleyen İş Yok" : "Uzlaşma Bekleyen Makale Yok"}
                        </h3>
                        <p className="text-muted-foreground">
                            {showOnlyMyAssignments ? "Şu anda size atanmış ve uzlaşma bekleyen bir çalışma bulunmuyor." : "Tüm sistemde bekleyen iş yok."}
                        </p>
                    </div>
                ) : (
                    <div className="border rounded-lg bg-card overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Makale Bilgileri</TableHead>
                                    <TableHead className="text-center">Hakemler</TableHead>
                                    <TableHead className="text-center">Uzlaşma Skoru (ICC)</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {consensusNeeded.map((ev) => (
                                    <ConsensusRow key={ev.id} evaluation={ev} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}

function ConsensusRow({ evaluation }: { evaluation: any }) {
    const { data: reviews } = trpc.review.listByEvaluation.useQuery({ evaluationId: evaluation.id });
    const { data: metrics } = trpc.review.getConsensusMetrics.useQuery({ evaluationId: evaluation.id });

    if (!reviews || reviews.length === 0) return null;

    return (
        <>
            <TableRow className="group bg-muted/5">
                <TableCell>
                    <div className="font-semibold">{evaluation.paperTitle}</div>
                    <div className="text-xs text-muted-foreground">{evaluation.paperAuthors}</div>
                </TableCell>
                <TableCell className="text-center font-medium">
                    {reviews.length} Hakem
                </TableCell>
                <TableCell className="text-center">
                    {metrics ? (
                        <Badge className={metrics.consensusScore > 80 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}>
                            %{metrics.consensusScore.toFixed(1)}
                        </Badge>
                    ) : "-"}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <AssignReviewerDialog evaluationId={evaluation.id} />
                        <Button size="sm">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Nihai Skoru Onayla
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className="bg-background">
                <TableCell colSpan={4} className="p-0 border-b-2 border-muted/20">
                    <div className="px-12 py-4 bg-muted/10">
                        <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Hakem Detayları</div>
                        <Table className="border rounded-md bg-background">
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="h-8 text-[10px]">Hakem</TableHead>
                                    <TableHead className="h-8 text-[10px]">Akademik (D1)</TableHead>
                                    <TableHead className="h-8 text-[10px]">Toplumsal (D2)</TableHead>
                                    <TableHead className="h-8 text-[10px]">Negatif (D3)</TableHead>
                                    <TableHead className="h-8 text-[10px] font-bold">HIS Skoru</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map((review, idx) => (
                                    <TableRow key={review.id} className="h-10 hover:bg-transparent">
                                        <TableCell className="py-2 text-xs">Hakem #{idx + 1}</TableCell>
                                        <TableCell className="py-2 text-xs">{Number(review.scoreD1 || 0).toFixed(1)}</TableCell>
                                        <TableCell className="py-2 text-xs">{Number(review.scoreD2 || 0).toFixed(1)}</TableCell>
                                        <TableCell className="py-2 text-xs">{Number(review.scoreD3 || 0).toFixed(1)}</TableCell>
                                        <TableCell className="py-2 text-xs font-bold">{Number(review.scoreHIS || 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {metrics && metrics.discrepancy > 15 && (
                            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-center gap-2">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span>
                                    <strong>Fark Uyarı:</strong> Puan farkı ({metrics.discrepancy.toFixed(2)}) yüksek.
                                </span>
                            </div>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        </>
    );
}

function AssignReviewerDialog({ evaluationId }: { evaluationId: number }) {
    const [open, setOpen] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState<string>("");

    // Fetch potential reviewers (users with 'reviewer' role)
    const { data: users } = trpc.admin.listUsers.useQuery();
    const reviewers = users?.filter(u => u.role === "reviewer" || u.role === "admin") || [];

    const utils = trpc.useUtils();
    const assignMutation = trpc.assignment.assign.useMutation({
        onSuccess: () => {
            toast.success("Atama Başarılı", { description: "Makale seçilen hakeme başarıyla atandı." });
            setOpen(false);
            utils.review.listByEvaluation.invalidate({ evaluationId });
        },
        onError: (err) => {
            toast.error("Atama Hatası", { description: err.message });
        }
    });

    const handleAssign = () => {
        if (!selectedReviewer) return;
        assignMutation.mutate({
            evaluationId,
            reviewerId: parseInt(selectedReviewer)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Yeni Hakem Ata
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hakem Atama</DialogTitle>
                    <DialogDescription>
                        Bu makaleyi değerlendirmesi için bir hakem seçin.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                            <SelectTrigger>
                                <SelectValue placeholder="Hakem Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {reviewers.length === 0 ? (
                                    <SelectItem value="none" disabled>Müsait hakem bulunamadı</SelectItem>
                                ) : (
                                    reviewers.map((reviewer) => (
                                        <SelectItem key={reviewer.id} value={reviewer.id.toString()}>
                                            <div className="flex flex-col items-start text-left">
                                                <span>{reviewer.name || reviewer.email}</span>
                                                {reviewer.expertise && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        Uzmanlık: {reviewer.expertise}
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>İptal</Button>
                    <Button onClick={handleAssign} disabled={!selectedReviewer || assignMutation.isPending}>
                        {assignMutation.isPending ? "Atanıyor..." : "Ata"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
