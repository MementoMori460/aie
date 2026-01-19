/**
 * Extended Impact Indicators - Part 2 (D9-D16)
 * Continuation of 156 new parameters
 */

import { ExtendedIndicator } from "./extendedIndicators";

// D9: TECHNOLOGICAL IMPACT (13 indicators)
export const technologicalImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_911",
    name: "Teknoloji Yayılım Hızı",
    dimension: "D9",
    subdimension: "Teknoloji Transferi",
    description: "Teknolojinin benimsenmesine kadar geçen süre, benimseme oranı",
    measurementType: "quantitative",
    unit: "Yıl, %",
    dataSource: ["Teknoloji benimseme çalışmaları"],
    cascadeLevel: 2
  },
  {
    code: "I_912",
    name: "Spin-off Şirket Sayısı",
    dimension: "D9",
    subdimension: "Teknoloji Transferi",
    description: "Araştırmadan doğan şirket sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Teknoloji transfer ofisleri", "Crunchbase"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_913",
    name: "Platform Oluşturma",
    dimension: "D9",
    subdimension: "Teknoloji Transferi",
    description: "Üzerine başka uygulamalar geliştirilebilen platform oluşturma",
    measurementType: "quantitative",
    unit: "Uygulama sayısı",
    dataSource: ["GitHub", "App store'lar"],
    cascadeLevel: 2,
    multiplierType: "scientific"
  },
  {
    code: "I_921",
    name: "Türev Buluşlar",
    dimension: "D9",
    subdimension: "İnovasyon ve Buluşlar",
    description: "Araştırmadan türeyen yeni buluş sayısı (patent ağacı analizi)",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Patent atıf ağları"],
    cascadeLevel: 2,
    multiplierType: "scientific"
  },
  {
    code: "I_922",
    name: "Yıkıcı İnovasyon (Disruptive Innovation)",
    dimension: "D9",
    subdimension: "İnovasyon ve Buluşlar",
    description: "Endüstriyi dönüştürme derecesi",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Endüstri analizleri", "Uzman değerlendirmeleri"],
    cascadeLevel: 3
  },
  {
    code: "I_923",
    name: "Teknolojik Yakınsama (Convergence)",
    dimension: "D9",
    subdimension: "İnovasyon ve Buluşlar",
    description: "Farklı teknolojilerin birleşmesini sağlama",
    measurementType: "qualitative",
    unit: "İkili (var/yok)",
    dataSource: ["Teknoloji raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_931",
    name: "Dijitalleşme Hızı",
    dimension: "D9",
    subdimension: "Dijital Dönüşüm",
    description: "Sektörlerin dijitalleşme oranı artışı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Dijital dönüşüm raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_932",
    name: "Endüstri 4.0 Benimsenimi",
    dimension: "D9",
    subdimension: "Dijital Dönüşüm",
    description: "Akıllı fabrika, IoT sensör sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Endüstri 4.0 raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_933",
    name: "Veri Ekonomisine Katkı",
    dimension: "D9",
    subdimension: "Dijital Dönüşüm",
    description: "Oluşturulan veri değeri, veri pazar büyüklüğü",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Veri ekonomisi raporları"],
    cascadeLevel: 3,
    multiplierType: "economic"
  },
  {
    code: "I_941",
    name: "Siber Güvenlik Seviyesi Artışı",
    dimension: "D9",
    subdimension: "Siber Güvenlik",
    description: "Veri ihlali azalması, güvenlik skorları",
    measurementType: "quantitative",
    unit: "% azalma, skor",
    dataSource: ["Siber güvenlik raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_942",
    name: "Gizlilik Koruma İyileşmesi",
    dimension: "D9",
    subdimension: "Siber Güvenlik",
    description: "Gizlilik teknolojilerinin benimsenimi",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Gizlilik raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_951",
    name: "AI Benimsenim Oranı",
    dimension: "D9",
    subdimension: "Yapay Zeka ve Otomasyon",
    description: "AI kullanan şirket/kurum oranı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["AI benimseme anketleri"],
    cascadeLevel: 2
  },
  {
    code: "I_952",
    name: "Otomasyon Seviyesi",
    dimension: "D9",
    subdimension: "Yapay Zeka ve Otomasyon",
    description: "Otomatikleştirilen süreç oranı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Otomasyon raporları"],
    cascadeLevel: 2,
    multiplierType: "economic"
  }
];

// D10: SOCIAL & CULTURAL IMPACT (15 indicators)
export const socialCulturalImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_1011",
    name: "Gerçek Davranış Değişikliği",
    dimension: "D10",
    subdimension: "Davranış Değişikliği",
    description: "Ölçülebilir davranış değişikliği (sigara içme, egzersiz, vb.)",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Davranış çalışmaları", "Sağlık anketleri"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_1012",
    name: "Davranış Değişikliği Sürekliliği",
    dimension: "D10",
    subdimension: "Davranış Değişikliği",
    description: "Davranış değişikliğinin sürdürülme süresi",
    measurementType: "quantitative",
    unit: "Ay/Yıl",
    dataSource: ["Uzunlamasına çalışmalar"],
    cascadeLevel: 3
  },
  {
    code: "I_1013",
    name: "Toplumsal Norm Değişimi",
    dimension: "D10",
    subdimension: "Davranış Değişikliği",
    description: "Toplumsal normların değişmesi",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Sosyolojik anketler"],
    cascadeLevel: 4
  },
  {
    code: "I_1021",
    name: "Eşitsizlik Azalması",
    dimension: "D10",
    subdimension: "Sosyal Adalet ve Eşitlik",
    description: "Gini katsayısı, gelir eşitsizliği değişimi",
    measurementType: "quantitative",
    unit: "Katsayı",
    dataSource: ["Dünya Bankası", "OECD"],
    cascadeLevel: 3,
    multiplierType: "social"
  },
  {
    code: "I_1022",
    name: "Marjinal Gruplara Erişim",
    dimension: "D10",
    subdimension: "Sosyal Adalet ve Eşitlik",
    description: "Dezavantajlı gruplara hizmet erişimi",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Sosyal hizmet raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_1023",
    name: "Sosyal Hareketlere Etki",
    dimension: "D10",
    subdimension: "Sosyal Adalet ve Eşitlik",
    description: "Tetiklenen/desteklenen sosyal hareket sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Sosyal hareket veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_1031",
    name: "Kültürel Eserler",
    dimension: "D10",
    subdimension: "Kültürel Üretim",
    description: "Araştırmadan esinlenen kitap, film, sanat eseri sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Kültürel veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_1032",
    name: "Kültürel Söylem Değişimi",
    dimension: "D10",
    subdimension: "Kültürel Üretim",
    description: "Kültürel söylemin değişmesi (örn: 'sürdürülebilirlik' kavramının yaygınlaşması)",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Medya analizleri", "Google Trends"],
    cascadeLevel: 4
  },
  {
    code: "I_1033",
    name: "Kültürel Miras Koruma",
    dimension: "D10",
    subdimension: "Kültürel Üretim",
    description: "Korunan/dijitalleştirilen kültürel eser sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["UNESCO", "Müze veritabanları"],
    cascadeLevel: 2
  },
  {
    code: "I_1041",
    name: "Vatandaş Bilimi Katılımı",
    dimension: "D10",
    subdimension: "Toplumsal Katılım",
    description: "Katılan gönüllü sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Vatandaş bilimi platformları"],
    cascadeLevel: 2
  },
  {
    code: "I_1042",
    name: "Toplumsal Güçlendirme (Empowerment)",
    dimension: "D10",
    subdimension: "Toplumsal Katılım",
    description: "Karar alma süreçlerine katılım artışı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Toplumsal güçlendirme anketleri"],
    cascadeLevel: 3,
    multiplierType: "social"
  },
  {
    code: "I_1043",
    name: "Sosyal Sermaye Artışı",
    dimension: "D10",
    subdimension: "Toplumsal Katılım",
    description: "Topluluk bağları, güven düzeyi artışı",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Sosyal sermaye anketleri"],
    cascadeLevel: 3
  },
  {
    code: "I_1051",
    name: "Kamuoyu Farkındalığı",
    dimension: "D10",
    subdimension: "İletişim ve Farkındalık",
    description: "Toplumsal farkındalık oranı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Kamuoyu anketleri"],
    cascadeLevel: 2
  },
  {
    code: "I_1052",
    name: "Stigma Azalması",
    dimension: "D10",
    subdimension: "İletişim ve Farkındalık",
    description: "Toplumsal damgalama azalması (örn: mental sağlık)",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Stigma ölçekleri"],
    cascadeLevel: 3,
    multiplierType: "social"
  },
  {
    code: "I_1053",
    name: "Bilim Okuryazarlığı Artışı",
    dimension: "D10",
    subdimension: "İletişim ve Farkındalık",
    description: "Toplumun bilim okuryazarlığı seviyesi",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["PISA", "Bilim okuryazarlığı testleri"],
    cascadeLevel: 3
  }
];

// D11: EDUCATIONAL IMPACT (10 indicators)
export const educationalImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_1111",
    name: "Müfredat Entegrasyonu",
    dimension: "D11",
    subdimension: "Müfredat ve Eğitim Materyalleri",
    description: "Kaç ülke müfredatına dahil edildiği",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["UNESCO", "Eğitim bakanlıkları"],
    cascadeLevel: 3
  },
  {
    code: "I_1112",
    name: "Ders Kitabı Kullanımı",
    dimension: "D11",
    subdimension: "Müfredat ve Eğitim Materyalleri",
    description: "Ders kitaplarında yer alma sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Yayınevleri", "Eğitim materyali veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_1113",
    name: "Online Eğitim Platformlarında Varlık",
    dimension: "D11",
    subdimension: "Müfredat ve Eğitim Materyalleri",
    description: "Coursera, edX, Khan Academy'de kurs sayısı, öğrenci sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["MOOC platformları"],
    cascadeLevel: 2
  },
  {
    code: "I_1121",
    name: "Öğrenci Başarısı Artışı",
    dimension: "D11",
    subdimension: "Öğrenci Sonuçları",
    description: "Test skorları, not ortalamaları",
    measurementType: "quantitative",
    unit: "Skor, %",
    dataSource: ["Eğitim değerlendirmeleri"],
    cascadeLevel: 2
  },
  {
    code: "I_1122",
    name: "Eğitim Erişimi Artışı",
    dimension: "D11",
    subdimension: "Öğrenci Sonuçları",
    description: "Kayıt oranı artışı, özellikle dezavantajlı gruplarda",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["UNESCO", "Eğitim istatistikleri"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_1123",
    name: "Eğitimde Eşitlik",
    dimension: "D11",
    subdimension: "Öğrenci Sonuçları",
    description: "Cinsiyet, sosyoekonomik eşitlik endeksleri",
    measurementType: "quantitative",
    unit: "Endeks",
    dataSource: ["Eğitim eşitliği raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_1131",
    name: "Öğretmen Eğitimi",
    dimension: "D11",
    subdimension: "Öğretmen ve Eğitimci Etkisi",
    description: "Eğitilen öğretmen sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Öğretmen eğitim programları"],
    cascadeLevel: 2
  },
  {
    code: "I_1132",
    name: "Pedagojik Yenilik Benimsenimi",
    dimension: "D11",
    subdimension: "Öğretmen ve Eğitimci Etkisi",
    description: "Yeni öğretim yöntemlerini benimseyen okul oranı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Eğitim inovasyon raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_1141",
    name: "Yetişkin Eğitimi",
    dimension: "D11",
    subdimension: "Yaşam Boyu Öğrenme",
    description: "Eğitilen yetişkin sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Yaşam boyu öğrenme programları"],
    cascadeLevel: 2
  },
  {
    code: "I_1142",
    name: "Mesleki Gelişim Etkisi",
    dimension: "D11",
    subdimension: "Yaşam Boyu Öğrenme",
    description: "Kariyer değişikliği, gelir artışı",
    measurementType: "quantitative",
    unit: "%, USD",
    dataSource: ["İşgücü anketleri"],
    cascadeLevel: 3,
    multiplierType: "economic"
  }
];

// D12: DIGITAL & MEDIA IMPACT (12 indicators)
export const digitalMediaImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_1211",
    name: "Dijital Erişim",
    dimension: "D12",
    subdimension: "Dijital İçerik ve Erişim",
    description: "İndirme, görüntüleme sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Altmetric", "Web analitiği"],
    cascadeLevel: 1
  },
  {
    code: "I_1212",
    name: "Dijital Platform Kullanımı",
    dimension: "D12",
    subdimension: "Dijital İçerik ve Erişim",
    description: "GitHub, Stack Overflow, Kaggle'da kullanım",
    measurementType: "quantitative",
    unit: "Fork, star, upvote sayısı",
    dataSource: ["GitHub API", "Stack Overflow API"],
    cascadeLevel: 2
  },
  {
    code: "I_1213",
    name: "Dijital Araç Geliştirme",
    dimension: "D12",
    subdimension: "Dijital İçerik ve Erişim",
    description: "Geliştirilen yazılım, uygulama, veri seti sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["GitHub", "App store'lar"],
    cascadeLevel: 2
  },
  {
    code: "I_1221",
    name: "Medya Erişim Sayısı",
    dimension: "D12",
    subdimension: "Medya Etkisi",
    description: "Haber makalesi sayısı, toplam erişim",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Altmetric", "Medya izleme"],
    cascadeLevel: 2
  },
  {
    code: "I_1222",
    name: "Medya Kalitesi",
    dimension: "D12",
    subdimension: "Medya Etkisi",
    description: "Tier 1 medya (NYT, BBC, vb.) vs. Tier 2/3",
    measurementType: "qualitative",
    unit: "Ağırlıklı skor",
    dataSource: ["Medya analizleri"],
    cascadeLevel: 2
  },
  {
    code: "I_1223",
    name: "Podcast ve Video İçeriği",
    dimension: "D12",
    subdimension: "Medya Etkisi",
    description: "Podcast, YouTube video sayısı ve izlenme",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["YouTube API", "Podcast platformları"],
    cascadeLevel: 2
  },
  {
    code: "I_1231",
    name: "Sosyal Medya Erişimi",
    dimension: "D12",
    subdimension: "Sosyal Medya Etkisi",
    description: "Tweet, paylaşım, beğeni sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Altmetric", "Sosyal medya API'leri"],
    cascadeLevel: 1
  },
  {
    code: "I_1232",
    name: "Viral Yayılım",
    dimension: "D12",
    subdimension: "Sosyal Medya Etkisi",
    description: "Viral olma (24 saat içinde 1M+ erişim)",
    measurementType: "binary",
    unit: "Var/Yok",
    dataSource: ["Viral izleme"],
    cascadeLevel: 2
  },
  {
    code: "I_1233",
    name: "Influencer Etkisi",
    dimension: "D12",
    subdimension: "Sosyal Medya Etkisi",
    description: "Influencer'lar tarafından paylaşım",
    measurementType: "quantitative",
    unit: "Sayı + Toplam takipçi",
    dataSource: ["Sosyal medya analitiği"],
    cascadeLevel: 2
  },
  {
    code: "I_1241",
    name: "Popüler Kitaplarda Kullanım",
    dimension: "D12",
    subdimension: "Popüler Kültür Etkisi",
    description: "Popüler bilim kitaplarında referans",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Kitap veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_1242",
    name: "Film ve TV'de Kullanım",
    dimension: "D12",
    subdimension: "Popüler Kültür Etkisi",
    description: "Belgesel, film, TV dizilerinde yer alma",
    measurementType: "quantitative",
    unit: "Sayı + İzleyici",
    dataSource: ["IMDb", "TV veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_1243",
    name: "Müze ve Sergilerde Yer Alma",
    dimension: "D12",
    subdimension: "Popüler Kültür Etkisi",
    description: "Bilim müzelerinde sergileme",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Müze veritabanları"],
    cascadeLevel: 3
  }
];

// Export all indicators from part 2
export const allExtendedIndicatorsPart2: ExtendedIndicator[] = [
  ...technologicalImpactIndicators,
  ...socialCulturalImpactIndicators,
  ...educationalImpactIndicators,
  ...digitalMediaImpactIndicators
];
