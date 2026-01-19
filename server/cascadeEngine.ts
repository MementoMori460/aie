/**
 * Cascade Effect Calculation Engine
 * Calculates primary, secondary, tertiary, and higher-order impacts
 * Implements multiplier coefficients and network effects
 */

export interface CascadeLevel {
  level: number; // 1=primary, 2=secondary, 3=tertiary, etc.
  indicators: string[]; // Indicator codes at this level
  totalScore: number;
  multiplier: number;
}

export interface MultiplierCoefficients {
  economic: number; // Typical range: 1.5 - 5.0
  social: number; // Typical range: 2.0 - 10.0
  scientific: number; // Typical range: 10 - 100,000
  environmental: number; // Typical range: 1.5 - 4.0
}

export interface CascadeAnalysis {
  cascadeLevels: CascadeLevel[];
  multipliers: MultiplierCoefficients;
  totalCascadeScore: number;
  networkEffectScore: number;
  feedbackLoops: {
    positive: number; // Self-reinforcing loops
    negative: number; // Balancing loops
    delayed: number; // Time-delayed feedback
  };
}

/**
 * Calculate cascade effects based on indicator values
 */
export function calculateCascadeEffects(
  indicatorValues: Map<string, number>,
  indicatorMetadata: Map<string, { cascadeLevel?: number; multiplierType?: string }>
): CascadeAnalysis {
  // Group indicators by cascade level
  const levelGroups = new Map<number, string[]>();
  
  for (const [code, value] of Array.from(indicatorValues.entries())) {
    const metadata = indicatorMetadata.get(code);
    if (!metadata || value === 0) continue;
    
    const level = metadata.cascadeLevel || 1;
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(code);
  }
  
  // Calculate scores for each cascade level
  const cascadeLevels: CascadeLevel[] = [];
  let cumulativeMultiplier = 1.0;
  
  for (let level = 1; level <= 5; level++) {
    const indicators = levelGroups.get(level) || [];
    if (indicators.length === 0) continue;
    
    // Calculate average score for this level
    const scores = indicators.map(code => indicatorValues.get(code) || 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Apply cascade decay (each level has slightly lower impact)
    const decayFactor = Math.pow(0.85, level - 1); // 15% decay per level
    const levelScore = avgScore * decayFactor;
    
    // Calculate multiplier for this level
    const levelMultiplier = calculateLevelMultiplier(level, indicators, indicatorMetadata);
    cumulativeMultiplier *= levelMultiplier;
    
    cascadeLevels.push({
      level,
      indicators,
      totalScore: levelScore,
      multiplier: levelMultiplier
    });
  }
  
  // Calculate multiplier coefficients by type
  const multipliers = calculateMultiplierCoefficients(indicatorValues, indicatorMetadata);
  
  // Calculate network effect score
  const networkEffectScore = calculateNetworkEffects(indicatorValues, indicatorMetadata);
  
  // Detect feedback loops
  const feedbackLoops = detectFeedbackLoops(indicatorValues, indicatorMetadata);
  
  // Calculate total cascade score
  const totalCascadeScore = cascadeLevels.reduce((sum, level) => {
    return sum + (level.totalScore * level.multiplier);
  }, 0);
  
  return {
    cascadeLevels,
    multipliers,
    totalCascadeScore,
    networkEffectScore,
    feedbackLoops
  };
}

/**
 * Calculate multiplier for a specific cascade level
 */
function calculateLevelMultiplier(
  level: number,
  indicators: string[],
  metadata: Map<string, { cascadeLevel?: number; multiplierType?: string }>
): number {
  if (indicators.length === 0) return 1.0;
  
  // Base multiplier decreases with cascade level
  const baseMultipliers = [1.0, 1.3, 1.5, 1.6, 1.7]; // Level 1-5
  let multiplier = baseMultipliers[level - 1] || 1.0;
  
  // Boost multiplier if there are high-impact multiplier types
  const hasEconomic = indicators.some(code => 
    metadata.get(code)?.multiplierType === "economic"
  );
  const hasSocial = indicators.some(code => 
    metadata.get(code)?.multiplierType === "social"
  );
  const hasScientific = indicators.some(code => 
    metadata.get(code)?.multiplierType === "scientific"
  );
  
  if (hasEconomic) multiplier *= 1.2;
  if (hasSocial) multiplier *= 1.15;
  if (hasScientific) multiplier *= 1.1;
  
  return multiplier;
}

/**
 * Calculate multiplier coefficients by type
 */
function calculateMultiplierCoefficients(
  indicatorValues: Map<string, number>,
  metadata: Map<string, { cascadeLevel?: number; multiplierType?: string }>
): MultiplierCoefficients {
  const typeScores = {
    economic: [] as number[],
    social: [] as number[],
    scientific: [] as number[],
    environmental: [] as number[]
  };
  
  // Group scores by multiplier type
  for (const [code, value] of Array.from(indicatorValues.entries())) {
    const meta = metadata.get(code);
    if (!meta || value === 0) continue;
    
    const type = meta.multiplierType as keyof typeof typeScores;
    if (type && typeScores[type]) {
      typeScores[type].push(value);
    }
  }
  
  // Calculate average multiplier for each type
  const calculateAvgMultiplier = (scores: number[], baseMin: number, baseMax: number) => {
    if (scores.length === 0) return 1.0;
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    // Map score (0-100) to multiplier range
    return baseMin + (avgScore / 100) * (baseMax - baseMin);
  };
  
  return {
    economic: calculateAvgMultiplier(typeScores.economic, 1.5, 5.0),
    social: calculateAvgMultiplier(typeScores.social, 2.0, 10.0),
    scientific: calculateAvgMultiplier(typeScores.scientific, 10, 1000), // Can be very high
    environmental: calculateAvgMultiplier(typeScores.environmental, 1.5, 4.0)
  };
}

/**
 * Calculate network effect score
 * Network effects: value increases as more users/connections are added
 */
function calculateNetworkEffects(
  indicatorValues: Map<string, number>,
  metadata: Map<string, { cascadeLevel?: number; multiplierType?: string }>
): number {
  // Network effect indicators (collaboration, platform creation, etc.)
  const networkIndicators = [
    "I_913", // Platform Oluşturma
    "I_1511", // Uluslararası İşbirliği Sayısı
    "I_1512", // Ağ Genişliği ve Yoğunluğu
    "I_1641", // Doğrudan Ağ Etkisi
    "I_1642"  // Dolaylı Ağ Etkisi
  ];
  
  let totalNetworkScore = 0;
  let count = 0;
  
  for (const code of networkIndicators) {
    const value = indicatorValues.get(code);
    if (value && value > 0) {
      // Network effects are non-linear (Metcalfe's Law: value ∝ n²)
      const networkValue = Math.pow(value / 100, 1.5) * 100;
      totalNetworkScore += networkValue;
      count++;
    }
  }
  
  return count > 0 ? totalNetworkScore / count : 0;
}

/**
 * Detect feedback loops in the impact system
 */
function detectFeedbackLoops(
  indicatorValues: Map<string, number>,
  metadata: Map<string, { cascadeLevel?: number; multiplierType?: string }>
): { positive: number; negative: number; delayed: number } {
  // Positive feedback loop indicators (self-reinforcing)
  const positiveFeedbackIndicators = [
    "I_1651", // Pozitif Geri Besleme Döngüsü
    "I_913",  // Platform Oluşturma (network effects)
    "I_1641"  // Doğrudan Ağ Etkisi
  ];
  
  // Negative feedback loop indicators (balancing)
  const negativeFeedbackIndicators = [
    "I_1652", // Negatif Geri Besleme Döngüsü
    "I_922"   // Yıkıcı İnovasyon (market saturation)
  ];
  
  // Delayed feedback indicators
  const delayedFeedbackIndicators = [
    "I_1653", // Gecikmeli Geri Besleme
    "I_1614", // Gecikmeli Etkiler (Sleeping Beauty)
    "I_1142"  // Mesleki Gelişim Etkisi (long-term career impact)
  ];
  
  const calculateFeedbackScore = (indicators: string[]) => {
    let score = 0;
    let count = 0;
    for (const code of indicators) {
      const value = indicatorValues.get(code);
      if (value && value > 0) {
        score += value;
        count++;
      }
    }
    return count > 0 ? score / count : 0;
  };
  
  return {
    positive: calculateFeedbackScore(positiveFeedbackIndicators),
    negative: calculateFeedbackScore(negativeFeedbackIndicators),
    delayed: calculateFeedbackScore(delayedFeedbackIndicators)
  };
}

/**
 * Calculate overall cascade multiplier
 * This is the final multiplier applied to the base impact score
 */
export function calculateOverallCascadeMultiplier(
  cascadeAnalysis: CascadeAnalysis
): number {
  // Base multiplier from cascade levels
  const cascadeMultiplier = cascadeAnalysis.cascadeLevels.reduce((product, level) => {
    return product * level.multiplier;
  }, 1.0);
  
  // Network effect boost (up to 50% boost)
  const networkBoost = 1 + (cascadeAnalysis.networkEffectScore / 200);
  
  // Feedback loop adjustment
  const feedbackAdjustment = 1 + 
    (cascadeAnalysis.feedbackLoops.positive / 200) - 
    (cascadeAnalysis.feedbackLoops.negative / 400) +
    (cascadeAnalysis.feedbackLoops.delayed / 300);
  
  // Combined multiplier
  const overallMultiplier = cascadeMultiplier * networkBoost * feedbackAdjustment;
  
  // Cap at reasonable maximum (10x)
  return Math.min(overallMultiplier, 10.0);
}

/**
 * Generate cascade effect explanation for users
 */
export function generateCascadeExplanation(cascadeAnalysis: CascadeAnalysis): string {
  const explanations: string[] = [];
  
  explanations.push(`Bu araştırmanın ${cascadeAnalysis.cascadeLevels.length} seviyeli zincirleme etkisi tespit edildi:`);
  
  for (const level of cascadeAnalysis.cascadeLevels) {
    const levelName = ["Birincil", "İkincil", "Üçüncül", "Dördüncül", "Beşincil"][level.level - 1];
    explanations.push(
      `${levelName} Etki (Seviye ${level.level}): ${level.indicators.length} gösterge, ` +
      `Skor: ${level.totalScore.toFixed(1)}, Çarpan: ${level.multiplier.toFixed(2)}x`
    );
  }
  
  explanations.push("");
  explanations.push("Çarpan Katsayıları:");
  explanations.push(`- Ekonomik: ${cascadeAnalysis.multipliers.economic.toFixed(2)}x (her 1$ yatırım → ${cascadeAnalysis.multipliers.economic.toFixed(2)}$ değer)`);
  explanations.push(`- Sosyal: ${cascadeAnalysis.multipliers.social.toFixed(2)}x (doğrudan faydalanan başına ${cascadeAnalysis.multipliers.social.toFixed(1)} dolaylı faydalanan)`);
  explanations.push(`- Bilimsel: ${cascadeAnalysis.multipliers.scientific.toFixed(0)}x (1 öncü makale → ${cascadeAnalysis.multipliers.scientific.toFixed(0)} takip makalesi)`);
  explanations.push(`- Çevresel: ${cascadeAnalysis.multipliers.environmental.toFixed(2)}x`);
  
  if (cascadeAnalysis.networkEffectScore > 10) {
    explanations.push("");
    explanations.push(`Ağ Etkisi: ${cascadeAnalysis.networkEffectScore.toFixed(1)} (platform/işbirliği etkisi güçlü)`);
  }
  
  if (cascadeAnalysis.feedbackLoops.positive > 20) {
    explanations.push("");
    explanations.push(`Pozitif Geri Besleme: ${cascadeAnalysis.feedbackLoops.positive.toFixed(1)} (kendini güçlendiren döngü mevcut)`);
  }
  
  return explanations.join("\n");
}

/**
 * Calculate cascade multipliers from dimension scores (for Comprehensive Mode)
 * This is used when users evaluate at dimension level instead of indicator level
 */
export function calculateCascadeMultipliersFromDimensions(dimensionScores: {
  D1?: number;
  D2?: number;
  D3?: number;
  D4?: number;
  D5?: number;
  D6?: number;
  D7?: number;
  D8?: number;
  D9?: number;
  D10?: number;
  D11?: number;
  D12?: number;
  D13?: number;
  D14?: number;
  D15?: number;
}): {
  economicMultiplier: number;
  socialMultiplier: number;
  scientificMultiplier: number;
  environmentalMultiplier: number;
  networkEffectScore: number;
  cascadeMultiplier: number;
} {
  // Economic multiplier from D5 (Economic Impact)
  const economicScore = dimensionScores.D5 || 0;
  const economicMultiplier = 1.5 + (economicScore / 100) * 3.5; // 1.5 - 5.0x

  // Social multiplier from D2 (Social Impact) and D10 (Social & Cultural Impact)
  const socialScore = ((dimensionScores.D2 || 0) + (dimensionScores.D10 || 0)) / 2;
  const socialMultiplier = 2.0 + (socialScore / 100) * 8.0; // 2.0 - 10.0x

  // Scientific multiplier from D1 (Academic Impact) and D9 (Technological Impact)
  const scientificScore = ((dimensionScores.D1 || 0) + (dimensionScores.D9 || 0)) / 2;
  // Logarithmic scale for scientific impact (can be very high)
  const scientificMultiplier = 10 * Math.pow(10, (scientificScore / 100) * 2); // 10 - 1000x

  // Environmental multiplier from D7 (Environmental Impact)
  const environmentalScore = dimensionScores.D7 || 0;
  const environmentalMultiplier = 1.5 + (environmentalScore / 100) * 2.5; // 1.5 - 4.0x

  // Network effect score from D9 (Tech), D15 (Intl Collaboration), D12 (Digital/Media)
  const techScore = dimensionScores.D9 || 0;
  const collabScore = dimensionScores.D15 || 0;
  const digitalScore = dimensionScores.D12 || 0;
  const avgNetworkScore = (techScore + collabScore + digitalScore) / 3;
  // Apply Metcalfe's Law: value ∝ n^2 (using n^1.5 for more conservative estimate)
  const networkEffectScore = Math.pow(avgNetworkScore / 100, 1.5) * 100;

  // Calculate overall cascade multiplier
  // Weighted combination of all multipliers
  const cascadeMultiplier = Math.min(
    (economicMultiplier * 0.25 +
      socialMultiplier * 0.25 +
      Math.min(scientificMultiplier, 100) * 0.01 + // Cap scientific at 100x for this calculation
      environmentalMultiplier * 0.15 +
      (1 + networkEffectScore / 100) * 0.34),
    10.0 // Cap at 10x
  );

  return {
    economicMultiplier,
    socialMultiplier,
    scientificMultiplier,
    environmentalMultiplier,
    networkEffectScore,
    cascadeMultiplier,
  };
}

/**
 * Calculate 5-level cascade effects from dimension scores
 * Each level represents progressively indirect impacts
 */
export function calculate5LevelCascadeFromDimensions(dimensionScores: {
  D1?: number;
  D2?: number;
  D3?: number;
  D4?: number;
  D5?: number;
  D6?: number;
  D7?: number;
  D8?: number;
  D9?: number;
  D10?: number;
  D11?: number;
  D12?: number;
  D13?: number;
  D14?: number;
  D15?: number;
}): {
  level1: number; // Primary impact (direct)
  level2: number; // Secondary impact (one step removed)
  level3: number; // Tertiary impact (two steps removed)
  level4: number; // Quaternary impact (three steps removed)
  level5: number; // Quinary impact (four steps removed)
} {
  // Calculate base score (average of all dimensions)
  const allScores = [
    dimensionScores.D1 || 0,
    dimensionScores.D2 || 0,
    100 - (dimensionScores.D3 || 0), // Invert negative impact
    dimensionScores.D4 || 0,
    dimensionScores.D5 || 0,
    dimensionScores.D6 || 0,
    dimensionScores.D7 || 0,
    dimensionScores.D8 || 0,
    dimensionScores.D9 || 0,
    dimensionScores.D10 || 0,
    dimensionScores.D11 || 0,
    dimensionScores.D12 || 0,
    dimensionScores.D13 || 0,
    dimensionScores.D14 || 0,
    dimensionScores.D15 || 0,
  ];
  const baseScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

  // Apply decay factor for each level (15% decay per level)
  const level1 = baseScore; // 100% of base impact
  const level2 = baseScore * 0.85; // 85% of base impact
  const level3 = baseScore * 0.70; // 70% of base impact
  const level4 = baseScore * 0.55; // 55% of base impact
  const level5 = baseScore * 0.40; // 40% of base impact

  return {
    level1,
    level2,
    level3,
    level4,
    level5,
  };
}
