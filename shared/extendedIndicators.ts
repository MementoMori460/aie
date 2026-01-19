/**
 * Extended Impact Indicators - 156 New Parameters
 * These indicators complement the existing 37 indicators with comprehensive real-world impact measurements
 */

export interface ExtendedIndicator {
  code: string;
  name: string;
  dimension: string;
  subdimension: string;
  description: string;
  measurementType: "quantitative" | "qualitative" | "binary";
  unit?: string;
  dataSource: string[];
  cascadeLevel?: number; // For cascade effect tracking (1=primary, 2=secondary, etc.)
  multiplierType?: "economic" | "social" | "scientific" | "environmental";
}

// D5: ECONOMIC IMPACT (15 indicators)
export const economicImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_511",
    name: "Doğrudan İstihdam Yaratma",
    dimension: "D5",
    subdimension: "İstihdam Etkisi",
    description: "Araştırma sonucu doğrudan yaratılan tam zamanlı eşdeğer (FTE) iş sayısı",
    measurementType: "quantitative",
    unit: "FTE sayısı",
    dataSource: ["Şirket raporları", "LinkedIn", "Teknoloji transfer ofisleri"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_512",
    name: "Dolaylı İstihdam Etkisi",
    dimension: "D5",
    subdimension: "İstihdam Etkisi",
    description: "Tedarik zinciri ve ilgili sektörlerde yarattığı dolaylı istihdam (çarpan: 1.5-3.0)",
    measurementType: "quantitative",
    unit: "FTE sayısı",
    dataSource: ["Input-output analizi", "Ekonomik modelleme"],
    cascadeLevel: 2,
    multiplierType: "economic"
  },
  {
    code: "I_513",
    name: "İşgücü Kalitesi İyileşmesi",
    dimension: "D5",
    subdimension: "İstihdam Etkisi",
    description: "İşgücünün beceri düzeyine katkı (eğitim seviyesi, sertifikasyon oranı)",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["İşgücü istatistikleri", "Eğitim verileri"],
    cascadeLevel: 2
  },
  {
    code: "I_521",
    name: "Toplam Ekonomik Değer (TEV)",
    dimension: "D5",
    subdimension: "Ekonomik Değer Yaratma",
    description: "Gelir artışı + Maliyet tasarrufu + Verimlilik kazanımı",
    measurementType: "quantitative",
    unit: "USD/EUR/TRY",
    dataSource: ["Finansal raporlar", "Ekonomik analiz raporları"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_522",
    name: "GSYİH Katkısı",
    dimension: "D5",
    subdimension: "Ekonomik Değer Yaratma",
    description: "Ulusal GSYİH'ye katkı (ekonometrik modelleme ile hesaplanan)",
    measurementType: "quantitative",
    unit: "% veya para birimi",
    dataSource: ["Ulusal istatistik kurumları", "Ekonomik araştırma enstitüleri"],
    cascadeLevel: 3,
    multiplierType: "economic"
  },
  {
    code: "I_523",
    name: "Verimlilik Artışı",
    dimension: "D5",
    subdimension: "Ekonomik Değer Yaratma",
    description: "Birim başına çıktı artışı, zaman tasarrufu, kaynak verimliliği",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Endüstriyel raporlar", "Verimlilik analizleri"],
    cascadeLevel: 2
  },
  {
    code: "I_531",
    name: "Çekilen Yatırım Miktarı",
    dimension: "D5",
    subdimension: "Yatırım ve Finansman",
    description: "Özel sektör + Kamu + VC + Hibe yatırımları toplamı",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Crunchbase", "PitchBook", "Hibe veritabanları"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_532",
    name: "Piyasa Değeri Etkisi",
    dimension: "D5",
    subdimension: "Yatırım ve Finansman",
    description: "Şirket piyasa kapitalizasyonu değişimi",
    measurementType: "quantitative",
    unit: "% veya para birimi",
    dataSource: ["Borsa verileri", "Finansal analistler"],
    cascadeLevel: 2
  },
  {
    code: "I_533",
    name: "Fikri Mülkiyet Geliri",
    dimension: "D5",
    subdimension: "Yatırım ve Finansman",
    description: "Patentlerden elde edilen lisans ve satış geliri",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Teknoloji transfer ofisleri", "Patent veritabanları"],
    cascadeLevel: 1
  },
  {
    code: "I_541",
    name: "Yeni Pazar Yaratma",
    dimension: "D5",
    subdimension: "Pazar ve Ticaret",
    description: "Tamamen yeni bir pazar oluşturma (pazar büyüklüğü ve büyüme hızı)",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Gartner", "IDC", "Pazar araştırma raporları"],
    cascadeLevel: 1
  },
  {
    code: "I_542",
    name: "Pazar Payı Değişimi",
    dimension: "D5",
    subdimension: "Pazar ve Ticaret",
    description: "Endüstri pazar dinamiklerine etki (pazar payı kaymaları)",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Endüstri raporları", "Pazar analizleri"],
    cascadeLevel: 2
  },
  {
    code: "I_543",
    name: "Ürün Satış Hacmi",
    dimension: "D5",
    subdimension: "Pazar ve Ticaret",
    description: "Araştırma sonucu geliştirilen ürünlerin birim satış + gelir",
    measurementType: "quantitative",
    unit: "Birim sayısı + USD",
    dataSource: ["Şirket raporları", "Pazar verileri"],
    cascadeLevel: 2,
    multiplierType: "economic"
  },
  {
    code: "I_551",
    name: "İhracat Artışı",
    dimension: "D5",
    subdimension: "Uluslararası Ticaret",
    description: "İhracat hacmine katkı",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Gümrük verileri", "Ticaret istatistikleri"],
    cascadeLevel: 3
  },
  {
    code: "I_552",
    name: "Ticaret Dengesi Etkisi",
    dimension: "D5",
    subdimension: "Uluslararası Ticaret",
    description: "İhracat - İthalat değişimi",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Merkez bankası", "Ticaret bakanlığı"],
    cascadeLevel: 3
  },
  {
    code: "I_561",
    name: "Ekonomik Esneklik Katkısı",
    dimension: "D5",
    subdimension: "Ekonomik Esneklik",
    description: "Ekonominin krizlere karşı direncine katkı",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Ekonomik analizler", "Kriz raporları"],
    cascadeLevel: 4
  }
];

// D6: HEALTH IMPACT (12 indicators)
export const healthImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_611",
    name: "QALY Kazanımı",
    dimension: "D6",
    subdimension: "Sağlık Sonuçları",
    description: "Kaliteye göre ayarlanmış yaşam yılı kazanımı (Quality-Adjusted Life Year)",
    measurementType: "quantitative",
    unit: "QALY",
    dataSource: ["Klinik çalışmalar", "Sağlık ekonomisi analizleri"],
    cascadeLevel: 1,
    multiplierType: "social"
  },
  {
    code: "I_612",
    name: "DALY Azalması",
    dimension: "D6",
    subdimension: "Sağlık Sonuçları",
    description: "Hastalık yükü azalması (Disability-Adjusted Life Year)",
    measurementType: "quantitative",
    unit: "DALY",
    dataSource: ["WHO GBD çalışmaları", "Halk sağlığı raporları"],
    cascadeLevel: 1,
    multiplierType: "social"
  },
  {
    code: "I_613",
    name: "Mortalite Azalması",
    dimension: "D6",
    subdimension: "Sağlık Sonuçları",
    description: "Önlenen ölüm sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Sağlık istatistikleri", "Epidemiyolojik çalışmalar"],
    cascadeLevel: 1,
    multiplierType: "social"
  },
  {
    code: "I_614",
    name: "Yaşam Beklentisi Artışı",
    dimension: "D6",
    subdimension: "Sağlık Sonuçları",
    description: "Populasyon düzeyinde yaşam beklentisi artışı",
    measurementType: "quantitative",
    unit: "Yıl",
    dataSource: ["Demografik çalışmalar", "Sağlık istatistikleri"],
    cascadeLevel: 2
  },
  {
    code: "I_621",
    name: "Tedavi Maliyeti Tasarrufu",
    dimension: "D6",
    subdimension: "Sağlık Sistemi Etkisi",
    description: "Sağlık sistemine sağlanan maliyet tasarrufu",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Sağlık ekonomisi çalışmaları", "Sigorta verileri"],
    cascadeLevel: 2,
    multiplierType: "economic"
  },
  {
    code: "I_622",
    name: "Hastaneye Yatış Oranı Azalması",
    dimension: "D6",
    subdimension: "Sağlık Sistemi Etkisi",
    description: "Hospitalizasyon oranı değişimi",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Hastane kayıtları"],
    cascadeLevel: 2
  },
  {
    code: "I_623",
    name: "Sağlık Hizmeti Erişimi İyileşmesi",
    dimension: "D6",
    subdimension: "Sağlık Sistemi Etkisi",
    description: "Sağlık hizmetlerine erişim artışı (erişim oranı, coğrafi kapsam)",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Sağlık bakanlığı", "WHO"],
    cascadeLevel: 2
  },
  {
    code: "I_631",
    name: "Salgın Önleme ve Kontrol",
    dimension: "D6",
    subdimension: "Halk Sağlığı Etkisi",
    description: "Vaka sayısı azalması, salgın süresi kısalması",
    measurementType: "quantitative",
    unit: "Sayı, Gün",
    dataSource: ["Epidemiyolojik veriler", "WHO"],
    cascadeLevel: 1,
    multiplierType: "social"
  },
  {
    code: "I_632",
    name: "Hastalık İnsidansı Azalması",
    dimension: "D6",
    subdimension: "Halk Sağlığı Etkisi",
    description: "Yeni vaka oranının azalması",
    measurementType: "quantitative",
    unit: "Vaka/100,000 kişi",
    dataSource: ["Halk sağlığı verileri"],
    cascadeLevel: 2
  },
  {
    code: "I_633",
    name: "Toplumsal Bağışıklık (Herd Immunity)",
    dimension: "D6",
    subdimension: "Halk Sağlığı Etkisi",
    description: "Populasyon düzeyinde bağışıklık oranı",
    measurementType: "quantitative",
    unit: "%",
    dataSource: ["Serolojik çalışmalar"],
    cascadeLevel: 2
  },
  {
    code: "I_641",
    name: "Hasta Memnuniyeti",
    dimension: "D6",
    subdimension: "Hasta Deneyimi",
    description: "Tedaviden hasta memnuniyeti skorları",
    measurementType: "qualitative",
    unit: "1-10 skala",
    dataSource: ["Hasta anketleri", "PRO (Patient-Reported Outcomes)"],
    cascadeLevel: 2
  },
  {
    code: "I_642",
    name: "Yaşam Kalitesi İyileşmesi",
    dimension: "D6",
    subdimension: "Hasta Deneyimi",
    description: "Günlük yaşam kalitesindeki iyileşme (QoL skorları)",
    measurementType: "quantitative",
    unit: "Skor",
    dataSource: ["SF-36", "EQ-5D", "Yaşam kalitesi anketleri"],
    cascadeLevel: 2,
    multiplierType: "social"
  }
];

// D7: ENVIRONMENTAL IMPACT (14 indicators)
export const environmentalImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_711",
    name: "Karbon Ayak İzi Azalması",
    dimension: "D7",
    subdimension: "İklim Değişikliği Etkisi",
    description: "CO2 emisyon azaltımı",
    measurementType: "quantitative",
    unit: "Ton CO2e",
    dataSource: ["LCA çalışmaları", "Çevresel raporlar"],
    cascadeLevel: 1,
    multiplierType: "environmental"
  },
  {
    code: "I_712",
    name: "İklim Değişikliği Adaptasyonu",
    dimension: "D7",
    subdimension: "İklim Değişikliği Etkisi",
    description: "İklim değişikliğine uyum kapasitesi artışı",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["İklim raporları", "IPCC"],
    cascadeLevel: 2
  },
  {
    code: "I_713",
    name: "İklim Politikalarına Bilimsel Temel",
    dimension: "D7",
    subdimension: "İklim Değişikliği Etkisi",
    description: "Politika belgelerinde referans sayısı, IPCC raporlarında yer alma",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["IPCC", "UNFCCC"],
    cascadeLevel: 3
  },
  {
    code: "I_721",
    name: "Enerji Verimliliği Artışı",
    dimension: "D7",
    subdimension: "Enerji ve Kaynak Verimliliği",
    description: "Tasarruf edilen enerji",
    measurementType: "quantitative",
    unit: "kWh, MJ",
    dataSource: ["Enerji analizleri", "Endüstriyel raporlar"],
    cascadeLevel: 1,
    multiplierType: "economic"
  },
  {
    code: "I_722",
    name: "Yenilenebilir Enerji Geçişi",
    dimension: "D7",
    subdimension: "Enerji ve Kaynak Verimliliği",
    description: "Yenilenebilir enerji kapasitesi artışı, enerji karmasındaki pay",
    measurementType: "quantitative",
    unit: "MW, %",
    dataSource: ["IEA", "IRENA"],
    cascadeLevel: 2
  },
  {
    code: "I_723",
    name: "Kaynak Verimliliği",
    dimension: "D7",
    subdimension: "Enerji ve Kaynak Verimliliği",
    description: "Doğal kaynakların verimli kullanımı (kaynak tüketimi azalması)",
    measurementType: "quantitative",
    unit: "Ton, m³",
    dataSource: ["Endüstriyel ekoloji çalışmaları"],
    cascadeLevel: 2
  },
  {
    code: "I_731",
    name: "Tür Koruma",
    dimension: "D7",
    subdimension: "Biyoçeşitlilik ve Ekosistem",
    description: "Korunan veya kurtarılan tür sayısı, IUCN Kırmızı Liste durumu iyileşmesi",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["IUCN", "Koruma biyolojisi çalışmaları"],
    cascadeLevel: 1
  },
  {
    code: "I_732",
    name: "Habitat Restorasyonu",
    dimension: "D7",
    subdimension: "Biyoçeşitlilik ve Ekosistem",
    description: "Restore edilen habitat alanı",
    measurementType: "quantitative",
    unit: "Hektar",
    dataSource: ["Koruma projeleri", "Çevre bakanlığı"],
    cascadeLevel: 2
  },
  {
    code: "I_733",
    name: "Ekosistem Hizmetleri Değeri",
    dimension: "D7",
    subdimension: "Biyoçeşitlilik ve Ekosistem",
    description: "Korunan/iyileştirilen ekosistem hizmetlerinin ekonomik değeri",
    measurementType: "quantitative",
    unit: "USD",
    dataSource: ["Ekosistem hizmetleri değerlendirmeleri"],
    cascadeLevel: 3,
    multiplierType: "economic"
  },
  {
    code: "I_741",
    name: "Hava Kalitesi İyileşmesi",
    dimension: "D7",
    subdimension: "Kirlilik ve Atık Yönetimi",
    description: "PM2.5, NOx, SO2 konsantrasyonu azalması",
    measurementType: "quantitative",
    unit: "µg/m³",
    dataSource: ["Hava kalitesi izleme istasyonları"],
    cascadeLevel: 2,
    multiplierType: "social"
  },
  {
    code: "I_742",
    name: "Su Kalitesi İyileşmesi",
    dimension: "D7",
    subdimension: "Kirlilik ve Atık Yönetimi",
    description: "Su kalitesi parametreleri (BOD, COD, ağır metaller)",
    measurementType: "quantitative",
    unit: "mg/L",
    dataSource: ["Su kalitesi izleme"],
    cascadeLevel: 2
  },
  {
    code: "I_743",
    name: "Atık Azaltımı ve Geri Dönüşüm",
    dimension: "D7",
    subdimension: "Kirlilik ve Atık Yönetimi",
    description: "Azaltılan atık miktarı, geri dönüşüm oranı",
    measurementType: "quantitative",
    unit: "Ton, %",
    dataSource: ["Atık yönetimi raporları"],
    cascadeLevel: 2
  },
  {
    code: "I_751",
    name: "Su Ayak İzi Azalması",
    dimension: "D7",
    subdimension: "Su Kaynakları",
    description: "Su tüketimi azaltımı",
    measurementType: "quantitative",
    unit: "m³",
    dataSource: ["Su ayak izi çalışmaları"],
    cascadeLevel: 2
  },
  {
    code: "I_752",
    name: "SDG Katkı Sayısı",
    dimension: "D7",
    subdimension: "Sürdürülebilir Kalkınma",
    description: "17 SDG'den kaçına katkı sağlandığı",
    measurementType: "quantitative",
    unit: "Sayı (0-17)",
    dataSource: ["BM SDG raporları"],
    cascadeLevel: 4
  }
];

// D8: POLITICAL & LEGAL IMPACT (10 indicators)
export const politicalLegalImpactIndicators: ExtendedIndicator[] = [
  {
    code: "I_811",
    name: "Yasa ve Düzenleme Değişiklikleri",
    dimension: "D8",
    subdimension: "Yasal Düzenlemeler",
    description: "Değiştirilen/oluşturulan yasa sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Yasal veritabanları", "Parlamento kayıtları"],
    cascadeLevel: 3
  },
  {
    code: "I_812",
    name: "Standart ve Norm Oluşturma",
    dimension: "D8",
    subdimension: "Yasal Düzenlemeler",
    description: "Oluşturulan/değiştirilen standart sayısı (ISO, IEEE, vb.)",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["ISO", "IEEE", "Standart kuruluşları"],
    cascadeLevel: 3
  },
  {
    code: "I_813",
    name: "Düzenleyici Kurum Kararları",
    dimension: "D8",
    subdimension: "Yasal Düzenlemeler",
    description: "FDA, EMA, EPA gibi kurumların kararlarına etki",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Düzenleyici kurum raporları"],
    cascadeLevel: 3
  },
  {
    code: "I_821",
    name: "Meclis Tutanaklarında Referans",
    dimension: "D8",
    subdimension: "Politik Süreçler",
    description: "Parlamento tartışmalarında kullanım sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Parlamento kayıtları", "Hansard"],
    cascadeLevel: 3
  },
  {
    code: "I_822",
    name: "Politika Belgelerinde Merkezi Rol",
    dimension: "D8",
    subdimension: "Politik Süreçler",
    description: "Politika belgelerinde referans sayısı ve önem derecesi",
    measurementType: "quantitative",
    unit: "Sayı + 1-5 Likert",
    dataSource: ["Overton.io", "Hükümet web siteleri"],
    cascadeLevel: 3
  },
  {
    code: "I_823",
    name: "Uluslararası Anlaşmalara Etki",
    dimension: "D8",
    subdimension: "Politik Süreçler",
    description: "Anlaşma metinlerinde referans, müzakere sürecine katkı",
    measurementType: "qualitative",
    unit: "İkili (var/yok) veya 1-5 Likert",
    dataSource: ["BM", "AB", "Uluslararası kuruluş belgeleri"],
    cascadeLevel: 4
  },
  {
    code: "I_831",
    name: "Mahkeme Kararlarında Referans",
    dimension: "D8",
    subdimension: "Yasal Uygulamalar",
    description: "Yasal kararlarda bilimsel kanıt olarak kullanım sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["LexisNexis", "Westlaw", "Yasal veritabanları"],
    cascadeLevel: 3
  },
  {
    code: "I_832",
    name: "Yasal Emsal Oluşturma",
    dimension: "D8",
    subdimension: "Yasal Uygulamalar",
    description: "Emsal niteliğindeki karar sayısı",
    measurementType: "quantitative",
    unit: "Sayı",
    dataSource: ["Yasal analizler"],
    cascadeLevel: 4
  },
  {
    code: "I_841",
    name: "Soft Power (Yumuşak Güç) Artışı",
    dimension: "D8",
    subdimension: "Jeopolitik Etki",
    description: "Bilimsel liderlik yoluyla uluslararası etki",
    measurementType: "qualitative",
    unit: "1-5 Likert",
    dataSource: ["Soft power endeksleri", "Bilimsel işbirliği verileri"],
    cascadeLevel: 4
  },
  {
    code: "I_842",
    name: "Teknolojik Egemenlik",
    dimension: "D8",
    subdimension: "Jeopolitik Etki",
    description: "Kritik teknolojilerde liderlik (pazar payı, patent, standart belirleme)",
    measurementType: "quantitative",
    unit: "% + 1-5 Likert",
    dataSource: ["Teknoloji raporları", "Patent veritabanları"],
    cascadeLevel: 4
  }
];

// Export all extended indicators
export const allExtendedIndicators: ExtendedIndicator[] = [
  ...economicImpactIndicators,
  ...healthImpactIndicators,
  ...environmentalImpactIndicators,
  ...politicalLegalImpactIndicators
];
