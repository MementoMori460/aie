/**
 * Calculation utilities for the Academic Impact Evaluation System
 * Implements normalization functions and score calculations
 */

import { WEIGHTS } from "./indicators";

/**
 * Logarithmic normalization for quantitative indicators
 * Used for citation counts, patent counts, etc. where distribution is skewed
 * 
 * @param value - Raw value
 * @param maxValue - Maximum value in the comparison set (typically 99th percentile)
 * @returns Normalized score (0-100)
 */
export function logarithmicNormalization(value: number, maxValue: number): number {
  if (value <= 0) return 0;
  if (maxValue <= 0) return 0;
  
  const score = 100 * (Math.log(1 + value) / Math.log(1 + maxValue));
  return Math.min(100, Math.max(0, score));
}

/**
 * Linear normalization for qualitative indicators (Likert scale 1-5)
 * 
 * @param value - Raw value (1-5)
 * @param minValue - Minimum value (default: 1)
 * @param maxValue - Maximum value (default: 5)
 * @returns Normalized score (0-100)
 */
export function linearNormalization(value: number, minValue: number = 1, maxValue: number = 5): number {
  if (maxValue === minValue) return 0;
  
  const score = ((value - minValue) / (maxValue - minValue)) * 100;
  return Math.min(100, Math.max(0, score));
}

/**
 * Binary normalization for yes/no indicators
 * 
 * @param value - Binary value (0 or 1)
 * @returns Normalized score (0 or 100)
 */
export function binaryNormalization(value: number): number {
  return value === 1 ? 100 : 0;
}

/**
 * Calculate sub-dimension score from indicator scores
 * 
 * @param indicatorScores - Array of normalized indicator scores
 * @param weights - Array of weights for each indicator (should sum to 1)
 * @returns Sub-dimension score (0-100)
 */
export function calculateSubDimensionScore(
  indicatorScores: number[],
  weights?: number[]
): number {
  if (indicatorScores.length === 0) return 0;
  
  // If no weights provided, use equal weights
  const w = weights || indicatorScores.map(() => 1 / indicatorScores.length);
  
  // Weighted average
  const score = indicatorScores.reduce((sum, score, i) => sum + score * w[i], 0);
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate dimension score from sub-dimension scores
 * 
 * @param subDimensionScores - Array of sub-dimension scores
 * @param weights - Array of weights for each sub-dimension (should sum to 1)
 * @returns Dimension score (0-100)
 */
export function calculateDimensionScore(
  subDimensionScores: number[],
  weights: number[]
): number {
  if (subDimensionScores.length === 0) return 0;
  
  // Weighted average
  const score = subDimensionScores.reduce((sum, score, i) => sum + score * weights[i], 0);
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate Holistic Impact Score (HIS) from dimension scores
 * 
 * Formula:
 * RIS = (W_A * D1) + (W_S * D2)
 * M_E = (D4 / 100) ^ k_E
 * M_N = (1 - (D3 / 100)) ^ k_N
 * HIS = RIS * M_E * M_N
 * 
 * @param scoreD1 - Academic Impact score (0-100)
 * @param scoreD2 - Social & Practical Impact score (0-100)
 * @param scoreD3 - Negative Impact & Risk score (0-100, higher is worse)
 * @param scoreD4 - Ethics & Responsibility score (0-100)
 * @returns Holistic Impact Score (0-100)
 */
export function calculateHIS(
  scoreD1: number,
  scoreD2: number,
  scoreD3: number,
  scoreD4: number
): number {
  const { W_A, W_S } = WEIGHTS.dimensions;
  const { k_E, k_N } = WEIGHTS.sensitivityCoefficients;
  
  // Raw Impact Score (positive impacts only)
  const RIS = (W_A * scoreD1) + (W_S * scoreD2);
  
  // Ethics Penalty Multiplier (low ethics = low multiplier)
  const M_E = Math.pow(scoreD4 / 100, k_E);
  
  // Negative Impact Penalty Multiplier (high negative impact = low multiplier)
  const M_N = Math.pow(1 - (scoreD3 / 100), k_N);
  
  // Final HIS
  const HIS = RIS * M_E * M_N;
  
  return Math.min(100, Math.max(0, HIS));
}

/**
 * Parse raw value based on indicator type
 * 
 * @param rawValue - Raw value as string
 * @param type - Indicator type
 * @returns Parsed number value
 */
export function parseRawValue(rawValue: string | undefined, type: string): number {
  if (!rawValue) return 0;
  
  const parsed = parseFloat(rawValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalize indicator value based on type
 * 
 * @param rawValue - Raw value
 * @param normalizationType - Type of normalization
 * @param maxValue - Maximum value for logarithmic normalization
 * @returns Normalized score (0-100)
 */
export function normalizeIndicator(
  rawValue: number,
  normalizationType: "logarithmic" | "linear" | "binary",
  maxValue?: number
): number {
  switch (normalizationType) {
    case "logarithmic":
      return logarithmicNormalization(rawValue, maxValue || 1000);
    case "linear":
      return linearNormalization(rawValue);
    case "binary":
      return binaryNormalization(rawValue);
    default:
      return 0;
  }
}
