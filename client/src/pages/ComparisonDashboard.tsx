import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Layers, Info } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function ComparisonDashboard() {
    const [location] = useLocation();
    const searchParams = new URLSearchParams(location.split("?")[1]);
    const idsParam = searchParams.get("ids");
    const ids = idsParam ? idsParam.split(",").map(Number) : [];

    const { data: evaluations, isLoading } = trpc.evaluation.getMany.useQuery({ ids }, {
        enabled: ids.length > 0
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!evaluations || evaluations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-muted-foreground">Karşılaştırılacak değerlendirme bulunamadı.</p>
                <Button onClick={() => window.history.back()}>Geri Dön</Button>
            </div>
        );
    }

    // Prepare radar chart data
    const dimensions = [
        { key: 'scoreD1', label: 'Akademik' },
        { key: 'scoreD2', label: 'Toplumsal' },
        { key: 'scoreD3', label: 'Negatif' },
        { key: 'scoreD4', label: 'Etik' },
        { key: 'scoreD5', label: 'Ekonomik' },
        { key: 'scoreD6', label: 'Sağlık' },
        { key: 'scoreD7', label: 'Çevre' },
        { key: 'scoreD8', label: 'Politik' },
        { key: 'scoreD9', label: 'Teknolojik' },
        { key: 'scoreD10', label: 'Kültürel' },
        { key: 'scoreD11', label: 'Eğitim' },
        { key: 'scoreD12', label: 'Dijital' },
        { key: 'scoreD13', label: 'Güvenlik' },
        { key: 'scoreD14', label: 'Psikolojik' },
        { key: 'scoreD15', label: 'İşbirliği' },
        { key: 'scoreD16', label: 'Zincirleme' },
    ];

    const radarData = dimensions.map(d => {
        const dataPoint: any = { subject: d.label };
        evaluations.forEach((evalItem, index) => {
            dataPoint[`eval${index}`] = parseFloat((evalItem as any)[d.key] || 0);
        });
        return dataPoint;
    });

    const colors = [
        'hsl(var(--primary))',
        '#f59e0b',
        '#10b981',
        '#ef4444',
        '#8b5cf6',
        '#ec4899'
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container max-w-7xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Geri Dön
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Layers className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Değerlendirme Karşılaştırması</h1>
                            <p className="text-muted-foreground">
                                Seçilen {evaluations.length} çalışmanın etki analizlerinin karşılaştırmalı görünümü
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Visual Comparison */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                Bütünsel Etki Karşılaştırması (Radar)
                                <Badge variant="outline" className="ml-auto">16 Boyut</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[500px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    {evaluations.map((evalItem, index) => (
                                        <Radar
                                            key={evalItem.id}
                                            name={evalItem.paperTitle.substring(0, 30) + '...'}
                                            dataKey={`eval${index}`}
                                            stroke={colors[index % colors.length]}
                                            fill={colors[index % colors.length]}
                                            fillOpacity={0.2}
                                        />
                                    ))}
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Key Metrics Summary */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">HIS Skoru Kıyaslaması</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {evaluations.map((evalItem, index) => (
                                        <div key={evalItem.id} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-medium truncate max-w-[200px]" title={evalItem.paperTitle}>
                                                    {evalItem.paperTitle}
                                                </span>
                                                <span className="font-bold text-lg" style={{ color: colors[index % colors.length] }}>
                                                    {parseFloat(evalItem.scoreHIS || '0').toFixed(0)}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${parseFloat(evalItem.scoreHIS || '0')}%`,
                                                        backgroundColor: colors[index % colors.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Analiz Notu
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600 leading-relaxed">
                                Bu görünüm, seçilen çalışmaların 16 farklı boyuttaki performansını yan yana getirir.
                                Grafikteki geniş alan (radar alanı), toplam etki potansiyelinin büyüklüğünü temsil ederken,
                                sivri uçlar spesifik bir boyuttaki baskın etkiyi gösterir.
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Data Table */}
                    <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Detaylı Boyut Puanları</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Etki Boyutu</th>
                                            {evaluations.map((evalItem, index) => (
                                                <th key={evalItem.id} className="px-4 py-3 font-semibold text-center" style={{ color: colors[index % colors.length] }}>
                                                    {evalItem.id}# {evalItem.paperTitle.substring(0, 20)}...
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {dimensions.map(d => (
                                            <tr key={d.key} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-700">{d.label}</td>
                                                {evaluations.map(evalItem => (
                                                    <td key={`${evalItem.id}-${d.key}`} className="px-4 py-3 text-center">
                                                        {parseFloat((evalItem as any)[d.key] || 0).toFixed(1)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50/80 font-bold">
                                            <td className="px-4 py-4 text-primary">HIS Bütünsel Skor</td>
                                            {evaluations.map((evalItem, index) => (
                                                <td key={evalItem.id} className="px-4 py-4 text-center text-lg" style={{ color: colors[index % colors.length] }}>
                                                    {parseFloat(evalItem.scoreHIS || '0').toFixed(1)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
