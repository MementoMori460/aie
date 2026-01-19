import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ALL_DIMENSIONS } from "@shared/indicators";
import { Link } from "wouter";

export default function Indicators() {
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
          <h1 className="text-4xl font-bold mb-2">Gösterge Listesi</h1>
          <p className="text-muted-foreground text-lg">
            33 göstergenin detaylı açıklamaları, ölçüm yöntemleri ve veri kaynakları
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gösterge Yapısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Ana Boyut</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">11</div>
                <div className="text-sm text-muted-foreground">Alt Boyut</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">33</div>
                <div className="text-sm text-muted-foreground">Gösterge</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Gösterge Tipi</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for each dimension */}
        <Tabs defaultValue="0" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {ALL_DIMENSIONS.map((dim, idx) => (
              <TabsTrigger key={idx} value={idx.toString()}>
                {dim.code}
              </TabsTrigger>
            ))}
          </TabsList>

          {ALL_DIMENSIONS.map((dimension, dimIdx) => (
            <TabsContent key={dimIdx} value={dimIdx.toString()}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{dimension.name}</CardTitle>
                  <CardDescription>{dimension.description}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Ağırlık: {(dimension.weight * 100).toFixed(0)}%</Badge>
                    <Badge variant="outline">
                      {dimension.subDimensions.length} Alt Boyut
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-6">
                {dimension.subDimensions.map((subdim, subIdx) => (
                  <Card key={subIdx}>
                    <CardHeader>
                      <CardTitle className="text-xl">{subdim.name}</CardTitle>
                      <CardDescription>
                        Ağırlık: {(subdim.weight * 100).toFixed(0)}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {subdim.indicators.map((ind, indIdx) => (
                        <div key={indIdx} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{ind.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {ind.description}
                              </p>
                            </div>
                            <Badge variant={
                              ind.type === 'quantitative' ? 'default' :
                              ind.type === 'qualitative' ? 'secondary' : 'outline'
                            }>
                              {ind.type === 'quantitative' ? 'Nicel' :
                               ind.type === 'qualitative' ? 'Nitel' : 'İkili'}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong className="text-muted-foreground">Ölçüm Yöntemi:</strong>
                              <p className="mt-1">{ind.measurementMethod}</p>
                            </div>
                            <div>
                              <strong className="text-muted-foreground">Veri Kaynağı:</strong>
                              <p className="mt-1">{ind.dataSource}</p>
                            </div>
                          </div>

                          {ind.examples && ind.examples.length > 0 && (
                            <div className="bg-muted p-3 rounded text-sm">
                              <strong>Örnekler:</strong>
                              <ul className="mt-1 space-y-0.5">
                                {ind.examples.map((example: string, exIdx: number) => (
                                  <li key={exIdx}>• {example}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {ind.tips && ind.tips.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded text-sm">
                              <strong>💡 İpuçları:</strong>
                              <ul className="mt-1 space-y-0.5">
                                {ind.tips.map((tip: string, tipIdx: number) => (
                                  <li key={tipIdx}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Kod: {ind.code}</span>
                            <span>• Normalizasyon: {
                              ind.normalization === 'logarithmic' ? 'Logaritmik' :
                              ind.normalization === 'linear' ? 'Lineer' : 'İkili'
                            }</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom Links */}
        <div className="mt-8 flex gap-4">
          <Link href="/methodology">
            <Button variant="outline">
              Metodoloji →
            </Button>
          </Link>
          <Link href="/documentation">
            <Button variant="outline">
              Dokümantasyon →
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
