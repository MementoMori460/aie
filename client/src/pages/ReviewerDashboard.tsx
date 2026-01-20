import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "wouter";
import { FileText, UserCheck, Clock, CheckCircle2, Users } from "lucide-react";

export default function ReviewerDashboard() {
    const { data: user } = trpc.auth.me.useQuery();
    const { data: evaluations, isLoading } = trpc.evaluation.list.useQuery();

    if (isLoading) {
        return (
            <div className="container py-8 space-y-4">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    // Filter for evaluations assigned to the reviewer is handled by backend
    const assignedEvaluations = evaluations || [];

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hakem Paneli</h1>
                    <p className="text-muted-foreground">
                        Size atanan değerlendirmeleri inceleyin ve puanlayın.
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                    {user?.role === "reviewer" ? "Hakem" : "Yönetici"}
                </Badge>
            </div>

            {assignedEvaluations.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/20">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Bekleyen Atama Yok</h3>
                    <p className="text-muted-foreground">Şu anda size atanmış yeni bir değerlendirme bulunmuyor.</p>
                </div>
            ) : (
                <div className="border rounded-lg bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Makale Başlığı</TableHead>
                                <TableHead>Yazarlar</TableHead>
                                <TableHead className="text-center">Mod</TableHead>
                                <TableHead className="text-center">Durum</TableHead>
                                <TableHead className="text-right">İşlem</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignedEvaluations.map((ev) => (
                                <TableRow key={ev.id}>
                                    <TableCell className="font-medium max-w-[300px]">
                                        <div className="truncate" title={ev.paperTitle}>
                                            {ev.paperTitle}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate text-muted-foreground" title={ev.paperAuthors || undefined}>
                                            {ev.paperAuthors || "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">
                                            {ev.evaluationMode === "quick" ? "Hızlı" : "Kapsamlı"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col gap-2 items-center">
                                            {/* My Status */}
                                            {(ev as any).assignmentStatus === "completed" ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Siz Değerlendirdiniz
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Atama Bekliyor
                                                </Badge>
                                            )}

                                            {/* Global Count */}
                                            {(ev as any).completedReviewCount > 0 && (
                                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                                    <Users className="w-3 h-3 mr-1" />
                                                    {(ev as any).completedReviewCount} Hakem Değerlendirdi
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/review/${ev.id}`}>
                                            <Button size="sm">Puanlamaya Başla</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
