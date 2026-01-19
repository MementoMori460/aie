import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, TrendingUp, Network, Zap, Target, BarChart3 } from "lucide-react";
import { COMPREHENSIVE_DIMENSIONS } from "../../../shared/comprehensiveDimensions";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";

export default function EvaluationReport() {
  const [, params] = useRoute("/evaluation/report/:id");
  const [, setLocation] = useLocation();
  const evaluationId = params?.id ? parseInt(params.id) : null;

  const { data: evaluation, isLoading } = trpc.evaluation.get.useQuery(
    { id: evaluationId! },
    { enabled: !!evaluationId }
  );

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
        <Alert>
          <AlertDescription>Değerlendirme bulunamadı</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isComprehensive = evaluation.evaluationMode === "comprehensive";
  const cascadeMultiplier = parseFloat(evaluation.cascadeMultiplier || "1.0");
  const economicMultiplier = parseFloat(evaluation.economicMultiplier || "1.0");
  const socialMultiplier = parseFloat(evaluation.socialMultiplier || "1.0");
  const networkEffectScore = parseFloat(evaluation.networkEffectScore || "0");
  const his = parseFloat(evaluation.scoreHIS || "0");

  // Get dimension scores
  const dimensionScores: Record<string, number> = {};
  const chartData: any[] = [];

  for (let i = 1; i <= 16; i++) {
    const key = `scoreD${i}` as keyof typeof evaluation;
    const value = evaluation[key];
    if (value !== undefined && value !== null) {
      const score = parseFloat(value as string);
      dimensionScores[`D${i}`] = score;

      // Only include relevant dimensions in chart data
      if (isComprehensive || i <= 4) {
        chartData.push({
          subject: `D${i}`,
          fullMark: 100,
          A: score,
        });
      }
    }
  }

  const cascadeLevels = [
    { level: 1, name: "Birincil", multiplier: 1.0, color: "#3b82f6", desc: "Bilimsel Katkı" },
    { level: 2, name: "İkincil", multiplier: economicMultiplier * 0.85, color: "#22c55e", desc: "Teknoloji Transferi" },
    { level: 3, name: "Üçüncül", multiplier: socialMultiplier * 0.7, color: "#a855f7", desc: "Toplumsal Dönüşüm" },
    { level: 4, name: "Dördüncül", multiplier: cascadeMultiplier * 0.55, color: "#f97316", desc: "Sistemik Değişim" },
    { level: 5, name: "Beşincil", multiplier: cascadeMultiplier * 0.4, color: "#ef4444", desc: "Küresel Paradigma" },
  ];

  const exportPdf = trpc.export.pdf.useMutation();
  const exportExcel = trpc.export.excel.useMutation();

  const downloadReport = async () => {
    try {
      const result = await exportPdf.mutateAsync({ evaluationId: evaluationId! });
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.data}`;
      link.download = result.filename;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/evaluations")}
            className="mb-4 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Değerlendirmelere Dön
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">Etki Raporu</h1>
              <p className="text-xl text-muted-foreground font-medium">{evaluation.paperTitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="text-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                {isComprehensive ? "Kapsamlı Analiz" : "Hızlı Analiz"}
              </Badge>
              <Button
                size="lg"
                className="rounded-full shadow-lg"
                onClick={downloadReport}
                disabled={exportPdf.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {exportPdf.isPending ? "Hazırlanıyor..." : "Raporu İndir"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* HIS Gauge Score */}
          <Card className="lg:col-span-1 border-primary/20 bg-primary/5 min-h-[350px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Target className="w-12 h-12 text-primary/10" />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-lg text-muted-foreground uppercase tracking-widest">Bütünsel Etki Skoru</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - his / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-primary">{his.toFixed(1)}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Puan</span>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground px-4">
                Bu makale, kendi kategorisindeki çalışmalar arasında <strong>%{his.toFixed(0)}</strong> başarı dilimindedir.
              </p>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-2 min-h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Boyut Dağılım Analizi
              </CardTitle>
              <CardDescription>Etki boyutlarının karşılaştırmalı görselleştirmesi</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <Radar
                    name="Skor"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Multipliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Genel Çarpan", value: cascadeMultiplier, color: "text-blue-600", bg: "bg-blue-50", icon: TrendingUp },
            { label: "Ekonomik", value: economicMultiplier, color: "text-green-600", bg: "bg-green-50", icon: Zap },
            { label: "Sosyal", value: socialMultiplier, color: "text-purple-600", bg: "bg-purple-50", icon: Network },
            { label: "Ağ Etkisi", value: networkEffectScore / 10, color: "text-orange-600", bg: "bg-orange-50", icon: Target },
          ].map((item, idx) => (
            <Card key={idx} className={`${item.bg} border-none shadow-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                </div>
                <div className={`text-3xl font-black ${item.color}`}>{item.value.toFixed(2)}x</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Detailed Scores List */}
          <Card>
            <CardHeader>
              <CardTitle>Boyut Bazlı Performans</CardTitle>
              <CardDescription>Detaylı puan dökümü</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {COMPREHENSIVE_DIMENSIONS.filter(dim => {
                  if (isComprehensive) return true;
                  return ["D1", "D2", "D3", "D4"].includes(dim.code);
                }).map((dimension) => {
                  const score = dimensionScores[dimension.code] || 0;
                  return (
                    <div key={dimension.code} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {dimension.code}
                          </div>
                          <span className="text-sm font-semibold group-hover:text-primary transition-colors">{dimension.name}</span>
                        </div>
                        <span className="text-sm font-bold">{score.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 shadow-inner">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cascade Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Zincirleme Etki Akışı</CardTitle>
              <CardDescription>Seviye bazlı kümülatif büyüme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cascadeLevels.map((lvl) => (
                  <div key={lvl.level} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ backgroundColor: lvl.color }}
                      >
                        L{lvl.level}
                      </div>
                      {lvl.level < 5 && <div className="w-0.5 h-8 bg-muted-foreground/20 my-1" />}
                    </div>
                    <div className="flex-1 bg-muted/30 p-3 rounded-xl border border-muted/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{lvl.name} Etki</span>
                        <span className="font-black text-xs px-2 py-0.5 rounded bg-white" style={{ color: lvl.color }}>
                          {lvl.multiplier.toFixed(2)}x
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{lvl.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-primary text-primary-foreground rounded-2xl flex justify-between items-center shadow-lg transform hover:scale-[1.02] transition-transform">
                  <div>
                    <h3 className="font-black text-lg leading-tight">Toplam Kümülatif Etki</h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Tüm kademeler dahil</p>
                  </div>
                  <div className="text-3xl font-black italic">
                    {(cascadeLevels.reduce((a, b) => a + b.multiplier, 0) - 4).toFixed(2)}x
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
