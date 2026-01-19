import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function ReviewPage() {
    const { id } = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const { data: evaluation, isLoading } = trpc.evaluation.get.useQuery({ id: parseInt(id!) });
    const { data: user } = trpc.auth.me.useQuery();

    const [scores, setScores] = useState({
        D1: 50,
        D2: 50,
        D3: 0,
        D4: 100,
    });
    const [comment, setComment] = useState("");

    const saveMutation = trpc.review.save.useMutation({
        onSuccess: () => {
            toast.success("Değerlendirme kaydedildi");
            setLocation("/reviewer");
        },
    });

    if (isLoading) return <div className="p-8">Yükleniyor...</div>;

    const handleSubmit = (status: "draft" | "submitted") => {
        saveMutation.mutate({
            evaluationId: parseInt(id!),
            reviewerId: user?.id || 0,
            scoreD1: scores.D1,
            scoreD2: scores.D2,
            scoreD3: scores.D3,
            scoreD4: scores.D4,
            comment,
            status,
        });
    };

    return (
        <div className="container py-8 max-w-4xl">
            <Button variant="ghost" onClick={() => setLocation("/reviewer")} className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Panel'e Dön
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Puanlama: {evaluation?.paperTitle}</h1>
                <p className="text-muted-foreground">Makalenin boyutlarını 0-100 ölçeğinde değerlendirin.</p>
            </div>

            <div className="space-y-6">
                {/* Dimension Scoring */}
                {[
                    { key: "D1", name: "Akademik Etki", desc: "Bilimsel topluluk üzerindeki etki" },
                    { key: "D2", name: "Toplumsal ve Pratik Etki", desc: "Toplum ve endüstri üzerindeki fayda" },
                    { key: "D3", name: "Negatif Etki ve Risk", desc: "Potansiyel olumsuz sonuçlar (Yüksek = Kötü)" },
                    { key: "D4", name: "Etik ve Sorumluluk", desc: "Etik standartlara bağlılık" },
                ].map((dim) => (
                    <Card key={dim.key}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{dim.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{dim.desc}</p>
                                </div>
                                <div className="text-2xl font-bold text-primary">
                                    {scores[dim.key as keyof typeof scores]}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Slider
                                value={[scores[dim.key as keyof typeof scores]]}
                                onValueChange={(val) => setScores({ ...scores, [dim.key]: val[0] })}
                                max={100}
                                step={1}
                            />
                        </CardContent>
                    </Card>
                ))}

                {/* Comment field */}
                <Card>
                    <CardHeader>
                        <CardTitle>Genel Değerlendirme Notu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Makale hakkındaki görüşlerinizi buraya yazabilirsiniz..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saveMutation.isPending}>
                        Taslak Olarak Kaydet
                    </Button>
                    <Button onClick={() => handleSubmit("submitted")} disabled={saveMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        Değerlendirmeyi Tamamla
                    </Button>
                </div>
            </div>
        </div>
    );
}
