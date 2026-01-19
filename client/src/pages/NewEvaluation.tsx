import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Zap, Target } from "lucide-react";
import { Link } from "wouter";

type EvaluationMode = "quick" | "comprehensive";

export default function NewEvaluation() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"mode" | "details">("mode");
  const [selectedMode, setSelectedMode] = useState<EvaluationMode>("quick");
  const [formData, setFormData] = useState({
    paperTitle: "",
    paperAuthors: "",
    paperDoi: "",
    paperYear: new Date().getFullYear(),
    paperJournal: "",
    paperAbstract: "",
  });

  const createMutation = trpc.evaluation.create.useMutation({
    onSuccess: (data) => {
      toast.success("Değerlendirme oluşturuldu");
      // Navigate based on selected mode
      if (selectedMode === "quick") {
        setLocation(`/evaluations/${data.evaluationId}`);
      } else {
        setLocation(`/evaluation/comprehensive/${data.evaluationId}`);
      }
    },
    onError: (error) => {
      toast.error("Hata: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paperTitle.trim()) {
      toast.error("Makale başlığı zorunludur");
      return;
    }

    createMutation.mutate({
      ...formData,
      evaluationMode: selectedMode,
    });
  };

  const handleModeSelect = (mode: EvaluationMode) => {
    setSelectedMode(mode);
    setStep("details");
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("mode");
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === "mode" ? "Ana Sayfa" : "Geri"}
          </Button>
          <h1 className="text-3xl font-bold mb-2">Yeni Değerlendirme</h1>
          <p className="text-muted-foreground">
            {step === "mode" ? "Değerlendirme modunu seçin" : "Değerlendirmek istediğiniz makalenin temel bilgilerini girin"}
          </p>
        </div>

        {/* Step 1: Mode Selection */}
        {step === "mode" && (
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Quick Mode */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={() => handleModeSelect("quick")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-8 h-8 text-primary" />
                  <Badge>Önerilen</Badge>
                </div>
                <CardTitle>Hızlı Mod</CardTitle>
                <CardDescription>
                  Temel akademik etki değerlendirmesi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">37 gösterge</Badge>
                    <Badge variant="secondary">4 boyut</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    • Akademik etki<br />
                    • Toplumsal etki<br />
                    • Negatif etki ve risk<br />
                    • Etik ve sorumluluk
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      ⏱️ Tahmini süre: 15-30 dakika
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Mode */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
              onClick={() => handleModeSelect("comprehensive")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-primary" />
                  <Badge variant="outline">Gelişmiş</Badge>
                </div>
                <CardTitle>Kapsamlı Mod</CardTitle>
                <CardDescription>
                  Tam gerçek dünya etki analizi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">193 gösterge</Badge>
                    <Badge variant="secondary">16 boyut</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    • Tüm Hızlı Mod boyutları<br />
                    • Ekonomik, sağlık, çevresel etki<br />
                    • Teknolojik, sosyal, eğitim etkisi<br />
                    • Zincirleme etkiler ve çarpan katsayıları
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      ⏱️ Tahmini süre: 30-45 dakika<br />
                      📊 16 boyut seviyesi değerlendirme + zincirleme etki analizi
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Details - Only show if mode is selected */}
        {step === "details" && (
        <>
        {/* Bilgilendirme Bölümü */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Değerlendirme Süreci Hakkında
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Süreç Özeti */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Ne Yapılacak?</h3>
              <p className="text-muted-foreground">
                Akademik makalenizin etkisini <strong>4 ana boyut</strong> ve <strong>33 gösterge</strong> üzerinden kapsamlı olarak değerlendireceğiz. 
                Sistem, akademik etkiden toplumsal etkiye, negatif risklerden etik standartlara kadar tüm boyutları analiz ederek 
                <strong> Bütünsel Etki Skoru (HIS)</strong> hesaplar.
              </p>
            </div>

            {/* Otomatik Özellikler */}
            <div className="bg-background/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>✨</span> Otomatik Özellikler
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>PDF Yükleme:</strong> Makale PDF'inizi yükleyin, sistem otomatik olarak başlık, yazarlar, DOI, yıl ve özet bilgilerini çıkarır</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>AI ile Otomatik Doldurma:</strong> PDF yükledikten sonra "AI ile Otomatik Doldur" butonuna tıklayın, yapay zeka 33 gösterge için değer önerileri sunar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>Gerçek Zamanlı Hesaplama:</strong> Her gösterge değerini girdiğinizde puanlar otomatik olarak hesaplanır ve güncellenir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>Normalizasyon:</strong> Farklı ölçeklerdeki veriler (atıf sayısı, Likert ölçeği, evet/hayır) otomatik olarak 0-1 aralığına normalize edilir</span>
                </li>
              </ul>
            </div>

            {/* Manuel Müdahale */}
            <div className="bg-background/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>✏️</span> Manuel Müdahale ve Kontrol
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>AI Önerilerini Gözden Geçirme:</strong> AI'nın önerdiği değerleri kabul edebilir, reddedebilir veya düzeltebilirsiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>Elle Veri Girme:</strong> Tüm göstergeleri manuel olarak doldurabilirsiniz - AI kullanmak zorunlu değildir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>Kayıt ve Devam Etme:</strong> Her adımda "Kaydet" butonuyla ilerlemenizi kaydedebilir, daha sonra kaldığınız yerden devam edebilirsiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span><strong>Geri Dönülebilir Adımlar:</strong> Wizard'da ileri-geri giderek önceki adımlardaki verileri düzeltebilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* Veri Toplama Rehberi */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Veri Nasıl Toplanır?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Nicel Göstergeler (5 adet)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Atıf Sayısı:</strong> Google Scholar, Web of Science</li>
                    <li>• <strong>Sosyal Medya:</strong> Altmetric, PlumX</li>
                    <li>• <strong>Patent:</strong> Google Patents, USPTO</li>
                    <li>• <strong>Startup:</strong> Crunchbase, AngelList</li>
                    <li>• <strong>Politika:</strong> Manuel araştırma, haber kaynakları</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Nitel Göstergeler (22 adet)</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Likert Ölçeği:</strong> 1-5 arası değerlendirme</li>
                    <li>• <strong>1:</strong> Çok düşük / Hiç</li>
                    <li>• <strong>3:</strong> Orta / Makul</li>
                    <li>• <strong>5:</strong> Çok yüksek / Mükemmel</li>
                    <li>• Her gösterge için detaylı açıklama ve örnekler mevcuttur</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Hesaplama Detayları */}
            <div className="bg-background/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Hesaplama Nasıl Yapılır?</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">1. Normalizasyon:</strong> Her gösterge değeri 0-1 aralığına dönüştürülür
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Logaritmik: Geniş aralıklı nicel veriler (atıf, sosyal medya)</li>
                    <li>• Lineer: Likert ölçekli veriler (1-5 → 0-1)</li>
                    <li>• İkili: Evet/Hayır verileri (1 veya 0)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">2. Alt Boyut Skoru:</strong> Her alt boyuttaki göstergelerin ağırlıklı ortalaması alınır (11 alt boyut)
                </div>
                <div>
                  <strong className="text-foreground">3. Ana Boyut Skoru:</strong> Alt boyut skorlarının ağırlıklı ortalaması alınır (4 ana boyut)
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• D1 (Akademik Etki): 35% ağırlık</li>
                    <li>• D2 (Toplumsal Etki): 40% ağırlık</li>
                    <li>• D3 (Negatif Etki): -15% ağırlık (ceza)</li>
                    <li>• D4 (Etik): 10% ağırlık</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">4. HIS (Bütünsel Etki Skoru):</strong> Ana boyut skorlarının ağırlıklı toplamı, 0-100 aralığında
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Etik Kapı Bekçisi:</strong> Etik standartlar düşükse HIS maksimum 50 ile sınırlanır</li>
                    <li>• <strong>Negatif Etki Cezası:</strong> Zararlı sonuçlar HIS'i düşürür</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Adım Adım Rehber */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Değerlendirme Adımları</h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="font-semibold text-primary mb-1">Adım 1: Makale Bilgileri</div>
                  <p className="text-muted-foreground">Başlık, yazarlar, DOI, yıl, dergi ve özet bilgilerini girin (veya PDF yükleyin)</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="font-semibold text-primary mb-1">Adım 2-5: Göstergeler</div>
                  <p className="text-muted-foreground">4 ana boyut için 33 göstergeyi doldurun (AI yardımı veya manuel)</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="font-semibold text-primary mb-1">Adım 6: Sonuçlar</div>
                  <p className="text-muted-foreground">HIS skorunu görün, grafikler inceleyin, Excel/PDF rapor indirin</p>
                </div>
              </div>
            </div>

            {/* Ek Bilgiler */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Not:</strong> Tüm formüller, ağırlıklar ve hesaplama detayları için 
                <Link href="/methodology" className="text-primary hover:underline ml-1">Metodoloji</Link> ve 
                <Link href="/documentation" className="text-primary hover:underline ml-1">Dokümantasyon</Link> sayfalarını inceleyebilirsiniz.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Makale Bilgileri</CardTitle>
                  <CardDescription>
                    Bu bilgiler değerlendirme raporunda kullanılacaktır
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {selectedMode === "quick" ? "Hızlı Mod" : "Kapsamlı Mod"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paper Title */}
              <div className="space-y-2">
                <Label htmlFor="paperTitle">
                  Makale Başlığı <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="paperTitle"
                  value={formData.paperTitle}
                  onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
                  placeholder="Örn: Yapay Zeka Etikleri Üzerine Bir Çalışma"
                  required
                />
              </div>

              {/* Authors */}
              <div className="space-y-2">
                <Label htmlFor="paperAuthors">Yazarlar</Label>
                <Input
                  id="paperAuthors"
                  value={formData.paperAuthors}
                  onChange={(e) => setFormData({ ...formData, paperAuthors: e.target.value })}
                  placeholder="Örn: Smith, J., Johnson, A., Williams, B."
                />
                <p className="text-sm text-muted-foreground">
                  Yazarları virgülle ayırarak girin
                </p>
              </div>

              {/* DOI and Year */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paperDoi">DOI</Label>
                  <Input
                    id="paperDoi"
                    value={formData.paperDoi}
                    onChange={(e) => setFormData({ ...formData, paperDoi: e.target.value })}
                    placeholder="10.1000/xyz123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paperYear">Yayın Yılı</Label>
                  <Input
                    id="paperYear"
                    type="number"
                    value={formData.paperYear}
                    onChange={(e) => setFormData({ ...formData, paperYear: parseInt(e.target.value) })}
                    min={1900}
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              {/* Journal */}
              <div className="space-y-2">
                <Label htmlFor="paperJournal">Dergi / Konferans</Label>
                <Input
                  id="paperJournal"
                  value={formData.paperJournal}
                  onChange={(e) => setFormData({ ...formData, paperJournal: e.target.value })}
                  placeholder="Örn: Nature, Science, IEEE Conference"
                />
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <Label htmlFor="paperAbstract">Özet (Abstract)</Label>
                <Textarea
                  id="paperAbstract"
                  value={formData.paperAbstract}
                  onChange={(e) => setFormData({ ...formData, paperAbstract: e.target.value })}
                  placeholder="Makalenin özetini buraya yapıştırın..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Özet, değerlendirme sürecinde referans olarak kullanılacaktır
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <Button type="button" variant="outline" onClick={() => setStep("mode")}>
              Modu Değiştir
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Oluşturuluyor..." : "Değerlendirmeye Başla"}
            </Button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
