import { useAuth } from "@/_core/hooks/useAuth";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { FileText, Plus, BarChart3, BookOpen, Calculator, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Akademik Makale Etki Değerlendirmesi
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Akademik makalelerin etkisini bütünsel olarak değerlendirin. İki mod: Hızlı (37 gösterge, 4 boyut) veya Kapsamlı (193 gösterge, 16 boyut, zincirleme etkiler).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>
                  Giriş Yap ve Başla
                </a>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    Test Sürümü (Demo)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Kullanıcı Rolü Seçin</DialogTitle>
                    <DialogDescription>
                      Sistemi farklı kullanıcı rollerinde test etmek için aşağıdan seçim yapın.
                      Her rol için otomatik olarak dummy veri oluşturulacaktır.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {/* Researcher */}
                    <a href="/api/auth/mock?role=user&name=Demo Araştırmacı" className="block">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="text-3xl mb-2">👨‍🎓</div>
                          <CardTitle className="text-lg">Araştırmacı</CardTitle>
                          <CardDescription>
                            Kendi makalelerinizi değerlendirin ve raporlayın.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </a>

                    {/* Reviewer */}
                    <a href="/api/auth/mock?role=reviewer&name=Demo Hakem" className="block">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="text-3xl mb-2">👀</div>
                          <CardTitle className="text-lg">Hakem</CardTitle>
                          <CardDescription>
                            Size atanan makaleleri inceleyin ve puanlayın.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </a>

                    {/* Board Chair */}
                    <a href="/api/auth/mock?role=board_chair&name=Demo Kurul Başkanı" className="block">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="text-3xl mb-2">⚖️</div>
                          <CardTitle className="text-lg">Kurul Başkanı</CardTitle>
                          <CardDescription>
                            Hakem kararlarını yönetin ve konsensüs sağlayın.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </a>

                    {/* Admin */}
                    <a href="/api/auth/mock?role=admin&name=Demo Yönetici" className="block">
                      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <div className="text-3xl mb-2">🛠️</div>
                          <CardTitle className="text-lg">Sistem Yöneticisi</CardTitle>
                          <CardDescription>
                            Kullanıcıları, ayarları ve tüm sistemi yönetin.
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎬</span>
                  İnteraktif Demo
                </CardTitle>
                <CardDescription>
                  Örnek bir makalenin nasıl değerlendirildiğini adım adım izleyin.
                  Tüm süreci anlamak için ~5 dakika sürer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveDemo />
              </CardContent>
            </Card>
          </div>

          {/* Feature Links */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Link href="/documentation">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <BookOpen className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Dokümantasyon</CardTitle>
                  <CardDescription>
                    Sistem mimarisi, formüller ve hesaplama kılavuzları
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/methodology">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Calculator className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Metodoloji</CardTitle>
                  <CardDescription>
                    Sistemin çalışma prensibi ve hesaplama süreci
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/indicators">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <List className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle>Gösterge Listesi</CardTitle>
                  <CardDescription>
                    33 göstergenin detaylı açıklamaları
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <FileText className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Kapsamlı Değerlendirme</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  33 gösterge ile akademik, toplumsal, negatif ve etik boyutları değerlendirin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Detaylı Rehberlik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Her gösterge için açıklama, ölçüm yöntemi, örnekler ve ipuçları
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Otomatik Hesaplama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gerçek zamanlı puan hesaplama ve görselleştirme ile anında sonuç
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Methodology */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Bütünsel Etki Modeli (HIM)</CardTitle>
              <CardDescription>
                Reed et al. (2021) ve Morton (2015) araştırma çerçevelerine dayalı bilimsel metodoloji
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">4 Ana Boyut</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Akademik Etki (35%)</li>
                    <li>• Toplumsal ve Pratik Etki (40%)</li>
                    <li>• Negatif Etki ve Risk (15%)</li>
                    <li>• Etik ve Sorumluluk (10%)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Özellikler</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Ölçülebilen ve ölçülemeyen etkiler</li>
                    <li>• Negatif etki ve başarısızlık analizi</li>
                    <li>• Etik standartlar ve şeffaflık</li>
                    <li>• Bütünsel Etki Skoru (HIS)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user?.name}</h1>
            <p className="text-muted-foreground">
              Yeni bir değerlendirme başlatın veya mevcut değerlendirmelerinizi görüntüleyin
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/new">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Değerlendirme
            </Link>
          </Button>
        </div>

        {/* Interactive Demo Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎬</span>
                İnteraktif Demo
              </CardTitle>
              <CardDescription>
                Örnek bir makalenin nasıl değerlendirildiğini adım adım izleyin.
                Tüm süreci anlamak için ~5 dakika sürer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveDemo />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(user?.role === "user" || user?.role === "admin" || !user?.role) && (
            <>
              <Link href="/new">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <Plus className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>Yeni Değerlendirme Başlat</CardTitle>
                    <CardDescription>
                      Bir akademik makalenin etkisini değerlendirmeye başlayın
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/evaluations">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <FileText className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>Değerlendirme Geçmişi</CardTitle>
                    <CardDescription>
                      Tamamlanmış ve devam eden değerlendirmelerinizi görüntüleyin
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {user?.role === "reviewer" && (
            <Link href="/reviewer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-primary/20">
                <CardHeader>
                  <div className="w-8 h-8 mb-2 text-primary text-3xl">👀</div>
                  <CardTitle>Hakem Paneli</CardTitle>
                  <CardDescription>
                    Size atanan makaleleri inceleyin ve puanlayın.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}

          {user?.role === "board_chair" && (
            <Link href="/consensus">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-primary/20">
                <CardHeader>
                  <div className="w-8 h-8 mb-2 text-primary text-3xl">⚖️</div>
                  <CardTitle>Uzlaşma (Consensus) Paneli</CardTitle>
                  <CardDescription>
                    Hakem değerlendirmelerini inceleyin ve nihai kararı verin.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link href="/evaluations">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-slate-50 border-slate-200">
                <CardHeader>
                  <div className="w-8 h-8 mb-2 text-primary text-3xl">🛠️</div>
                  <CardTitle>Yönetici Kontrol Paneli</CardTitle>
                  <CardDescription>
                    Sistemdeki tüm değerlendirmeleri ve kullanıcıları yönetin.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Değerlendirme Süreci</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-1">Makale Bilgileri</h4>
                <p className="text-sm text-muted-foreground">Temel bilgileri girin</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-1">Göstergeleri Doldurun</h4>
                <p className="text-sm text-muted-foreground">33 gösterge için veri girin</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-1">Otomatik Hesaplama</h4>
                <p className="text-sm text-muted-foreground">Puanlar otomatik hesaplanır</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold">
                  4
                </div>
                <h4 className="font-semibold mb-1">Rapor Alın</h4>
                <p className="text-sm text-muted-foreground">Detaylı rapor oluşturun</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
