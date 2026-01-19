/**
 * Complete Calculation Engine
 * Based on HIS Technical Documentation v3.0
 * 
 * This file contains all calculation functions for:
 * - Normalization (logarithmic, linear, binary)
 * - Subdimension and dimension score calculation
 * - HIS calculation (Quick and Comprehensive modes)
 * - Cascade effect calculation (5 levels)
 * - Multiplier calculations (economic, social, scientific, environmental)
 * - Network effects (Metcalfe's Law)
 */

import { COMPLETE_INDICATORS, DIMENSION_WEIGHTS, type CompleteIndicator } from './completeIndicatorSystem';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface IndicatorValue {
  code: string;
  rawValue: number;
  normalizedScore?: number;
  justification?: string;
}

export interface SubdimensionScore {
  code: string;
  name: string;
  score: number;
  indicatorCount: number;
  indicators: { code: string; score: number; weight: number }[];
}

export interface DimensionScore {
  code: string;
  name: string;
  score: number;
  weight: number;
  subdimensions: SubdimensionScore[];
}

export interface CascadeLevelResult {
  level: number;
  name: string;
  decayFactor: number;
  effect: number;
  cumulative: number;
  indicatorCount: number;
}

export interface MultiplierResults {
  economic: number;
  social: number;
  scientific: number;
  environmental: number;
  networkEffect: number;
  total: number;
}

export interface HISCalculationResult {
  mode: 'quick' | 'comprehensive';
  baseHIS: number;
  finalHIS: number;
  cascadeMultiplier: number;
  dimensionScores: DimensionScore[];
  cascadeLevels: CascadeLevelResult[];
  multipliers: MultiplierResults;
  validationStatus: 'valid' | 'warning' | 'invalid';
  warnings: string[];
  calculationDetails: CalculationDetails;
}

export interface CalculationDetails {
  totalIndicators: number;
  filledIndicators: number;
  coveragePercent: number;
  formulasUsed: FormulaUsed[];
  dataQuality: DataQualityMetrics;
}

export interface FormulaUsed {
  name: string;
  formula: string;
  inputs: Record<string, number>;
  output: number;
}

export interface DataQualityMetrics {
  apiDataCount: number;
  manualDataCount: number;
  expertDataCount: number;
  missingDataCount: number;
  outlierCount: number;
}

// ============================================================
// NORMALIZATION FUNCTIONS
// ============================================================

/**
 * Logarithmic normalization
 * Formula: 100 × (ln(1 + x) / ln(1 + max))
 */
export function normalizeLogarithmic(value: number, maxValue: number, minValue: number = 0): number {
  if (value <= minValue) return 0;
  if (maxValue <= minValue) return 0;
  
  const shiftedValue = value - minValue;
  const shiftedMax = maxValue - minValue;
  
  const score = 100 * (Math.log(1 + shiftedValue) / Math.log(1 + shiftedMax));
  return Math.min(100, Math.max(0, score));
}

/**
 * Linear normalization
 * Formula: 100 × (x - min) / (max - min)
 */
export function normalizeLinear(value: number, maxValue: number = 5, minValue: number = 1): number {
  if (maxValue === minValue) return 0;
  
  const score = 100 * (value - minValue) / (maxValue - minValue);
  return Math.min(100, Math.max(0, score));
}

/**
 * Binary normalization
 * Formula: x × 100
 */
export function normalizeBinary(value: number): number {
  return value === 1 ? 100 : 0;
}

/**
 * Normalize a value based on indicator metadata
 */
export function normalizeValue(value: number, indicator: CompleteIndicator): number {
  switch (indicator.normalization) {
    case 'logarithmic':
      return normalizeLogarithmic(value, indicator.maxValue || 100, indicator.minValue);
    case 'linear':
      return normalizeLinear(value, indicator.maxValue || 5, indicator.minValue);
    case 'binary':
      return normalizeBinary(value);
    default:
      return value;
  }
}

// ============================================================
// SCORE CALCULATION FUNCTIONS
// ============================================================

/**
 * Calculate subdimension score from indicator values
 */
export function calculateSubdimensionScore(
  subdimension: string,
  indicatorValues: Map<string, number>
): SubdimensionScore {
  const indicators = COMPLETE_INDICATORS.filter(ind => ind.subdimension === subdimension);
  
  if (indicators.length === 0) {
    return {
      code: subdimension,
      name: subdimension,
      score: 0,
      indicatorCount: 0,
      indicators: []
    };
  }
  
  let weightedSum = 0;
  let totalWeight = 0;
  const indicatorResults: { code: string; score: number; weight: number }[] = [];
  
  for (const indicator of indicators) {
    const rawValue = indicatorValues.get(indicator.code);
    if (rawValue !== undefined) {
      const normalizedScore = normalizeValue(rawValue, indicator);
      weightedSum += normalizedScore * indicator.weight;
      totalWeight += indicator.weight;
      indicatorResults.push({
        code: indicator.code,
        score: normalizedScore,
        weight: indicator.weight
      });
    }
  }
  
  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  return {
    code: subdimension,
    name: subdimension,
    score: Math.min(100, Math.max(0, score)),
    indicatorCount: indicatorResults.length,
    indicators: indicatorResults
  };
}

/**
 * Calculate dimension score from subdimension scores
 */
export function calculateDimensionScore(
  dimension: string,
  indicatorValues: Map<string, number>
): DimensionScore {
  const indicators = COMPLETE_INDICATORS.filter(ind => ind.dimension === dimension);
  const subdimensions = Array.from(new Set(indicators.map(ind => ind.subdimension)));
  
  const subdimensionResults: SubdimensionScore[] = [];
  let totalScore = 0;
  let count = 0;
  
  for (const subdim of subdimensions) {
    const result = calculateSubdimensionScore(subdim, indicatorValues);
    if (result.indicatorCount > 0) {
      subdimensionResults.push(result);
      totalScore += result.score;
      count++;
    }
  }
  
  const score = count > 0 ? totalScore / count : 0;
  const weight = DIMENSION_WEIGHTS[dimension as keyof typeof DIMENSION_WEIGHTS] || 0;
  
  // Get dimension name from first indicator
  const firstIndicator = indicators[0];
  const dimensionName = getDimensionName(dimension);
  
  return {
    code: dimension,
    name: dimensionName,
    score: Math.min(100, Math.max(0, score)),
    weight,
    subdimensions: subdimensionResults
  };
}

/**
 * Get dimension name by code
 */
function getDimensionName(code: string): string {
  const names: Record<string, string> = {
    D1: 'Akademik Etki',
    D2: 'Toplumsal ve Pratik Etki',
    D3: 'Negatif Etki ve Risk',
    D4: 'Etik ve Sorumluluk',
    D5: 'Ekonomik Etki',
    D6: 'Sağlık Etkisi',
    D7: 'Çevresel Etki',
    D8: 'Politik ve Yasal Etki',
    D9: 'Teknolojik Etki',
    D10: 'Sosyal ve Kültürel Etki',
    D11: 'Eğitim Etkisi',
    D12: 'Dijital ve Medya Etkisi',
    D13: 'Güvenlik ve Savunma Etkisi',
    D14: 'Psikolojik ve Refah Etkisi',
    D15: 'Uluslararası İşbirliği',
    D16: 'Zaman ve Zincirleme Etki'
  };
  return names[code] || code;
}

// ============================================================
// HIS CALCULATION
// ============================================================

/**
 * Calculate HIS for Quick Mode (4 dimensions)
 * 
 * Formula:
 * RIS = (W_A × D1) + (W_S × D2)
 * M_E = (D4 / 100)^k_E
 * M_N = (1 - D3/100)^k_N
 * HIS = RIS × M_E × M_N
 */
export function calculateHISQuickMode(
  D1: number,
  D2: number,
  D3: number,
  D4: number
): { his: number; ris: number; mE: number; mN: number; formulas: FormulaUsed[] } {
  const W_A = 0.35;  // Academic weight
  const W_S = 0.40;  // Social weight
  const k_E = 2.0;   // Ethics sensitivity
  const k_N = 1.5;   // Negative impact sensitivity
  
  // Raw Impact Score
  const RIS = (W_A * D1) + (W_S * D2);
  
  // Ethics Multiplier
  const M_E = Math.pow(D4 / 100, k_E);
  
  // Negative Impact Multiplier
  const M_N = Math.pow(1 - D3 / 100, k_N);
  
  // Final HIS
  const HIS = RIS * M_E * M_N;
  
  const formulas: FormulaUsed[] = [
    {
      name: 'Raw Impact Score (RIS)',
      formula: 'RIS = (W_A × D1) + (W_S × D2)',
      inputs: { W_A, D1, W_S, D2 },
      output: RIS
    },
    {
      name: 'Ethics Multiplier (M_E)',
      formula: 'M_E = (D4 / 100)^k_E',
      inputs: { D4, k_E },
      output: M_E
    },
    {
      name: 'Negative Impact Multiplier (M_N)',
      formula: 'M_N = (1 - D3/100)^k_N',
      inputs: { D3, k_N },
      output: M_N
    },
    {
      name: 'Holistic Impact Score (HIS)',
      formula: 'HIS = RIS × M_E × M_N',
      inputs: { RIS, M_E, M_N },
      output: HIS
    }
  ];
  
  return {
    his: Math.min(100, Math.max(0, HIS)),
    ris: RIS,
    mE: M_E,
    mN: M_N,
    formulas
  };
}

/**
 * Calculate HIS for Comprehensive Mode (16 dimensions)
 * 
 * Formula:
 * BaseHIS = Σ(Wi × Di) for i=1 to 16, where D3 is inverted
 * FinalHIS = BaseHIS × CascadeMultiplier
 */
export function calculateHISComprehensiveMode(
  dimensionScores: Record<string, number>,
  cascadeMultiplier: number = 1.0
): { his: number; baseHis: number; formulas: FormulaUsed[] } {
  let weightedSum = 0;
  let totalWeight = 0;
  const inputs: Record<string, number> = {};
  
  for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    const score = dimensionScores[dim];
    if (score !== undefined) {
      // D3 (Negative Impact) is inverted - higher score means worse
      const adjustedScore = dim === 'D3' ? (100 - score) : score;
      weightedSum += adjustedScore * weight;
      totalWeight += weight;
      inputs[`${dim}_score`] = score;
      inputs[`${dim}_weight`] = weight;
    }
  }
  
  const baseHis = totalWeight > 0 ? weightedSum : 0;
  const finalHis = baseHis * cascadeMultiplier;
  
  const formulas: FormulaUsed[] = [
    {
      name: 'Base HIS (Weighted Sum)',
      formula: 'BaseHIS = Σ(Wi × Di) for i=1 to 16, D3 inverted',
      inputs,
      output: baseHis
    },
    {
      name: 'Final HIS (with Cascade)',
      formula: 'FinalHIS = BaseHIS × CascadeMultiplier',
      inputs: { baseHis, cascadeMultiplier },
      output: finalHis
    }
  ];
  
  return {
    his: Math.min(100, Math.max(0, finalHis)),
    baseHis,
    formulas
  };
}

// ============================================================
// CASCADE EFFECT CALCULATION
// ============================================================

/**
 * Calculate 5-level cascade effects
 * 
 * Formula:
 * Effect_n = BaseScore × (0.85)^(n-1)
 * Cumulative_n = Σ Effect_i for i=1 to n
 */
export function calculate5LevelCascade(baseScore: number): CascadeLevelResult[] {
  const decayRate = 0.85;
  const levelNames = ['Birincil', 'İkincil', 'Üçüncül', 'Dördüncül', 'Beşincil'];
  const results: CascadeLevelResult[] = [];
  let cumulative = 0;
  
  for (let level = 1; level <= 5; level++) {
    const decayFactor = Math.pow(decayRate, level - 1);
    const effect = baseScore * decayFactor;
    cumulative += effect;
    
    // Count indicators at this cascade level
    const indicatorCount = COMPLETE_INDICATORS.filter(
      ind => ind.cascadeLevel === level
    ).length;
    
    results.push({
      level,
      name: levelNames[level - 1],
      decayFactor: Math.round(decayFactor * 10000) / 10000,
      effect: Math.round(effect * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
      indicatorCount
    });
  }
  
  return results;
}

// ============================================================
// MULTIPLIER CALCULATIONS
// ============================================================

/**
 * Calculate economic multiplier
 * Range: 1.5x - 5.0x
 * Formula: 1.5 + (D5 / 100) × 3.5
 */
export function calculateEconomicMultiplier(D5: number): number {
  const multiplier = 1.5 + (D5 / 100) * 3.5;
  return Math.min(5.0, Math.max(1.5, multiplier));
}

/**
 * Calculate social multiplier
 * Range: 2.0x - 10.0x
 * Formula: 2.0 + ((D2 + D10) / 200) × 8.0
 */
export function calculateSocialMultiplier(D2: number, D10: number): number {
  const avg = (D2 + D10) / 2;
  const multiplier = 2.0 + (avg / 100) * 8.0;
  return Math.min(10.0, Math.max(2.0, multiplier));
}

/**
 * Calculate scientific multiplier (logarithmic)
 * Range: 10x - 1000x
 * Formula: 10 × 10^((D1 + D9) / 200 × 2)
 */
export function calculateScientificMultiplier(D1: number, D9: number): number {
  const avg = (D1 + D9) / 2;
  const multiplier = 10 * Math.pow(10, (avg / 100) * 2);
  return Math.min(1000, Math.max(10, multiplier));
}

/**
 * Calculate environmental multiplier
 * Range: 1.5x - 4.0x
 * Formula: 1.5 + (D7 / 100) × 2.5
 */
export function calculateEnvironmentalMultiplier(D7: number): number {
  const multiplier = 1.5 + (D7 / 100) * 2.5;
  return Math.min(4.0, Math.max(1.5, multiplier));
}

/**
 * Calculate network effect score using Metcalfe's Law
 * Formula: ((avg(D9, D12, D15) / 100)^1.5) × 100
 */
export function calculateNetworkEffect(D9: number, D12: number, D15: number): number {
  const avg = (D9 + D12 + D15) / 3;
  const networkScore = Math.pow(avg / 100, 1.5) * 100;
  return Math.min(100, Math.max(0, networkScore));
}

/**
 * Calculate total cascade multiplier from all multipliers
 * Cap at 10x maximum
 */
export function calculateTotalCascadeMultiplier(
  dimensionScores: Record<string, number>
): MultiplierResults {
  const D1 = dimensionScores.D1 || 0;
  const D2 = dimensionScores.D2 || 0;
  const D5 = dimensionScores.D5 || 0;
  const D7 = dimensionScores.D7 || 0;
  const D9 = dimensionScores.D9 || 0;
  const D10 = dimensionScores.D10 || 0;
  const D12 = dimensionScores.D12 || 0;
  const D15 = dimensionScores.D15 || 0;
  
  const economic = calculateEconomicMultiplier(D5);
  const social = calculateSocialMultiplier(D2, D10);
  const scientific = calculateScientificMultiplier(D1, D9);
  const environmental = calculateEnvironmentalMultiplier(D7);
  const networkEffect = calculateNetworkEffect(D9, D12, D15);
  
  // Weighted combination of multipliers
  // Scientific is capped at 100 for the combination
  const total = (
    (economic * 0.25) +
    (social * 0.25) +
    (Math.min(scientific, 100) * 0.01) +
    (environmental * 0.15) +
    ((1 + networkEffect / 100) * 0.34)
  );
  
  return {
    economic: Math.round(economic * 100) / 100,
    social: Math.round(social * 100) / 100,
    scientific: Math.round(scientific * 100) / 100,
    environmental: Math.round(environmental * 100) / 100,
    networkEffect: Math.round(networkEffect * 100) / 100,
    total: Math.min(10.0, Math.round(total * 100) / 100)
  };
}

// ============================================================
// FULL EVALUATION FUNCTION
// ============================================================

/**
 * Perform complete HIS evaluation
 */
export function performFullEvaluation(
  indicatorValues: Map<string, number>,
  mode: 'quick' | 'comprehensive' = 'comprehensive'
): HISCalculationResult {
  const warnings: string[] = [];
  const formulasUsed: FormulaUsed[] = [];
  
  // Calculate dimension scores
  const dimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 
                      'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16'];
  
  const dimensionResults: DimensionScore[] = [];
  const dimensionScores: Record<string, number> = {};
  
  for (const dim of dimensions) {
    const result = calculateDimensionScore(dim, indicatorValues);
    dimensionResults.push(result);
    dimensionScores[dim] = result.score;
  }
  
  // Calculate multipliers
  const multipliers = calculateTotalCascadeMultiplier(dimensionScores);
  
  // Calculate cascade levels
  const avgScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 
                   Object.values(dimensionScores).length;
  const cascadeLevels = calculate5LevelCascade(avgScore);
  
  // Calculate HIS based on mode
  let baseHIS: number;
  let finalHIS: number;
  let cascadeMultiplier: number;
  
  if (mode === 'quick') {
    const quickResult = calculateHISQuickMode(
      dimensionScores.D1 || 0,
      dimensionScores.D2 || 0,
      dimensionScores.D3 || 0,
      dimensionScores.D4 || 0
    );
    baseHIS = quickResult.his;
    finalHIS = quickResult.his;
    cascadeMultiplier = 1.0;
    formulasUsed.push(...quickResult.formulas);
  } else {
    const compResult = calculateHISComprehensiveMode(dimensionScores, multipliers.total);
    baseHIS = compResult.baseHis;
    finalHIS = compResult.his;
    cascadeMultiplier = multipliers.total;
    formulasUsed.push(...compResult.formulas);
  }
  
  // Data quality metrics
  const totalIndicators = COMPLETE_INDICATORS.length;
  const filledIndicators = indicatorValues.size;
  const coveragePercent = (filledIndicators / totalIndicators) * 100;
  
  // Count by data source type
  let apiDataCount = 0;
  let manualDataCount = 0;
  let expertDataCount = 0;
  
  indicatorValues.forEach((_, code) => {
    const indicator = COMPLETE_INDICATORS.find(ind => ind.code === code);
    if (indicator) {
      if (indicator.evaluator === 'api') apiDataCount++;
      else if (indicator.evaluator === 'researcher') manualDataCount++;
      else expertDataCount++;
    }
  });
  
  // Validation
  let validationStatus: 'valid' | 'warning' | 'invalid' = 'valid';
  
  if (finalHIS < 0 || finalHIS > 100) {
    validationStatus = 'invalid';
    warnings.push('HIS değeri geçersiz aralıkta (0-100 dışında)');
  }
  
  if (coveragePercent < 20) {
    validationStatus = 'warning';
    warnings.push(`Veri kapsama oranı düşük: ${coveragePercent.toFixed(1)}%`);
  }
  
  if (mode === 'comprehensive' && !dimensionScores.D5 && !dimensionScores.D6) {
    warnings.push('Kapsamlı mod için D5-D16 boyutları önerilir');
  }
  
  return {
    mode,
    baseHIS: Math.round(baseHIS * 100) / 100,
    finalHIS: Math.round(finalHIS * 100) / 100,
    cascadeMultiplier: Math.round(cascadeMultiplier * 100) / 100,
    dimensionScores: dimensionResults,
    cascadeLevels,
    multipliers,
    validationStatus,
    warnings,
    calculationDetails: {
      totalIndicators,
      filledIndicators,
      coveragePercent: Math.round(coveragePercent * 10) / 10,
      formulasUsed,
      dataQuality: {
        apiDataCount,
        manualDataCount,
        expertDataCount,
        missingDataCount: totalIndicators - filledIndicators,
        outlierCount: 0 // Would need outlier detection
      }
    }
  };
}

// ============================================================
// REPORT GENERATION
// ============================================================

/**
 * Generate detailed calculation report
 */
export function generateCalculationReport(result: HISCalculationResult): string {
  const lines: string[] = [];
  
  lines.push('# HIS Hesaplama Raporu');
  lines.push('');
  lines.push(`**Mod:** ${result.mode === 'quick' ? 'Hızlı (4 Boyut)' : 'Kapsamlı (16 Boyut)'}`);
  lines.push(`**Doğrulama Durumu:** ${result.validationStatus}`);
  lines.push('');
  
  lines.push('## Özet Sonuçlar');
  lines.push('');
  lines.push(`| Metrik | Değer |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Base HIS | ${result.baseHIS} |`);
  lines.push(`| Cascade Çarpanı | ${result.cascadeMultiplier}x |`);
  lines.push(`| **Final HIS** | **${result.finalHIS}** |`);
  lines.push('');
  
  lines.push('## Boyut Skorları');
  lines.push('');
  lines.push('| Boyut | Ad | Skor | Ağırlık |');
  lines.push('|-------|-----|------|---------|');
  for (const dim of result.dimensionScores) {
    if (dim.score > 0 || dim.subdimensions.length > 0) {
      lines.push(`| ${dim.code} | ${dim.name} | ${dim.score.toFixed(1)} | ${(dim.weight * 100).toFixed(0)}% |`);
    }
  }
  lines.push('');
  
  if (result.mode === 'comprehensive') {
    lines.push('## Çarpan Katsayıları');
    lines.push('');
    lines.push('| Çarpan Türü | Değer | Aralık |');
    lines.push('|-------------|-------|--------|');
    lines.push(`| Ekonomik | ${result.multipliers.economic}x | 1.5-5.0x |`);
    lines.push(`| Sosyal | ${result.multipliers.social}x | 2.0-10.0x |`);
    lines.push(`| Bilimsel | ${result.multipliers.scientific}x | 10-1000x |`);
    lines.push(`| Çevresel | ${result.multipliers.environmental}x | 1.5-4.0x |`);
    lines.push(`| Ağ Etkisi | ${result.multipliers.networkEffect} | 0-100 |`);
    lines.push(`| **Toplam** | **${result.multipliers.total}x** | max 10x |`);
    lines.push('');
    
    lines.push('## Zincirleme Etki Seviyeleri');
    lines.push('');
    lines.push('| Seviye | Ad | Decay | Etki | Kümülatif |');
    lines.push('|--------|-----|-------|------|-----------|');
    for (const level of result.cascadeLevels) {
      lines.push(`| ${level.level} | ${level.name} | ${level.decayFactor} | ${level.effect} | ${level.cumulative} |`);
    }
    lines.push('');
  }
  
  lines.push('## Hesaplama Detayları');
  lines.push('');
  lines.push(`- Toplam Gösterge: ${result.calculationDetails.totalIndicators}`);
  lines.push(`- Doldurulan Gösterge: ${result.calculationDetails.filledIndicators}`);
  lines.push(`- Kapsama Oranı: ${result.calculationDetails.coveragePercent}%`);
  lines.push('');
  
  lines.push('### Kullanılan Formüller');
  lines.push('');
  for (const formula of result.calculationDetails.formulasUsed) {
    lines.push(`**${formula.name}**`);
    lines.push(`\`${formula.formula}\``);
    lines.push(`Çıktı: ${formula.output.toFixed(4)}`);
    lines.push('');
  }
  
  if (result.warnings.length > 0) {
    lines.push('## Uyarılar');
    lines.push('');
    for (const warning of result.warnings) {
      lines.push(`- ⚠️ ${warning}`);
    }
  }
  
  return lines.join('\n');
}
