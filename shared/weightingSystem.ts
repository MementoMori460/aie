/**
 * Weighting System for Holistic Impact Score (HIS) Calculation
 * Supports both Quick Mode (4 dimensions) and Comprehensive Mode (16 dimensions)
 */

export interface DimensionWeight {
  code: string;
  name: string;
  weight: number;
  description: string;
}

/**
 * Quick Mode Weights (4 dimensions)
 * Total: 1.00 (100%)
 */
export const QUICK_MODE_WEIGHTS: DimensionWeight[] = [
  {
    code: "D1",
    name: "Akademik Etki",
    weight: 0.35,
    description: "Bilimsel topluluk içindeki etki ve katkı"
  },
  {
    code: "D2",
    name: "Toplumsal ve Pratik Etki",
    weight: 0.35,
    description: "Akademi dışındaki toplumsal ve pratik uygulamalardaki etki"
  },
  {
    code: "D3",
    name: "Negatif Etki ve Risk",
    weight: 0.15,
    description: "Potansiyel olumsuz etkiler ve riskler (ters çevrilir)"
  },
  {
    code: "D4",
    name: "Etik ve Sorumluluk",
    weight: 0.15,
    description: "Etik standartlar ve sosyal sorumluluk"
  }
];

/**
 * Comprehensive Mode Weights (16 dimensions)
 * Total: 1.00 (100%)
 * 
 * Weight distribution strategy:
 * - Core academic/social impact: 40% (D1, D2)
 * - Ethics and risks: 20% (D3, D4)
 * - Extended impact dimensions: 40% (D5-D16)
 */
export const COMPREHENSIVE_MODE_WEIGHTS: DimensionWeight[] = [
  // Core dimensions (60%)
  {
    code: "D1",
    name: "Akademik Etki",
    weight: 0.20,
    description: "Bilimsel topluluk içindeki etki ve katkı"
  },
  {
    code: "D2",
    name: "Toplumsal ve Pratik Etki",
    weight: 0.20,
    description: "Akademi dışındaki toplumsal ve pratik uygulamalardaki etki"
  },
  {
    code: "D3",
    name: "Negatif Etki ve Risk",
    weight: 0.10,
    description: "Potansiyel olumsuz etkiler ve riskler (ters çevrilir)"
  },
  {
    code: "D4",
    name: "Etik ve Sorumluluk",
    weight: 0.10,
    description: "Etik standartlar ve sosyal sorumluluk"
  },
  
  // Extended dimensions (40%)
  {
    code: "D5",
    name: "Ekonomik Etki",
    weight: 0.08,
    description: "GSYİH, istihdam, yatırım ve pazar etkisi"
  },
  {
    code: "D6",
    name: "Sağlık Etkisi",
    weight: 0.08,
    description: "Sağlık sonuçları, yaşam kalitesi ve sağlık sistemi etkisi"
  },
  {
    code: "D7",
    name: "Çevresel Etki",
    weight: 0.06,
    description: "İklim, enerji, biyoçeşitlilik ve kirlilik etkisi"
  },
  {
    code: "D8",
    name: "Politik ve Yasal Etki",
    weight: 0.04,
    description: "Yasa, politika, düzenleme ve jeopolitik etki"
  },
  {
    code: "D9",
    name: "Teknolojik Etki",
    weight: 0.04,
    description: "Teknoloji transferi, inovasyon ve dijitalleşme"
  },
  {
    code: "D10",
    name: "Sosyal ve Kültürel Etki",
    weight: 0.03,
    description: "Davranış değişikliği, sosyal adalet ve kültürel üretim"
  },
  {
    code: "D11",
    name: "Eğitim Etkisi",
    weight: 0.03,
    description: "Müfredat, öğrenci sonuçları ve yaşam boyu öğrenme"
  },
  {
    code: "D12",
    name: "Dijital ve Medya Etkisi",
    weight: 0.02,
    description: "Dijital içerik, medya ve popüler kültür etkisi"
  },
  {
    code: "D13",
    name: "Güvenlik ve Savunma Etkisi",
    weight: 0.02,
    description: "Ulusal güvenlik, kamu güvenliği ve küresel güvenlik"
  },
  {
    code: "D14",
    name: "Psikolojik ve Refah Etkisi",
    weight: 0.02,
    description: "Mental sağlık, yaşam memnuniyeti ve sosyal bağlantı"
  },
  {
    code: "D15",
    name: "Uluslararası İşbirliği",
    weight: 0.02,
    description: "Araştırma işbirliği, bilgi transferi ve diplomatik ilişkiler"
  },
  {
    code: "D16",
    name: "Zincirleme ve Çarpan Etkileri",
    weight: 0.02,
    description: "Zaman dinamikleri, zincirleme etkiler ve ağ etkileri"
  }
];

/**
 * Get weights for a specific mode
 */
export function getWeightsForMode(mode: "quick" | "comprehensive"): DimensionWeight[] {
  return mode === "quick" ? QUICK_MODE_WEIGHTS : COMPREHENSIVE_MODE_WEIGHTS;
}

/**
 * Calculate Holistic Impact Score (HIS)
 * @param dimensionScores - Map of dimension code to score (0-100)
 * @param mode - Evaluation mode
 * @param cascadeMultiplier - Optional cascade multiplier for comprehensive mode (default: 1.0)
 * @returns HIS score (0-100)
 */
export function calculateHIS(
  dimensionScores: Record<string, number>,
  mode: "quick" | "comprehensive",
  cascadeMultiplier: number = 1.0
): number {
  const weights = getWeightsForMode(mode);
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const { code, weight } of weights) {
    const score = dimensionScores[code];
    if (score !== undefined && score !== null) {
      // D3 (Negative Impact) is inverted: higher score = more risk = lower HIS contribution
      const adjustedScore = code === "D3" ? (100 - score) : score;
      
      weightedSum += adjustedScore * weight;
      totalWeight += weight;
    }
  }
  
  // Calculate base HIS
  const baseHIS = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Apply cascade multiplier for comprehensive mode
  if (mode === "comprehensive" && cascadeMultiplier > 1.0) {
    // Cascade multiplier increases the score, but capped at 100
    const multipliedHIS = baseHIS * cascadeMultiplier;
    return Math.min(multipliedHIS, 100);
  }
  
  return baseHIS;
}

/**
 * Validate dimension scores
 * @param dimensionScores - Map of dimension code to score
 * @param mode - Evaluation mode
 * @returns Validation result
 */
export function validateDimensionScores(
  dimensionScores: Record<string, number>,
  mode: "quick" | "comprehensive"
): { valid: boolean; errors: string[] } {
  const weights = getWeightsForMode(mode);
  const errors: string[] = [];
  
  for (const { code, name } of weights) {
    const score = dimensionScores[code];
    
    if (score === undefined || score === null) {
      errors.push(`${name} (${code}) skoru eksik`);
      continue;
    }
    
    if (typeof score !== "number") {
      errors.push(`${name} (${code}) skoru sayı olmalı`);
      continue;
    }
    
    if (score < 0 || score > 100) {
      errors.push(`${name} (${code}) skoru 0-100 arasında olmalı (mevcut: ${score})`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get dimension weight by code
 */
export function getDimensionWeight(code: string, mode: "quick" | "comprehensive"): number {
  const weights = getWeightsForMode(mode);
  const dimension = weights.find(w => w.code === code);
  return dimension?.weight || 0;
}

/**
 * Normalize weights to sum to 1.0
 * Useful for custom weighting scenarios
 */
export function normalizeWeights(weights: DimensionWeight[]): DimensionWeight[] {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  
  if (totalWeight === 0) {
    return weights;
  }
  
  return weights.map(w => ({
    ...w,
    weight: w.weight / totalWeight
  }));
}
