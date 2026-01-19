/**
 * Extended Impact Indicators - Part 3 (D13-D16 and Cascade Effects)
 * Final part of 156 new parameters
 */

import { ExtendedIndicator } from "./extendedIndicators";

// D13: SECURITY & DEFENSE IMPACT (8 indicators)
export const securityDefenseImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_1311",
    name: "Savunma Teknolojisi Katkısı",
    dimension: "D13",
    subdimension: "Ulusal Güvenlik",
    description: "Savunma sistemlerine teknolojik katkı",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Savunma raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_1312",
    name: "Siber Savunma Kapasitesi",
    dimension: "D13",
    subdimension: "Ulusal Güvenlik",
    description: "Siber saldırı tespit ve önleme kapasitesi",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Siber güvenlik raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_1313",
    name: "İstihbarat Kapasitesi",
    dimension: "D13",
    subdimension: "Ulusal Güvenlik",
    description: "İstihbarat toplama ve analiz kapasitesi",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["İstihbarat analizleri"],
    cascadeLevel: 3
  },
  {
    code: "I_1321",
    name: "Suç Önleme ve Tespiti",
    dimension: "D13",
    subdimension: "Kamu Güvenliği",
    description: "Suç oranı azalması",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Emniyet istatistikleri"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_1322",
    name: "Acil Durum Müdahalesi",
    dimension: "D13",
    subdimension: "Kamu Güvenliği",
    description: "Müdahale süresi, kurtarılan can sayısı",
    measurementType: "quantitative",
    unit: "Dakika, Sayı",
    dataSource: ["Acil servis raporları"],
    cascadeLevel: 1
  },
  {
    code: "I_1323",
    name: "Afet Hazırlığı ve Direnci",
    dimension: "D13",
    subdimension: "Kamu Güvenliği",
    description: "Erken uyarı sistemleri, afet direnci skoru",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Afet yönetimi raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_1331",
    name: "Nükleer Güvenlik",
    dimension: "D13",
    subdimension: "Küresel Güvenlik",
    description: "Nükleer sızıntı riski azalması",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["IAEA"],
    cascadeLevel: 3
  },
  {
    code: "I_1332",
    name: "Terörizm Önleme",
    dimension: "D13",
    subdimension: "Küresel Güvenlik",
    description: "Radikalizasyon önleme, terör saldırısı azalması",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Güvenlik raporları"],
    cascadeLevel: 3
  }
];

// D14: PSYCHOLOGICAL & WELL-BEING IMPACT (10 indicators)
export const psychologicalWellbeingImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_1411",
    name: "Psikolojik İyi Oluş",
    dimension: "D14",
    subdimension: "Mental Sağlık",
    description: "Well-being skorları (WHO-5, WEMWBS)",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Psikolojik anketler"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_1412",
    name: "Mental Hastalık Prevalansı Azalması",
    dimension: "D14",
    subdimension: "Mental Sağlık",
    description: "Depresyon, anksiyete oranı azalması",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Sağlık istatistikleri"],
    cascadeLevel: 2
  },
  {
    code: "I_1413",
    name: "İntihar Oranı Azalması",
    dimension: "D14",
    subdimension: "Mental Sağlık",
    description: "İntihar oranı değişimi",
    measurementType: "quantitative",
    unit: "Oran/100,000",
    dataSource: ["WHO", "Sağlık istatistikleri"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_1421",
    name: "Yaşam Memnuniyeti Artışı",
    dimension: "D14",
    subdimension: "Yaşam Memnuniyeti",
    description: "Life satisfaction skorları",
    measurementType: "quantitative",
    unit: "Skor (0-10)",
    dataSource: ["Yaşam memnuniyeti anketleri"],
    cascadeLevel: 3,
    multiplierType: "social"
  },
  {
    code: "I_1422",
    name: "Öznel Mutluluk Artışı",
    dimension: "D14",
    subdimension: "Yaşam Memnuniyeti",
    description: "Mutluluk endeksi değişimi",
    measurementType: "quantitative",
    unit: "Endeks",
    dataSource: ["World Happiness Report"],
    cascadeLevel: 3
  },
  {
    code: "I_1431",
    name: "Stres Seviyesi Azalması",
    dimension: "D14",
    subdimension: "Stres ve Travma",
    description: "Perceived stress skorları",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["PSS (Perceived Stress Scale)"],
    cascadeLevel: 2
  },
  {
    code: "I_1432",
    name: "Travma Sonrası Büyüme",
    dimension: "D14",
    subdimension: "Stres ve Travma",
    description: "Post-traumatic growth skorları",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["PTGI (Post-Traumatic Growth Inventory)"],
    cascadeLevel: 3
  },
  {
    code: "I_1441",
    name: "Sosyal Bağlantı Güçlenmesi",
    dimension: "D14",
    subdimension: "Sosyal Bağlantı",
    description: "Yalnızlık azalması, sosyal ağ büyüklüğü",
    measurementType: "quantitative",
    unit: "Skor, Sayı",
    dataSource: ["UCLA Loneliness Scale", "Sosyal ağ analizleri"],
    cascadeLevel: 3,
    multiplierType: "social"
  },
  {
    code: "I_1442",
    name: "İlişki Kalitesi İyileşmesi",
    dimension: "D14",
    subdimension: "Sosyal Bağlantı",
    description: "İlişki memnuniyeti skorları",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["İlişki kalitesi anketleri"],
    cascadeLevel: 3
  },
  {
    code: "I_1443",
    name: "Toplumsal Uyum",
    dimension: "D14",
    subdimension: "Sosyal Bağlantı",
    description: "Toplumsal uyum ve entegrasyon skorları",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Sosyal uyum anketleri"],
    cascadeLevel: 4
  }
];

// D15: INTERNATIONAL COLLABORATION IMPACT (12 indicators)
export const internationalCollaborationIndicators: ExtendedIndicator[] = [
  {
    code: "I_1511",
    name: "Uluslararası İşbirliği Sayısı",
    dimension: "D15",
    subdimension: "Araştırma İşbirliği Ağları",
    description: "İşbirlikçi yayın sayısı, ülke sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Web of Science", "Scopus"],
    cascadeLevel: 1,
    multiplierType: "scientific"
  },
  {
    code: "I_1512",
    name: "Ağ Genişliği ve Yoğunluğu",
    dimension: "D15",
    subdimension: "Araştırma İşbirliği Ağları",
    description: "İşbirliği ağı büyüklüğü, yoğunluk metrikleri",
    measurementType: "quantitative",
    unit: "Düğüm, Yoğunluk",
    dataSource: ["Ağ analizi"],
    cascadeLevel: 2
  },
  {
    code: "I_1513",
    name: "Disiplinlerarası İşbirliği",
    dimension: "D15",
    subdimension: "Araştırma İşbirliği Ağları",
    description: "Farklı disiplinlerden araştırmacı sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Bibliyometrik analizler"],
    cascadeLevel: 2,
    multiplierType: "scientific"
  },
  {
    code: "I_1521",
    name: "Güney-Kuzey İşbirliği",
    dimension: "D15",
    subdimension: "Bilgi Transferi",
    description: "Gelişmekte olan ülkelerle işbirliği",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Bibliyometrik veriler"],
    cascadeLevel: 2
  },
  {
    code: "I_1522",
    name: "Kapasite Geliştirme Etkisi",
    dimension: "D15",
    subdimension: "Bilgi Transferi",
    description: "Kurulan laboratuvar, eğitilen araştırmacı sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Kapasite geliştirme raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_1523",
    name: "Bilgi Transferi Etkinliği",
    dimension: "D15",
    subdimension: "Bilgi Transferi",
    description: "Transfer edilen teknoloji sayısı, benimsenme oranı",
    measurementType: "quantitative",
    unit: "Sayı, %",
    dataSource: ["Teknoloji transfer raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_1531",
    name: "Küresel Altyapı Oluşturma",
    dimension: "D15",
    subdimension: "Küresel Altyapı",
    description: "Uluslararası araştırma altyapısı (CERN, ISS, vb.)",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Altyapı raporları"],
    cascadeLevel: 4
  },
  {
    code: "I_1532",
    name: "Uluslararası Standart Belirleme",
    dimension: "D15",
    subdimension: "Küresel Altyapı",
    description: "Küresel standart oluşturma",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["ISO", "IEEE"],
    cascadeLevel: 4
  },
  {
    code: "I_1533",
    name: "Veri Paylaşım Altyapısı",
    dimension: "D15",
    subdimension: "Küresel Altyapı",
    description: "Açık veri platformları, veri paylaşım oranı",
    measurementType: "quantitative",
    unit: "Sayı, %",
    dataSource: ["Veri depoları"],
    cascadeLevel: 3
  },
  {
    code: "I_1541",
    name: "Bilim Diplomasisi",
    dimension: "D15",
    subdimension: "Diplomatik İlişkiler",
    description: "Bilimsel işbirliği yoluyla diplomatik ilişki güçlenmesi",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Diplomatik analizler"],
    cascadeLevel: 4
  },
  {
    code: "I_1542",
    name: "Kültürlerarası Anlayış",
    dimension: "D15",
    subdimension: "Diplomatik İlişkiler",
    description: "Uluslararası öğrenci değişimi, kültürel anlayış artışı",
    measurementType: "quantitative",
    unit: "Sayı, Skor",
    dataSource: ["Eğitim değişim programları"],
    cascadeLevel: 3
  },
  {
    code: "I_1543",
    name: "Barış ve İstikrara Katkı",
    dimension: "D15",
    subdimension: "Diplomatik İlişkiler",
    description: "Çatışma çözümüne bilimsel katkı",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Barış araştırmaları"],
    cascadeLevel: 5
  }
];

// D16: CASCADE & MULTIPLIER EFFECTS (15 indicators)
export const cascadeMultiplierIndicators: ExtendedIndicator[] = [
  {
    code: "I_1611",
    name: "Etki Hızı (Time-to-Impact)",
    dimension: "D16",
    subdimension: "Zaman Dinamikleri",
    description: "Yayından ilk etkiye kadar geçen süre",
    measurementType: "quantitative",
    unit: "Ay/Yıl",
    dataSource: ["Uzunlamasına çalışmalar"],
    cascadeLevel: 1
  },
  {
    code: "I_1612",
    name: "Etki Sürekliliği",
    dimension: "D16",
    subdimension: "Zaman Dinamikleri",
    description: "Etkinin sürdüğü toplam süre",
    measurementType: "quantitative",
    unit: "Yıl",
    dataSource: ["Uzunlamasına çalışmalar"],
    cascadeLevel: 1
  },
  {
    code: "I_1613",
    name: "Erken Etki Göstergeleri",
    dimension: "D16",
    subdimension: "Zaman Dinamikleri",
    description: "Erken atıf hızı, altmetric momentum",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Bibliyometrik analizler"],
    cascadeLevel: 1
  },
  {
    code: "I_1614",
    name: "Gecikmeli Etkiler (Sleeping Beauty)",
    dimension: "D16",
    subdimension: "Zaman Dinamikleri",
    description: "Yıllar sonra yeniden keşfedilen araştırmalar",
    measurementType: "binary",
    unit: "Var/Yok",
    dataSource: ["Atıf analizi"],
    cascadeLevel: 1
  },
  {
    code: "I_1621",
    name: "İkincil Etkiler",
    dimension: "D16",
    subdimension: "Zincirleme Etkiler",
    description: "Birincil etkiden türeyen ikincil etkiler",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Etki zincirleme analizi"],
    cascadeLevel: 2
  },
  {
    code: "I_1622",
    name: "Üçüncül Etkiler",
    dimension: "D16",
    subdimension: "Zincirleme Etkiler",
    description: "İkincil etkiden türeyen üçüncül etkiler",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Etki zincirleme analizi"],
    cascadeLevel: 3
  },
  {
    code: "I_1623",
    name: "Dördüncül ve Daha İleri Etkiler",
    dimension: "D16",
    subdimension: "Zincirleme Etkiler",
    description: "Uzun vadeli zincirleme etkiler",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["Sistem dinamiği modelleme"],
    cascadeLevel: 4
  },
  {
    code: "I_1631",
    name: "Ekonomik Çarpan Katsayısı",
    dimension: "D16",
    subdimension: "Çarpan Etkileri",
    description: "Her 1$ yatırımın yarattığı ekonomik değer",
    measurementType: "quantitative",
    unit: "Katsayı",
    dataSource: ["Ekonomik modelleme"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_1632",
    name: "Sosyal Çarpan Katsayısı",
    dimension: "D16",
    subdimension: "Çarpan Etkileri",
    description: "Doğrudan faydalanan başına dolaylı faydalanan sayısı",
    measurementType: "quantitative",
    unit: "Katsayı",
    dataSource: ["Sosyal etki analizi"],
    cascadeLevel: 1,
    multiplierType: "social"
  },
  {
    code: "I_1633",
    name: "Bilimsel Çarpan Katsayısı",
    dimension: "D16",
    subdimension: "Çarpan Etkileri",
    description: "Bir öncü makalenin tetiklediği takip makalesi sayısı",
    measurementType: "quantitative",
    unit: "Katsayı",
    dataSource: ["Atıf ağı analizi"],
    cascadeLevel: 1,
    multiplierType: "scientific"
  },
  {
    code: "I_1641",
    name: "Doğrudan Ağ Etkisi",
    dimension: "D16",
    subdimension: "Ağ Etkileri",
    description: "Kullanıcı sayısı artışı ile değer artışı",
    measurementType: "quantitative",
    unit: "Katsayı",
    dataSource: ["Ağ analizi"],
    cascadeLevel: 2
  },
  {
    code: "I_1642",
    name: "Dolaylı Ağ Etkisi",
    dimension: "D16",
    subdimension: "Ağ Etkileri",
    description: "Tamamlayıcı ürün/hizmet sayısı artışı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Ekosistem analizi"],
    cascadeLevel: 3
  },
  {
    code: "I_1651",
    name: "Pozitif Geri Besleme Döngüsü",
    dimension: "D16",
    subdimension: "Geri Besleme Döngüleri",
    description: "Kendini güçlendiren döngüler",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Sistem dinamiği analizi"],
    cascadeLevel: 3
  },
  {
    code: "I_1652",
    name: "Negatif Geri Besleme Döngüsü",
    dimension: "D16",
    subdimension: "Geri Besleme Döngüleri",
    description: "Dengeleyici döngüler",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Sistem dinamiği analizi"],
    cascadeLevel: 3
  },
  {
    code: "I_1653",
    name: "Gecikmeli Geri Besleme",
    dimension: "D16",
    subdimension: "Geri Besleme Döngüleri",
    description: "Zaman gecikmeli etkiler",
    measurementType: "quantitative",
    unit: "Yıl",
    dataSource: ["Uzunlamasına çalışmalar"],
    cascadeLevel: 4
  }
];

// Export all indicators from part 3
export const allExtendedIndicatorsPart3: ExtendedIndicator[] = [
  ...securityDefenseImpactIndicators,
  ...psychologicalWellbeingImpactIndicators,
  ...internationalCollaborationIndicators,
  ...cascadeMultiplierIndicators
];

// Total count verification
export const TOTAL_EXTENDED_INDICATORS = 
  8 + // Security & Defense
  10 + // Psychological & Well-being
  12 + // International Collaboration
  15; // Cascade & Multiplier
// = 45 indicators in Part 3

// Combined with Part 1 (51) and Part 2 (60) = 156 total extended indicators
