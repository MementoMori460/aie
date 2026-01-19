import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Ana Sayfa
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Metodoloji</h1>
          <p className="text-muted-foreground text-lg">
            Akademik Makale Etki Değerlendirmesi sisteminin çalışma prensibi
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sistem Genel Bakış</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bu sistem, akademik makalelerin etkisini <strong>4 ana boyut</strong>, <strong>11 alt boyut</strong> ve <strong>33 gösterge</strong> üzerinden çok boyutlu olarak değerlendirir. Nicel ve nitel tüm göstergeler normalize edildikten sonra ağırlıklandırılarak <strong>0-100 arası Bütünsel Etki Skoru (HIS)</strong> hesaplanır.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Temel Prensipler</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Çok boyutlu değerlendirme (akademik, toplumsal, negatif, etik)</li>
                <li>✓ Şeffaf ve algoritmik hesaplama</li>
                <li>✓ Ağırlıklandırılmış formüller</li>
                <li>✓ Negatif etkileri sistematik olarak ele alma</li>
                <li>✓ Etik kapı bekçisi mekanizması</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 4 Main Dimensions */}
        <h2 className="text-2xl font-bold mb-4">4 Ana Boyut</h2>
        <div className="grid gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                D1: Akademik Etki (Ağırlık: 30%)
              </CardTitle>
              <CardDescription>
                Makalenin akademik dünyada yarattığı etki
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Alt Boyutlar:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• D1.1: Atıf ve Tanınma (4 gösterge)</li>
                  <li>• D1.2: Disiplinlerarası Etki (4 gösterge)</li>
                  <li>• D1.3: Uzun Vadeli Akademik Etki (3 gösterge)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                D2: Toplumsal ve Pratik Etki (Ağırlık: 35%)
              </CardTitle>
              <CardDescription>
                Makalenin toplum, politika ve ekonomi üzerindeki etkisi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Alt Boyutlar:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• D2.1: Medya ve Kamuoyu Etkisi (3 gösterge)</li>
                  <li>• D2.2: Politika ve Karar Alma Etkisi (4 gösterge)</li>
                  <li>• D2.3: Ekonomik ve Teknolojik Etki (4 gösterge)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                D3: Negatif Etki ve Risk (Ağırlık: -15%)
              </CardTitle>
              <CardDescription>
                Makalenin olumsuz sonuçları ve riskleri (ceza olarak işlenir)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Alt Boyutlar:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• D3.1: Sosyal ve Çevresel Zarar (3 gösterge)</li>
                  <li>• D3.2: Bilimsel Güvenilirlik Sorunları (3 gösterge)</li>
                  <li>• D3.3: Yanlış Kullanım ve Manipülasyon (3 gösterge)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                D4: Etik ve Sorumluluk (Ağırlık: 20%)
              </CardTitle>
              <CardDescription>
                Makalenin etik standartlara uyumu ve şeffaflığı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Alt Boyutlar:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• D4.1: Etik Standartlar (3 gösterge)</li>
                  <li>• D4.2: Şeffaflık ve Açık Bilim (3 gösterge)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Process */}
        <h2 className="text-2xl font-bold mb-4">Hesaplama Süreci</h2>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">1</span>
                    <span>Veri Toplama</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-11">
                    <p>33 gösterge için ham veri toplanır:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Nicel göstergeler (5 adet):</strong> Atıf sayısı, sosyal medya, patent, startup</li>
                      <li>• <strong>Nitel göstergeler (22 adet):</strong> Likert ölçeği (1-5 arası)</li>
                      <li>• <strong>İkili göstergeler (6 adet):</strong> Evet/Hayır (0 veya 1)</li>
                    </ul>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Veri Kaynakları:</strong> Google Scholar, Altmetric, Web of Science, patent veritabanları, politika dokümanları, makale metni
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step2">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</span>
                    <span>Normalizasyon</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-11">
                    <p>Tüm göstergeler 0-1 arasına normalize edilir:</p>
                    <div className="space-y-2 text-sm">
                      <div className="bg-muted p-3 rounded">
                        <strong>Logaritmik:</strong> N = log(1+x) / log(1+x_max)<br/>
                        <span className="text-muted-foreground">Geniş aralıklı nicel veriler için (atıf, sosyal medya)</span>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <strong>Lineer:</strong> N = (x-1) / 4<br/>
                        <span className="text-muted-foreground">Likert ölçekli (1-5) veriler için</span>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <strong>İkili:</strong> N = x<br/>
                        <span className="text-muted-foreground">Evet/Hayır (0 veya 1) veriler için</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step3">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">3</span>
                    <span>Alt Boyut Hesaplama</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-11">
                    <p>11 alt boyut skoru hesaplanır:</p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Formül:</strong> S_ij = Σ (w_ijk × N_ijk)<br/>
                      <span className="text-muted-foreground">Her göstergenin normalize değeri, ağırlığı ile çarpılıp toplanır</span>
                    </div>
                    <p className="text-sm">Örnek: D1.1 (Atıf ve Tanınma)</p>
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      S_11 = 0.30×N_111 + 0.25×N_112 + 0.25×N_113 + 0.20×N_114
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step4">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">4</span>
                    <span>Ana Boyut Hesaplama</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-11">
                    <p>4 ana boyut skoru hesaplanır:</p>
                    <div className="bg-muted p-3 rounded text-sm">
                      <strong>Formül:</strong> D_i = Σ (w_ij × S_ij)<br/>
                      <span className="text-muted-foreground">Her alt boyutun skoru, ağırlığı ile çarpılıp toplanır</span>
                    </div>
                    <p className="text-sm">Örnek: D1 (Akademik Etki)</p>
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      D1 = 0.40×S_11 + 0.30×S_12 + 0.30×S_13
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step5">
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">5</span>
                    <span>HIS Hesaplama</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-11">
                    <p>Bütünsel Etki Skoru (0-100 arası) hesaplanır:</p>
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      HIS = (0.429×D1 + 0.500×D2 - 0.214×D3 + 0.286×D4) × 100
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded text-sm">
                      <strong>⚠️ Etik Kapı Bekçisi:</strong><br/>
                      Eğer etik onay yoksa (I_411 = 0), HIS maksimum 50 olabilir
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Key Features */}
        <h2 className="text-2xl font-bold mb-4">Önemli Özellikler</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Negatif Etki Mekanizması</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                D3 (Negatif Etki) boyutu <strong>negatif ağırlıkla (-15%)</strong> hesaba katılır. Yüksek negatif etki, HIS skorunu düşürür. Maksimum ceza: -21.4 puan.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etik Kapı Bekçisi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Etik onay olmayan makaleler (I_411 = 0) için HIS <strong>maksimum 50 puan</strong> ile sınırlandırılır. Bu, etik standartların önemini vurgular.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ağırlıklandırma Sistemi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                3 seviyeli ağırlıklandırma: Ana boyut (4), alt boyut (11) ve gösterge (33) seviyelerinde. Toplumsal etki en yüksek ağırlığa sahip (%35).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Şeffaflık ve Tekrarlanabilirlik</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Tüm formüller, ağırlıklar ve hesaplamalar açık ve şeffaftır. Aynı veri ile her zaman aynı sonuç elde edilir.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Score Interpretation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>HIS Skoru Yorumlama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950 rounded">
                <span className="font-bold text-red-600 dark:text-red-400">0-30</span>
                <span>Düşük Etki</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded">
                <span className="font-bold text-orange-600 dark:text-orange-400">30-50</span>
                <span>Orta-Düşük Etki</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                <span className="font-bold text-yellow-600 dark:text-yellow-400">50-70</span>
                <span>Orta-Yüksek Etki</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded">
                <span className="font-bold text-green-600 dark:text-green-400">70-90</span>
                <span>Yüksek Etki</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded">
                <span className="font-bold text-blue-600 dark:text-blue-400">90-100</span>
                <span>Çok Yüksek Etki</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="flex gap-4">
          <Link href="/documentation">
            <Button variant="outline">
              Dokümantasyon →
            </Button>
          </Link>
          <Link href="/indicators">
            <Button variant="outline">
              Gösterge Listesi →
            </Button>
          </Link>
          <Link href="/new">
            <Button>
              Değerlendirme Başlat →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
