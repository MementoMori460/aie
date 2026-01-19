/**
 * Evaluation Modes Configuration
 * Defines two evaluation modes: Quick (37 indicators) and Comprehensive (193 indicators)
 */

export type EvaluationMode = "quick" | "comprehensive";

export interface ModeConfig {
  id: EvaluationMode;
  name: string;
  description: string;
  indicatorCount: number;
  estimatedTime: string;
  features: string[];
  dimensions: string[];
  requiresAI: boolean;
  cascadeEffects: boolean;
}

export const EVALUATION_MODES: Record<EvaluationMode, ModeConfig> = {
  quick: {
    id: "quick",
    name: "Hızlı Mod",
    description: "Temel akademik etki değerlendirmesi - Yeni başlayanlar için ideal",
    indicatorCount: 37,
    estimatedTime: "15-30 dakika",
    features: [
      "37 temel gösterge",
      "4 ana boyut (Akademik, Toplumsal, Negatif, Etik)",
      "Manuel veya AI destekli veri girişi",
      "Temel hesaplama ve raporlama",
      "PDF/Excel export"
    ],
    dimensions: [
      "D1: Akademik Etki (11 gösterge)",
      "D2: Toplumsal ve Pratik Etki (11 gösterge)",
      "D3: Negatif Etki ve Risk (9 gösterge)",
      "D4: Etik ve Sorumluluk (6 gösterge)"
    ],
    requiresAI: false,
    cascadeEffects: false
  },
  
  comprehensive: {
    id: "comprehensive",
    name: "Kapsamlı Mod",
    description: "Tam gerçek dünya etki analizi - Detaylı araştırma raporları için",
    indicatorCount: 193,
    estimatedTime: "30-45 dakika (boyut seviyesi değerlendirme)",
    features: [
      "16 boyut seviyesi değerlendirme (slider bazlı)",
      "193 gösterge dokümantasyon olarak dahil",
      "Zincirleme etki analizi (5 seviye)",
      "Çarpan katsayıları (ekonomik, sosyal, bilimsel, çevresel)",
      "Ağ etkileri ve geri besleme döngüleri",
      "Her boyut için rehberlik ve örnekler",
      "Gelişmiş raporlama ve görselleştirme"
    ],
    dimensions: [
      "D1: Akademik Etki (11 gösterge)",
      "D2: Toplumsal ve Pratik Etki (11 gösterge)",
      "D3: Negatif Etki ve Risk (9 gösterge)",
      "D4: Etik ve Sorumluluk (6 gösterge)",
      "D5: Ekonomik Etki (15 gösterge)",
      "D6: Sağlık Etkisi (12 gösterge)",
      "D7: Çevresel Etki (14 gösterge)",
      "D8: Politik ve Yasal Etki (10 gösterge)",
      "D9: Teknolojik Etki (13 gösterge)",
      "D10: Sosyal ve Kültürel Etki (15 gösterge)",
      "D11: Eğitim Etkisi (10 gösterge)",
      "D12: Dijital ve Medya Etkisi (12 gösterge)",
      "D13: Güvenlik ve Savunma Etkisi (8 gösterge)",
      "D14: Psikolojik ve Refah Etkisi (10 gösterge)",
      "D15: Uluslararası İşbirliği (12 gösterge)",
      "D16: Zincirleme ve Çarpan Etkileri (15 gösterge)"
    ],
    requiresAI: true,
    cascadeEffects: true
  }
};

/**
 * Get mode configuration by ID
 */
export function getModeConfig(mode: EvaluationMode): ModeConfig {
  return EVALUATION_MODES[mode];
}

/**
 * Get all available modes
 */
export function getAllModes(): ModeConfig[] {
  return Object.values(EVALUATION_MODES);
}

/**
 * Validate if a mode requires AI assistance
 */
export function requiresAI(mode: EvaluationMode): boolean {
  return EVALUATION_MODES[mode].requiresAI;
}

/**
 * Check if cascade effects are enabled for a mode
 */
export function hasCascadeEffects(mode: EvaluationMode): boolean {
  return EVALUATION_MODES[mode].cascadeEffects;
}

/**
 * Get indicator count for a mode
 */
export function getIndicatorCount(mode: EvaluationMode): number {
  return EVALUATION_MODES[mode].indicatorCount;
}

/**
 * Get dimension list for a mode
 */
export function getDimensions(mode: EvaluationMode): string[] {
  return EVALUATION_MODES[mode].dimensions;
}
