import { calculateHISQuickMode, calculateHISComprehensiveMode, type DimensionScores, type CascadeMetrics } from "./server/hisCalculator";

/**
 * mRNA Vaccine Benchmark Case (from COMPLETE_SYSTEM_DOCUMENTATION.md)
 * 
 * Target Parameters:
 * D1 (Academic): 95
 * D2 (Social): 92
 * D3 (Negative): 15
 * D4 (Ethics): 98
 * 
 * Multipliers:
 * Economic: 4.8x
 * Social: 9.2x
 * Scientific: 850x
 * Environmental: 2.1x
 * Network Effect: 92
 */

const mRNAScores: DimensionScores = {
  D1: 95,
  D2: 92,
  D3: 15,
  D4: 98,
  D5: 88, // Economic
  D6: 96, // Health
  D7: 45, // Environmental
  D8: 72, // Policy
  D9: 94, // Tech
  D10: 82, // Social & Cultural
  D11: 65, // Education
  D12: 88, // Digital
  D13: 42, // Security
  D14: 78, // Psychological
  D15: 90, // Intl Collaboration
  D16: 0   // Chain Effects (Calculated automatically)
};

const mRNACascade: CascadeMetrics = {
  cascadeMultiplier: 8.52,
  economicMultiplier: 4.8,
  socialMultiplier: 9.2,
  scientificMultiplier: 850,
  environmentalMultiplier: 2.1,
  networkEffectScore: 92
};

function testmRNAQuickMode() {
  console.log("--- Testing mRNA Quick Mode ---");
  const his = calculateHISQuickMode(mRNAScores);
  console.log(`Calculated HIS: ${his.toFixed(2)}`);
  // Expected roughly: (95*0.35 + 92*0.40) * (1 - penalties)
  // Base = 33.25 + 36.8 = 70.05
}

function testmRNAComprehensiveMode() {
  console.log("\n--- Testing mRNA Comprehensive Mode ---");
  const his = calculateHISComprehensiveMode(mRNAScores, mRNACascade);
  console.log(`Calculated HIS: ${his.toFixed(2)}`);
}

testmRNAQuickMode();
testmRNAComprehensiveMode();
