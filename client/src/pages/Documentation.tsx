import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, FileText, Calculator, List } from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  const documents = [
    {
      id: "comprehensive",
      title: "Kapsamlı Kılavuz",
      description: "Akademik makale etki değerlendirmesi için tam kılavuz - sistem mimarisi, göstergeler, formüller ve örnekler",
      icon: BookOpen,
      file: "/docs/AKADEMIK_MAKALE_ETKI_DEGERLENDIRMESI_KAPSAMLI_KILAVUZ.md",
      pages: "113 sayfa",
      sections: "10 ana bölüm"
    },
    {
      id: "parameters",
      title: "Sistem Parametreleri ve Hesaplama Detayları",
      description: "Tüm parametrelerin, formüllerin ve etkileşimlerin teknik dokümantasyonu",
      icon: FileText,
      file: "/docs/SISTEM_PARAMETRELERI_VE_HESAPLAMA_DETAYLARI.md",
      pages: "113 sayfa",
      sections: "13 ana bölüm"
    },
    {
      id: "formulas",
      title: "Eksiksiz Formül Listesi ve Kılavuz",
      description: "Ağırlıklandırılmış formüller, algoritmik hesaplama ve Python kod örnekleri",
      icon: Calculator,
      file: "/docs/EKSIKSIZ_FORMUL_LISTESI_VE_KILAVUZ.md",
      pages: "85 sayfa",
      sections: "8 ana bölüm"
    },
    {
      id: "stepbystep",
      title: "Adım Adım Hesaplama Kılavuzu",
      description: "Operatör seviyesinde hesaplama rehberi - hangi parametre, nereden, nasıl, ne zaman",
      icon: List,
      file: "/docs/ADIM_ADIM_HESAPLAMA_KILAVUZU.md",
      pages: "95 sayfa",
      sections: "9 ana bölüm"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Ana Sayfa
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Dokümantasyon</h1>
          <p className="text-muted-foreground text-lg">
            Akademik Makale Etki Değerlendirmesi sisteminin tam teknik dokümantasyonu
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sistem Hakkında</CardTitle>
            <CardDescription>
              Bu sistem, akademik makalelerin etkisini çok boyutlu olarak değerlendirmek için geliştirilmiştir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Temel Özellikler</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 33 gösterge ile kapsamlı değerlendirme</li>
                  <li>• 4 ana boyut: Akademik, Toplumsal, Negatif, Etik</li>
                  <li>• 11 alt boyut için detaylı analiz</li>
                  <li>• Otomatik normalizasyon ve ağırlıklandırma</li>
                  <li>• 0-100 arası Bütünsel Etki Skoru (HIS)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dokümantasyon İçeriği</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Sistem mimarisi ve tasarım prensipleri</li>
                  <li>• Tüm göstergeler için detaylı açıklamalar</li>
                  <li>• Matematiksel formüller ve hesaplama yöntemleri</li>
                  <li>• Adım adım operasyonel kılavuzlar</li>
                  <li>• Excel ve Python kod örnekleri</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Tabs defaultValue="comprehensive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {documents.map((doc) => (
              <TabsTrigger key={doc.id} value={doc.id}>
                <doc.icon className="w-4 h-4 mr-2" />
                {doc.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {documents.map((doc) => (
            <TabsContent key={doc.id} value={doc.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <doc.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{doc.title}</CardTitle>
                        <CardDescription className="text-base">
                          {doc.description}
                        </CardDescription>
                        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                          <span>📄 {doc.pages}</span>
                          <span>📑 {doc.sections}</span>
                        </div>
                      </div>
                    </div>
                    <a href={doc.file} download>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        İndir
                      </Button>
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doc.id === "comprehensive" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">İçerik Özeti</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 0:</span>
                            <span className="text-muted-foreground">Makale Künyesi ve Temel Bilgiler</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 1:</span>
                            <span className="text-muted-foreground">Makale Yaşam Döngüsü Analizi (4 faz)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 2:</span>
                            <span className="text-muted-foreground">Bütünsel Etki Analizi (9 kategori)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 3:</span>
                            <span className="text-muted-foreground">Sonuç ve HIS Puanı (1-100)</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {doc.id === "parameters" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">İçerik Özeti</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 1-2:</span>
                            <span className="text-muted-foreground">Sistem Mimarisi ve 33 Gösterge Detayları</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 3-5:</span>
                            <span className="text-muted-foreground">Normalizasyon, Ağırlıklandırma ve Formüller</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 6-8:</span>
                            <span className="text-muted-foreground">Etkileşimler, Uç Durumlar ve Hassasiyet Analizi</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 9-10:</span>
                            <span className="text-muted-foreground">Gelişmiş Özellikler ve Hızlı Referans</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {doc.id === "formulas" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">İçerik Özeti</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 1:</span>
                            <span className="text-muted-foreground">33 Göstergenin Hiyerarşik Yapısı</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 2:</span>
                            <span className="text-muted-foreground">Ağırlıklandırma ve Normalizasyon Fonksiyonları</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 3-4:</span>
                            <span className="text-muted-foreground">Alt/Ana Boyut Formülleri ve HIS Modeli</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 5-8:</span>
                            <span className="text-muted-foreground">Python Kodu, Hesaplama Örnekleri ve Hassasiyet Analizi</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {doc.id === "stepbystep" && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">İçerik Özeti</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Adım 1:</span>
                            <span className="text-muted-foreground">Veri Toplama (33 gösterge için detaylı rehber)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Adım 2:</span>
                            <span className="text-muted-foreground">Normalizasyon (4 fonksiyon, Excel/Python)</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Adım 3-4:</span>
                            <span className="text-muted-foreground">Alt Boyut ve Ana Boyut Hesaplama</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Adım 5:</span>
                            <span className="text-muted-foreground">HIS Hesaplama ve Etik Kapı Bekçisi</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-medium min-w-[200px]">Bölüm 7-9:</span>
                            <span className="text-muted-foreground">Tam Örnek, Hata Kontrolü ve SSS</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metodoloji</CardTitle>
              <CardDescription>Sistemin nasıl çalıştığını öğrenin</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/methodology">
                <Button variant="outline" className="w-full">
                  Metodoloji Sayfası →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Göstergeler</CardTitle>
              <CardDescription>33 göstergenin detaylı açıklamaları</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/indicators">
                <Button variant="outline" className="w-full">
                  Gösterge Listesi →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Yeni Değerlendirme</CardTitle>
              <CardDescription>Makale değerlendirmesine başlayın</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/new">
                <Button className="w-full">
                  Değerlendirme Başlat →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
