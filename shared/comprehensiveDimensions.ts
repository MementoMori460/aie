/**
 * Comprehensive Mode - Dimension Level Evaluation
 * For Comprehensive Mode, users evaluate at dimension level (16 dimensions)
 * instead of indicator level (193 indicators)
 */

export interface ComprehensiveDimension {
  code: string;
  name: string;
  description: string;
  weight: number;
  indicatorCount: number;
  examples: string[];
  evaluationGuidance: string;
}

export const COMPREHENSIVE_DIMENSIONS: ComprehensiveDimension[] = [
  // Original 4 dimensions (D1-D4) - same as Quick Mode
  {
    code: "D1",
    name: "Akademik Etki",
    description: "Bilimsel topluluk içindeki etki ve katkı",
    weight: 0.19,
    indicatorCount: 11,
    examples: [
      "Atıf sayısı ve h-indeks",
      "Disiplinlerarası etki",
      "Metodolojik katkı"
    ],
    evaluationGuidance: "Makalenin bilimsel topluluk üzerindeki etkisini değerlendirin. Atıf sayısı, metodolojik yenilik ve disiplinlerarası katkıyı göz önünde bulundurun."
  },
  {
    code: "D2",
    name: "Toplumsal ve Pratik Etki",
    description: "Akademi dışındaki toplumsal ve pratik uygulamalardaki etki",
    weight: 0.19,
    indicatorCount: 11,
    examples: [
      "Politika etkisi",
      "Endüstri uygulamaları",
      "Medya ve kamuoyu etkisi"
    ],
    evaluationGuidance: "Makalenin akademi dışında toplum, endüstri ve politika üzerindeki etkisini değerlendirin."
  },
  {
    code: "D3",
    name: "Negatif Etki ve Risk",
    description: "Potansiyel olumsuz etkiler ve riskler",
    weight: 0.09,
    indicatorCount: 9,
    examples: [
      "Çevresel riskler",
      "Etik sorunlar",
      "Kötüye kullanım potansiyeli"
    ],
    evaluationGuidance: "Makalenin potansiyel olumsuz etkilerini ve risklerini değerlendirin. Yüksek puan daha fazla risk anlamına gelir."
  },
  {
    code: "D4",
    name: "Etik ve Sorumluluk",
    description: "Etik standartlar ve sosyal sorumluluk",
    weight: 0.09,
    indicatorCount: 6,
    examples: [
      "Etik onay ve şeffaflık",
      "Sosyal sorumluluk",
      "Açık bilim uygulamaları"
    ],
    evaluationGuidance: "Makalenin etik standartlara uygunluğunu ve sosyal sorumluluğunu değerlendirin."
  },
  
  // Extended 12 dimensions (D5-D16) - Comprehensive Mode only
  {
    code: "D5",
    name: "Ekonomik Etki",
    description: "GSYİH, istihdam, yatırım ve pazar etkisi",
    weight: 0.08,
    indicatorCount: 15,
    examples: [
      "GSYİH katkısı ve istihdam yaratma",
      "Yatırım ve finansman çekme",
      "Pazar büyüklüğü ve ticaret hacmi"
    ],
    evaluationGuidance: "Makalenin ekonomiye katkısını değerlendirin: GSYİH artışı, istihdam, yatırım çekme, pazar oluşturma."
  },
  {
    code: "D6",
    name: "Sağlık Etkisi",
    description: "Sağlık sonuçları, yaşam kalitesi ve sağlık sistemi etkisi",
    weight: 0.08,
    indicatorCount: 12,
    examples: [
      "QALY ve DALY iyileşmesi",
      "Mortalite ve morbidite azalması",
      "Sağlık sistemi verimliliği"
    ],
    evaluationGuidance: "Makalenin sağlık üzerindeki etkisini değerlendirin: yaşam kalitesi, hastalık azalması, sağlık sistemi iyileşmesi."
  },
  {
    code: "D7",
    name: "Çevresel Etki",
    description: "İklim, enerji, biyoçeşitlilik ve kirlilik etkisi",
    weight: 0.06,
    indicatorCount: 14,
    examples: [
      "Karbon emisyonu azalması",
      "Enerji verimliliği ve yenilenebilir enerji",
      "Biyoçeşitlilik korunması"
    ],
    evaluationGuidance: "Makalenin çevre üzerindeki etkisini değerlendirin: iklim değişikliği, enerji, biyoçeşitlilik, kirlilik."
  },
  {
    code: "D8",
    name: "Politik ve Yasal Etki",
    description: "Yasa, politika, düzenleme ve jeopolitik etki",
    weight: 0.04,
    indicatorCount: 10,
    examples: [
      "Yasa ve düzenleme değişikliği",
      "Politika oluşturma ve reform",
      "Jeopolitik ilişkiler"
    ],
    evaluationGuidance: "Makalenin politika ve yasalar üzerindeki etkisini değerlendirin: yasa değişikliği, politika oluşturma, düzenlemeler."
  },
  {
    code: "D9",
    name: "Teknolojik Etki",
    description: "Teknoloji transferi, inovasyon ve dijitalleşme",
    weight: 0.04,
    indicatorCount: 13,
    examples: [
      "Teknoloji yayılımı ve spin-off şirketler",
      "Yıkıcı inovasyon ve patent",
      "Dijitalleşme ve Endüstri 4.0"
    ],
    evaluationGuidance: "Makalenin teknoloji üzerindeki etkisini değerlendirin: teknoloji transferi, inovasyon, dijital dönüşüm."
  },
  {
    code: "D10",
    name: "Sosyal ve Kültürel Etki",
    description: "Davranış değişikliği, sosyal adalet ve kültürel üretim",
    weight: 0.03,
    indicatorCount: 15,
    examples: [
      "Davranış değişikliği ve norm değişimi",
      "Eşitsizlik azalması ve sosyal adalet",
      "Kültürel eserler ve söylem değişimi"
    ],
    evaluationGuidance: "Makalenin toplumsal davranışlar, sosyal adalet ve kültür üzerindeki etkisini değerlendirin."
  },
  {
    code: "D11",
    name: "Eğitim Etkisi",
    description: "Müfredat, öğrenci sonuçları ve yaşam boyu öğrenme",
    weight: 0.03,
    indicatorCount: 10,
    examples: [
      "Müfredat entegrasyonu ve ders kitapları",
      "Öğrenci başarısı ve eğitim erişimi",
      "Öğretmen eğitimi ve yetişkin eğitimi"
    ],
    evaluationGuidance: "Makalenin eğitim sistemi üzerindeki etkisini değerlendirin: müfredat, öğrenci başarısı, öğretmen eğitimi."
  },
  {
    code: "D12",
    name: "Dijital ve Medya Etkisi",
    description: "Dijital içerik, medya ve popüler kültür etkisi",
    weight: 0.02,
    indicatorCount: 12,
    examples: [
      "Dijital erişim ve platform kullanımı",
      "Medya etkisi ve podcast/video içeriği",
      "Sosyal medya ve viral yayılım"
    ],
    evaluationGuidance: "Makalenin dijital medya ve popüler kültür üzerindeki etkisini değerlendirin: dijital içerik, medya, sosyal medya."
  },
  {
    code: "D13",
    name: "Güvenlik ve Savunma Etkisi",
    description: "Ulusal güvenlik, kamu güvenliği ve küresel güvenlik",
    weight: 0.02,
    indicatorCount: 8,
    examples: [
      "Savunma teknolojisi ve siber savunma",
      "Suç önleme ve acil durum müdahalesi",
      "Nükleer güvenlik ve terörizm önleme"
    ],
    evaluationGuidance: "Makalenin güvenlik üzerindeki etkisini değerlendirin: ulusal güvenlik, kamu güvenliği, küresel güvenlik."
  },
  {
    code: "D14",
    name: "Psikolojik ve Refah Etkisi",
    description: "Mental sağlık, yaşam memnuniyeti ve sosyal bağlantı",
    weight: 0.02,
    indicatorCount: 10,
    examples: [
      "Psikolojik iyi oluş ve mental hastalık azalması",
      "Yaşam memnuniyeti ve mutluluk artışı",
      "Sosyal bağlantı ve ilişki kalitesi"
    ],
    evaluationGuidance: "Makalenin mental sağlık ve yaşam kalitesi üzerindeki etkisini değerlendirin: psikolojik iyi oluş, mutluluk, sosyal bağlantı."
  },
  {
    code: "D15",
    name: "Uluslararası İşbirliği",
    description: "Araştırma işbirliği, bilgi transferi ve diplomatik ilişkiler",
    weight: 0.02,
    indicatorCount: 12,
    examples: [
      "Uluslararası işbirliği ve ağ genişliği",
      "Güney-Kuzey işbirliği ve kapasite geliştirme",
      "Küresel altyapı ve bilim diplomasisi"
    ],
    evaluationGuidance: "Makalenin uluslararası işbirliği üzerindeki etkisini değerlendirin: araştırma ağları, bilgi transferi, diplomasi."
  },
  {
    code: "D16",
    name: "Zincirleme ve Çarpan Etkileri",
    description: "Zaman dinamikleri, zincirleme etkiler ve ağ etkileri (otomatik hesaplanır)",
    weight: 0.00,
    indicatorCount: 15,
    examples: [
      "Etki hızı ve sürekliliği",
      "İkincil, üçüncül ve daha ileri etkiler",
      "Ekonomik, sosyal ve bilimsel çarpan katsayıları",
      "Ağ etkileri ve geri besleme döngüleri"
    ],
    evaluationGuidance: "Makalenin zincirleme etkilerini değerlendirin: etki hızı, ikincil/üçüncül etkiler, çarpan katsayıları, ağ etkileri."
  }
];

/**
 * Get dimension by code
 */
export function getDimensionByCode(code: string): ComprehensiveDimension | undefined {
  return COMPREHENSIVE_DIMENSIONS.find(d => d.code === code);
}

/**
 * Get all dimension codes
 */
export function getAllDimensionCodes(): string[] {
  return COMPREHENSIVE_DIMENSIONS.map(d => d.code);
}

/**
 * Get dimensions for a specific mode
 */
export function getDimensionsForMode(mode: "quick" | "comprehensive"): ComprehensiveDimension[] {
  if (mode === "quick") {
    return COMPREHENSIVE_DIMENSIONS.filter(d => ["D1", "D2", "D3", "D4"].includes(d.code));
  }
  return COMPREHENSIVE_DIMENSIONS;
}

/**
 * Calculate total indicator count for a mode
 */
export function getTotalIndicatorCount(mode: "quick" | "comprehensive"): number {
  const dimensions = getDimensionsForMode(mode);
  return dimensions.reduce((sum, d) => sum + d.indicatorCount, 0);
}
