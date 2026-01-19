import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle2, Scale, Users } from "lucide-react";

export default function ConsensusDashboard() {
    const { data: evaluations, isLoading } = trpc.evaluation.list.useQuery();

    // Logic to identify evaluations that need consensus (e.g., status is draft but has reviews)
    const consensusNeeded = evaluations?.filter(ev => ev.status === "draft") || [];

    if (isLoading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Uzlaşma Paneli (Board Chair)</h1>
                <p className="text-muted-foreground">Hakem puanları arasındaki farkları inceleyin ve nihai kararı verin.</p>
            </div>

            <div className="space-y-6">
                {consensusNeeded.length === 0 ? (
                    <p className="text-center py-12 text-muted-foreground">Uzlaşma bekleyen makale bulunmuyor.</p>
                ) : (
                    <div className="grid gap-6">
                        {consensusNeeded.map((ev) => (
                            <ConsensusCard key={ev.id} evaluation={ev} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ConsensusCard({ evaluation }: { evaluation: any }) {
    const { data: reviews } = trpc.review.listByEvaluation.useQuery({ evaluationId: evaluation.id });
    const { data: metrics } = trpc.review.getConsensusMetrics.useQuery({ evaluationId: evaluation.id });

    if (!reviews || reviews.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{evaluation.paperTitle}</CardTitle>
                        <CardDescription>{evaluation.paperAuthors}</CardDescription>
                    </div>
                    <Badge className="flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        Uzlaşma Bekliyor
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            Hakem Değerlendirmeleri ({reviews.length})
                        </h4>
                        {metrics && (
                            <Badge className={metrics.consensusScore > 80 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}>
                                Uzlaşma Skoru (ICC): %{metrics.consensusScore.toFixed(1)}
                            </Badge>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hakem</TableHead>
                                    <TableHead>Akademik (D1)</TableHead>
                                    <TableHead>Toplumsal (D2)</TableHead>
                                    <TableHead>Negatif (D3)</TableHead>
                                    <TableHead>HIS Skoru</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map((review, idx) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="font-medium">Hakem #{idx + 1}</TableCell>
                                        <TableCell>{parseFloat(review.scoreD1 || '0').toFixed(1)}</TableCell>
                                        <TableCell>{parseFloat(review.scoreD2 || '0').toFixed(1)}</TableCell>
                                        <TableCell>{parseFloat(review.scoreD3 || '0').toFixed(1)}</TableCell>
                                        <TableCell className="font-bold">{parseFloat(review.scoreHIS || '0').toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {metrics && metrics.discrepancy > 15 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                                <strong>Uyarı:</strong> Hakem puanları arasındaki fark ({metrics.discrepancy.toFixed(2)}) belirlenen eşiğin üzerindedir. Uzlaşma gereklidir.
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline">Yeni Hakem Ata</Button>
                    <Button>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Nihai Skoru Onayla
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
