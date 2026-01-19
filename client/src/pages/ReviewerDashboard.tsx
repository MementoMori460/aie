import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { FileText, UserCheck, Clock } from "lucide-react";

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

    // Filter for evaluations assigned to the reviewer (Logic would be more complex in a real RBAC system)
    const assignedEvaluations = evaluations?.filter(ev => ev.status === "draft") || [];

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
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle>Bekleyen Atama Yok</CardTitle>
                        <CardDescription>
                            Şu anda size atanmış yeni bir değerlendirme bulunmuyor.
                        </CardDescription>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {assignedEvaluations.map((ev) => (
                        <Card key={ev.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Bekliyor
                                    </Badge>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg">
                                    {ev.paperTitle}
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {ev.paperAuthors || "Yazar belirtilmemiş"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        {ev.evaluationMode === "quick" ? "Hızlı" : "Kapsamlı"}
                                    </div>
                                </div>
                                <Link href={`/review/${ev.id}`}>
                                    <Button className="w-full">Puanlamaya Başla</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
