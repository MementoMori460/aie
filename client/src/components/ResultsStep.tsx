import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { calculateHIS } from "@shared/calculations";
import { BarChart3, TrendingUp, TrendingDown, Shield, AlertTriangle, FileSpreadsheet, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResultsStepProps {
  evaluationId: number;
}

export default function ResultsStep({ evaluationId }: ResultsStepProps) {
  const { data: evaluation } = trpc.evaluation.get.useQuery({ id: evaluationId });
  const [his, setHis] = useState<number>(0);
  
  const updateMutation = trpc.evaluation.update.useMutation();
  const exportExcelMutation = trpc.export.excel.useMutation();
  const exportPdfMutation = trpc.export.pdf.useMutation();
  
  const handleExportExcel = async () => {
    try {
      const result = await exportExcelMutation.mutateAsync({ evaluationId });
      
      // Convert base64 to blob and download
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel raporu indirildi');
    } catch (error) {
      toast.error('Excel raporu oluşturulamadı: ' + (error as Error).message);
    }
  };
  
  const handleExportPdf = async () => {
    try {
      const result = await exportPdfMutation.mutateAsync({ evaluationId });
      
      // Convert base64 to blob and download
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF raporu indirildi');
    } catch (error) {
      toast.error('PDF raporu oluşturulamadı: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    if (evaluation) {
      const d1 = parseFloat(evaluation.scoreD1 || "0");
      const d2 = parseFloat(evaluation.scoreD2 || "0");
      const d3 = parseFloat(evaluation.scoreD3 || "0");
      const d4 = parseFloat(evaluation.scoreD4 || "0");

      const hisScore = calculateHIS(d1, d2, d3, d4);
      setHis(hisScore);

      // Update evaluation with dimension scores and mark as completed
      // Backend will auto-calculate HIS
      if (evaluation.status !== "completed") {
        updateMutation.mutate({
          id: evaluationId,
          D1: d1,
          D2: d2,
          D3: d3,
          D4: d4,
          status: "completed",
          completedAt: new Date(),
        });
      }
    }
  }, [evaluation]);

  if (!evaluation) {
    return <div>Yükleniyor...</div>;
  }

  const d1 = parseFloat(evaluation.scoreD1 || "0");
  const d2 = parseFloat(evaluation.scoreD2 || "0");
  const d3 = parseFloat(evaluation.scoreD3 || "0");
  const d4 = parseFloat(evaluation.scoreD4 || "0");

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { label: "Yüksek", variant: "default" as const };
    if (score >= 40) return { label: "Orta", variant: "secondary" as const };
    return { label: "Düşük", variant: "destructive" as const };
  };

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="gap-2"
          disabled={exportExcelMutation.isPending}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {exportExcelMutation.isPending ? 'Oluşturuluyor...' : 'Excel İndir'}
        </Button>
        <Button
          onClick={handleExportPdf}
          variant="outline"
          className="gap-2"
          disabled={exportPdfMutation.isPending}
        >
          <FileText className="w-4 h-4" />
          {exportPdfMutation.isPending ? 'Oluşturuluyor...' : 'PDF İndir'}
        </Button>
      </div>
      
      {/* HIS Score */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">     <CardHeader>
          <CardTitle className="text-center text-2xl">Bütünsel Etki Skoru (HIS)</CardTitle>
          <CardDescription className="text-center">
            Holistic Impact Score - Tüm boyutların ağırlıklı ortalaması
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-7xl font-bold ${getScoreColor(his)}`}>
              {his.toFixed(0)}
            </div>
            <div className="text-muted-foreground mt-2">100 üzerinden</div>
            <Badge {...getScoreBadge(his)} className="mt-4 text-lg px-6 py-2">
              {getScoreBadge(his).label} Etki
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* D1: Academic Impact */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">D1: Akademik Etki</CardTitle>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {d1.toFixed(0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={d1} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Bilimsel topluluk içindeki etki ve katkı
            </p>
          </CardContent>
        </Card>

        {/* D2: Social & Practical Impact */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">D2: Toplumsal Etki</CardTitle>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {d2.toFixed(0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={d2} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Akademi dışındaki dünyada yarattığı değişim
            </p>
          </CardContent>
        </Card>

        {/* D3: Negative Impact */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg">D3: Negatif Etki</CardTitle>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {d3.toFixed(0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={d3} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Yarattığı veya yaratabileceği zararlar (düşük daha iyi)
            </p>
          </CardContent>
        </Card>

        {/* D4: Ethics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">D4: Etik</CardTitle>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {d4.toFixed(0)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={d4} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Araştırmanın etik standartları
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>Sonuç Yorumu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">HIS Skoru: {his.toFixed(0)}/100</h4>
            <p className="text-sm text-muted-foreground">
              {his >= 70 && "Bu makale, akademik ve toplumsal açıdan yüksek etki yaratmış, etik standartlara uygun ve negatif etkileri düşük bir çalışmadır."}
              {his >= 40 && his < 70 && "Bu makale, orta düzeyde etki yaratmış bir çalışmadır. Bazı alanlarda güçlü, bazı alanlarda iyileştirme potansiyeli vardır."}
              {his < 40 && "Bu makale, düşük etki skoru almıştır. Akademik veya toplumsal etkisi sınırlı olabilir, ya da negatif etki ve etik sorunlar skorunu düşürmüş olabilir."}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Güçlü Yönler:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {d1 >= 60 && <li>Akademik toplulukta güçlü etki</li>}
              {d2 >= 60 && <li>Toplumsal ve pratik uygulamalarda başarılı</li>}
              {d3 <= 30 && <li>Düşük negatif etki riski</li>}
              {d4 >= 70 && <li>Yüksek etik standartlar</li>}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Geliştirilmesi Gereken Alanlar:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {d1 < 40 && <li>Akademik etki artırılabilir (atıflar, disiplinlerarası çalışmalar)</li>}
              {d2 < 40 && <li>Toplumsal etki ve pratik uygulamalar geliştirilebilir</li>}
              {d3 > 50 && <li>Negatif etki ve riskler azaltılmalı</li>}
              {d4 < 60 && <li>Etik standartlar ve şeffaflık iyileştirilmeli</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Formula Explanation */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">HIS Hesaplama Formülü</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="font-mono bg-background p-3 rounded">
            RIS = (0.35 × D1) + (0.40 × D2)<br />
            M_E = (D4 / 100) ^ 2<br />
            M_N = (1 - D3 / 100) ^ 1.5<br />
            HIS = RIS × M_E × M_N
          </div>
          <p className="text-muted-foreground">
            <strong>RIS:</strong> Ham Etki Skoru (pozitif etkiler)<br />
            <strong>M_E:</strong> Etik Çarpanı (düşük etik = düşük çarpan)<br />
            <strong>M_N:</strong> Negatif Etki Ceza Çarpanı (yüksek negatif = düşük çarpan)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
