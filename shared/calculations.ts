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
 * Uses the exponential penalty model for robustness
 * 
 * @param scoreD1 - Academic Impact score (0-100)
 * @param scoreD2 - Social & Practical Impact score (0-100)
 * @param scoreD3 - Negative Impact & Risk score (0-100)
 * @param scoreD4 - Ethics & Responsibility score (0-100)
 * @returns Holistic Impact Score (0-100)
 */
export function calculateHIS(
  scoreD1: number,
  scoreD2: number,
  scoreD3: number,
  scoreD4: number
): number {
  // Weights (Keep in sync with server/hisCalculator.ts)
  const W_A = 0.35; // Academic
  const W_S = 0.40; // Social
  const W_N = 0.15; // Negative (penalty weight)
  const W_E = 0.10; // Ethics (penalty weight)

  // Sensitivity coefficients
  const k_E = 2.0;   // Ethics sensitivity
  const k_N = 1.5;   // Negative impact sensitivity

  // Base score (positive dimensions)
  const baseScore = (scoreD1 * W_A) + (scoreD2 * W_S);

  // Penalties (exponential)
  const ethicsPenalty = W_E * (1 - Math.exp(-k_E * (100 - scoreD4) / 100));
  const negativePenalty = W_N * (1 - Math.exp(-k_N * scoreD3 / 100));

  // Final HIS (Penalty acts as a reduction factor on 1.0)
  const HIS = baseScore * (1 - ethicsPenalty - negativePenalty);

  return Math.min(100, Math.max(0, HIS));
}

/**
 * Robust date parser for SQLite/tRPC timestamps
 */
export function parseDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === "number") {
    // If it looks like seconds (10 digits), convert to ms
    if (val < 10000000000) return new Date(val * 1000);
    return new Date(val);
  }
  if (typeof val === "string") {
    // If it's a numeric string
    if (!isNaN(Number(val))) return parseDate(Number(val));
    return new Date(val);
  }
  return new Date(val);
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
