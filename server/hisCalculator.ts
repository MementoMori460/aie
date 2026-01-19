/**
 * Holistic Impact Score (HIS) Calculator
 * Calculates the overall impact score based on dimension scores and cascade effects
 */

import { COMPREHENSIVE_DIMENSIONS } from "../shared/comprehensiveDimensions";

export interface DimensionScores {
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
  D16?: number;
}

export interface CascadeMetrics {
  cascadeMultiplier: number;
  economicMultiplier: number;
  socialMultiplier: number;
  scientificMultiplier: number;
  environmentalMultiplier: number;
  networkEffectScore: number;
}

/**
 * Calculate HIS for Quick Mode (4 dimensions)
 * Uses original formula with penalties for negative and ethics dimensions
 */
export function calculateHISQuickMode(scores: DimensionScores): number {
  const D1 = scores.D1 || 0;
  const D2 = scores.D2 || 0;
  const D3 = scores.D3 || 0; // Negative impact (penalty)
  const D4 = scores.D4 || 0; // Ethics (penalty)

  // Weights from indicators.ts
  const W_A = 0.35; // Academic
  const W_S = 0.40; // Social
  const W_N = 0.15; // Negative (penalty weight)
  const W_E = 0.10; // Ethics (penalty weight)

  // Sensitivity coefficients
  const k_E = 2.0;   // Ethics sensitivity
  const k_N = 1.5;   // Negative impact sensitivity

  // Base score (positive dimensions)
  const baseScore = (D1 * W_A) + (D2 * W_S);

  // Penalties (exponential)
  const ethicsPenalty = W_E * (1 - Math.exp(-k_E * (100 - D4) / 100));
  const negativePenalty = W_N * (1 - Math.exp(-k_N * D3 / 100));

  // Final HIS
  const HIS = baseScore * (1 - ethicsPenalty - negativePenalty);

  return Math.max(0, Math.min(100, HIS));
}

/**
 * Calculate HIS for Comprehensive Mode (16 dimensions)
 * Uses weighted sum with cascade multiplier
 */
export function calculateHISComprehensiveMode(
  scores: DimensionScores,
  cascadeMetrics?: CascadeMetrics
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  // Calculate weighted sum for all dimensions
  for (const dimension of COMPREHENSIVE_DIMENSIONS) {
    const score = scores[dimension.code as keyof DimensionScores] || 0;
    const weight = dimension.weight;

    // D3 (Negative Impact) is inverted - higher score means worse
    if (dimension.code === "D3") {
      weightedSum += (100 - score) * weight;
    } else {
      weightedSum += score * weight;
    }

    totalWeight += weight;
  }

  // Base HIS (0-100)
  let HIS = totalWeight > 0 ? weightedSum : 0;

  // Apply cascade multiplier if provided
  if (cascadeMetrics && cascadeMetrics.cascadeMultiplier > 1.0) {
    // Cascade multiplier amplifies the score
    // Formula: HIS_final = HIS_base * (1 + (multiplier - 1) * 0.5)
    // This ensures multiplier effect is significant but not overwhelming
    const amplificationFactor = 1 + (cascadeMetrics.cascadeMultiplier - 1) * 0.5;
    HIS = HIS * amplificationFactor;
  }

  return Math.max(0, Math.min(100, HIS));
}

/**
 * Calculate HIS based on evaluation mode
 */
export function calculateHIS(
  mode: "quick" | "comprehensive",
  scores: DimensionScores,
  cascadeMetrics?: CascadeMetrics
): number {
  if (mode === "quick") {
    return calculateHISQuickMode(scores);
  } else {
    return calculateHISComprehensiveMode(scores, cascadeMetrics);
  }
}

/**
 * Get dimension weights for a mode
 */
export function getDimensionWeights(mode: "quick" | "comprehensive"): Record<string, number> {
  if (mode === "quick") {
    return {
      D1: 0.35,
      D2: 0.40,
      D3: 0.15,
      D4: 0.10,
    };
  } else {
    const weights: Record<string, number> = {};
    for (const dimension of COMPREHENSIVE_DIMENSIONS) {
      weights[dimension.code] = dimension.weight;
    }
    return weights;
  }
}

/**
 * Validate dimension scores (0-100)
 */
export function validateDimensionScores(scores: DimensionScores): boolean {
  for (const [key, value] of Object.entries(scores)) {
    if (value !== undefined && (value < 0 || value > 100)) {
      console.error(`Invalid score for ${key}: ${value}. Must be between 0 and 100.`);
      return false;
    }
  }
  return true;
}
