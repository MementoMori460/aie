/**
 * Consistency and Anomaly Check Script
 * 
 * This script validates:
 * 1. Indicator definitions consistency
 * 2. Weight sum validation
 * 3. Formula correctness
 * 4. Data type consistency
 * 5. Range validation
 * 6. Cross-reference integrity
 */

import { 
  COMPLETE_INDICATORS, 
  DIMENSION_WEIGHTS,
  EVALUATION_PANELS,
  getTotalIndicatorCount,
  countIndicatorsByDimension,
  type CompleteIndicator
} from '../shared/completeIndicatorSystem';

import {
  normalizeLogarithmic,
  normalizeLinear,
  normalizeBinary,
  calculateEconomicMultiplier,
  calculateSocialMultiplier,
  calculateScientificMultiplier,
  calculateEnvironmentalMultiplier,
  calculateNetworkEffect
} from '../shared/completeCalculationEngine';

// ============================================================
// TEST RESULTS TRACKING
// ============================================================

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string[];
}

const testResults: TestResult[] = [];

function addTest(name: string, passed: boolean, message: string, details?: string[]) {
  testResults.push({ name, passed, message, details });
}

// ============================================================
// TEST 1: DIMENSION WEIGHT VALIDATION
// ============================================================

function testDimensionWeights() {
  console.log('\n📊 Test 1: Boyut Ağırlıkları Doğrulama');
  console.log('-'.repeat(50));
  
  const weights = Object.values(DIMENSION_WEIGHTS);
  const sum = weights.reduce((a, b) => a + b, 0);
  
  const passed = Math.abs(sum - 1.0) < 0.001;
  
  console.log(`Toplam Ağırlık: ${sum.toFixed(4)}`);
  console.log(`Beklenen: 1.0000`);
  console.log(`Sonuç: ${passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  addTest('Boyut Ağırlıkları Toplamı', passed, 
    passed ? 'Ağırlıklar toplamı 1.0' : `Ağırlıklar toplamı ${sum.toFixed(4)}, 1.0 olmalı`);
  
  return passed;
}

// ============================================================
// TEST 2: INDICATOR COUNT VALIDATION
// ============================================================

function testIndicatorCounts() {
  console.log('\n📊 Test 2: Gösterge Sayısı Doğrulama');
  console.log('-'.repeat(50));
  
  const total = getTotalIndicatorCount();
  const byDimension = countIndicatorsByDimension();
  const sumByDimension = Object.values(byDimension).reduce((a, b) => a + b, 0);
  
  console.log(`Toplam Gösterge: ${total}`);
  console.log(`Boyut Bazlı Toplam: ${sumByDimension}`);
  
  const countMatch = total === sumByDimension;
  console.log(`Sayı Tutarlılığı: ${countMatch ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  // Check each dimension has indicators
  const emptyDimensions = Object.entries(byDimension)
    .filter(([_, count]) => count === 0)
    .map(([dim]) => dim);
  
  const allDimensionsHaveIndicators = emptyDimensions.length === 0;
  console.log(`Tüm Boyutlarda Gösterge: ${allDimensionsHaveIndicators ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  if (emptyDimensions.length > 0) {
    console.log(`Boş Boyutlar: ${emptyDimensions.join(', ')}`);
  }
  
  addTest('Gösterge Sayısı Tutarlılığı', countMatch && allDimensionsHaveIndicators,
    `${total} gösterge, ${Object.keys(byDimension).length} boyut`);
  
  return countMatch && allDimensionsHaveIndicators;
}

// ============================================================
// TEST 3: INDICATOR CODE UNIQUENESS
// ============================================================

function testIndicatorCodeUniqueness() {
  console.log('\n📊 Test 3: Gösterge Kodu Benzersizliği');
  console.log('-'.repeat(50));
  
  const codes = COMPLETE_INDICATORS.map(ind => ind.code);
  const uniqueCodes = new Set(codes);
  
  const passed = codes.length === uniqueCodes.size;
  
  console.log(`Toplam Kod: ${codes.length}`);
  console.log(`Benzersiz Kod: ${uniqueCodes.size}`);
  console.log(`Sonuç: ${passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  if (!passed) {
    const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);
    console.log(`Tekrarlanan Kodlar: ${duplicates.join(', ')}`);
  }
  
  addTest('Gösterge Kodu Benzersizliği', passed,
    passed ? 'Tüm kodlar benzersiz' : 'Tekrarlanan kodlar var');
  
  return passed;
}

// ============================================================
// TEST 4: NORMALIZATION FUNCTION VALIDATION
// ============================================================

function testNormalizationFunctions() {
  console.log('\n📊 Test 4: Normalizasyon Fonksiyonları Doğrulama');
  console.log('-'.repeat(50));
  
  const tests: { name: string; passed: boolean; expected: number; actual: number }[] = [];
  
  // Logarithmic tests
  const log1 = normalizeLogarithmic(0, 1000);
  tests.push({ name: 'Log(0, max=1000)', passed: log1 === 0, expected: 0, actual: log1 });
  
  const log2 = normalizeLogarithmic(1000, 1000);
  tests.push({ name: 'Log(1000, max=1000)', passed: log2 === 100, expected: 100, actual: log2 });
  
  const log3 = normalizeLogarithmic(100, 1000);
  const log3Expected = 100 * (Math.log(101) / Math.log(1001));
  tests.push({ name: 'Log(100, max=1000)', passed: Math.abs(log3 - log3Expected) < 0.01, expected: log3Expected, actual: log3 });
  
  // Linear tests
  const lin1 = normalizeLinear(1, 5, 1);
  tests.push({ name: 'Linear(1, max=5, min=1)', passed: lin1 === 0, expected: 0, actual: lin1 });
  
  const lin2 = normalizeLinear(5, 5, 1);
  tests.push({ name: 'Linear(5, max=5, min=1)', passed: lin2 === 100, expected: 100, actual: lin2 });
  
  const lin3 = normalizeLinear(3, 5, 1);
  tests.push({ name: 'Linear(3, max=5, min=1)', passed: lin3 === 50, expected: 50, actual: lin3 });
  
  // Binary tests
  const bin1 = normalizeBinary(0);
  tests.push({ name: 'Binary(0)', passed: bin1 === 0, expected: 0, actual: bin1 });
  
  const bin2 = normalizeBinary(1);
  tests.push({ name: 'Binary(1)', passed: bin2 === 100, expected: 100, actual: bin2 });
  
  let allPassed = true;
  for (const test of tests) {
    console.log(`${test.name}: ${test.passed ? '✅' : '❌'} (beklenen: ${test.expected.toFixed(2)}, gerçek: ${test.actual.toFixed(2)})`);
    if (!test.passed) allPassed = false;
  }
  
  addTest('Normalizasyon Fonksiyonları', allPassed,
    allPassed ? 'Tüm normalizasyon testleri başarılı' : 'Bazı testler başarısız');
  
  return allPassed;
}

// ============================================================
// TEST 5: MULTIPLIER RANGE VALIDATION
// ============================================================

function testMultiplierRanges() {
  console.log('\n📊 Test 5: Çarpan Katsayısı Aralık Doğrulama');
  console.log('-'.repeat(50));
  
  const tests: { name: string; passed: boolean; value: number; min: number; max: number }[] = [];
  
  // Economic multiplier (1.5 - 5.0)
  const econ0 = calculateEconomicMultiplier(0);
  const econ100 = calculateEconomicMultiplier(100);
  tests.push({ name: 'Ekonomik(0)', passed: econ0 === 1.5, value: econ0, min: 1.5, max: 5.0 });
  tests.push({ name: 'Ekonomik(100)', passed: econ100 === 5.0, value: econ100, min: 1.5, max: 5.0 });
  
  // Social multiplier (2.0 - 10.0)
  const soc0 = calculateSocialMultiplier(0, 0);
  const soc100 = calculateSocialMultiplier(100, 100);
  tests.push({ name: 'Sosyal(0,0)', passed: soc0 === 2.0, value: soc0, min: 2.0, max: 10.0 });
  tests.push({ name: 'Sosyal(100,100)', passed: soc100 === 10.0, value: soc100, min: 2.0, max: 10.0 });
  
  // Scientific multiplier (10 - 1000)
  const sci0 = calculateScientificMultiplier(0, 0);
  const sci100 = calculateScientificMultiplier(100, 100);
  tests.push({ name: 'Bilimsel(0,0)', passed: sci0 === 10, value: sci0, min: 10, max: 1000 });
  tests.push({ name: 'Bilimsel(100,100)', passed: sci100 === 1000, value: sci100, min: 10, max: 1000 });
  
  // Environmental multiplier (1.5 - 4.0)
  const env0 = calculateEnvironmentalMultiplier(0);
  const env100 = calculateEnvironmentalMultiplier(100);
  tests.push({ name: 'Çevresel(0)', passed: env0 === 1.5, value: env0, min: 1.5, max: 4.0 });
  tests.push({ name: 'Çevresel(100)', passed: env100 === 4.0, value: env100, min: 1.5, max: 4.0 });
  
  // Network effect (0 - 100)
  const net0 = calculateNetworkEffect(0, 0, 0);
  const net100 = calculateNetworkEffect(100, 100, 100);
  tests.push({ name: 'Ağ Etkisi(0,0,0)', passed: net0 === 0, value: net0, min: 0, max: 100 });
  tests.push({ name: 'Ağ Etkisi(100,100,100)', passed: net100 === 100, value: net100, min: 0, max: 100 });
  
  let allPassed = true;
  for (const test of tests) {
    console.log(`${test.name}: ${test.passed ? '✅' : '❌'} (değer: ${test.value.toFixed(2)}, aralık: ${test.min}-${test.max})`);
    if (!test.passed) allPassed = false;
  }
  
  addTest('Çarpan Katsayısı Aralıkları', allPassed,
    allPassed ? 'Tüm çarpanlar doğru aralıkta' : 'Bazı çarpanlar aralık dışında');
  
  return allPassed;
}

// ============================================================
// TEST 6: INDICATOR DATA TYPE CONSISTENCY
// ============================================================

function testIndicatorDataTypes() {
  console.log('\n📊 Test 6: Gösterge Veri Türü Tutarlılığı');
  console.log('-'.repeat(50));
  
  const validDataTypes = ['quantitative_auto', 'quantitative_manual', 'qualitative_expert', 'qualitative_researcher', 'binary'];
  const validNormalizations = ['logarithmic', 'linear', 'binary'];
  const validEvaluators = ['api', 'academic_panel', 'sector_panel', 'community_panel', 'ethics_board', 'environment_panel', 'researcher'];
  
  const issues: string[] = [];
  
  for (const ind of COMPLETE_INDICATORS) {
    // Check data type
    if (!validDataTypes.includes(ind.dataType)) {
      issues.push(`${ind.code}: Geçersiz veri türü '${ind.dataType}'`);
    }
    
    // Check normalization
    if (!validNormalizations.includes(ind.normalization)) {
      issues.push(`${ind.code}: Geçersiz normalizasyon '${ind.normalization}'`);
    }
    
    // Check evaluator
    if (!validEvaluators.includes(ind.evaluator)) {
      issues.push(`${ind.code}: Geçersiz değerlendirici '${ind.evaluator}'`);
    }
    
    // Check weight
    if (ind.weight < 0 || ind.weight > 1) {
      issues.push(`${ind.code}: Geçersiz ağırlık ${ind.weight}`);
    }
    
    // Check binary indicators have binary normalization
    if (ind.dataType === 'binary' && ind.normalization !== 'binary') {
      issues.push(`${ind.code}: Binary veri türü için binary normalizasyon gerekli`);
    }
    
    // Check Likert indicators have linear normalization
    if ((ind.dataType === 'qualitative_expert' || ind.dataType === 'qualitative_researcher') && ind.normalization !== 'linear') {
      issues.push(`${ind.code}: Likert veri türü için linear normalizasyon önerilir`);
    }
  }
  
  const passed = issues.length === 0;
  
  console.log(`Kontrol Edilen Gösterge: ${COMPLETE_INDICATORS.length}`);
  console.log(`Bulunan Sorun: ${issues.length}`);
  console.log(`Sonuç: ${passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  if (issues.length > 0) {
    console.log('\nSorunlar:');
    issues.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
    if (issues.length > 10) {
      console.log(`  ... ve ${issues.length - 10} sorun daha`);
    }
  }
  
  addTest('Gösterge Veri Türü Tutarlılığı', passed,
    passed ? 'Tüm göstergeler tutarlı' : `${issues.length} tutarsızlık bulundu`, issues);
  
  return passed;
}

// ============================================================
// TEST 7: EVALUATION PANEL VALIDATION
// ============================================================

function testEvaluationPanels() {
  console.log('\n📊 Test 7: Değerlendirme Paneli Doğrulama');
  console.log('-'.repeat(50));
  
  const issues: string[] = [];
  
  for (const panel of EVALUATION_PANELS) {
    // Check member count matches members array
    if (panel.memberCount !== panel.members.length) {
      issues.push(`${panel.id}: Üye sayısı uyuşmuyor (${panel.memberCount} vs ${panel.members.length})`);
    }
    
    // Check minimum agreement is valid
    if (panel.minimumAgreement < 0 || panel.minimumAgreement > 1) {
      issues.push(`${panel.id}: Geçersiz minimum uzlaşı oranı ${panel.minimumAgreement}`);
    }
    
    // Check each member has qualifications
    for (const member of panel.members) {
      if (member.qualifications.length === 0) {
        issues.push(`${panel.id}: ${member.role} için yeterlilik tanımlanmamış`);
      }
    }
  }
  
  const passed = issues.length === 0;
  
  console.log(`Kontrol Edilen Panel: ${EVALUATION_PANELS.length}`);
  console.log(`Bulunan Sorun: ${issues.length}`);
  console.log(`Sonuç: ${passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  if (issues.length > 0) {
    console.log('\nSorunlar:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  addTest('Değerlendirme Paneli Doğrulama', passed,
    passed ? 'Tüm paneller geçerli' : `${issues.length} sorun bulundu`, issues);
  
  return passed;
}

// ============================================================
// TEST 8: DIMENSION COVERAGE
// ============================================================

function testDimensionCoverage() {
  console.log('\n📊 Test 8: Boyut Kapsama Kontrolü');
  console.log('-'.repeat(50));
  
  const expectedDimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 
                              'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16'];
  
  const actualDimensions = new Set(COMPLETE_INDICATORS.map(ind => ind.dimension));
  
  const missingDimensions = expectedDimensions.filter(dim => !actualDimensions.has(dim));
  const extraDimensions = Array.from(actualDimensions).filter(dim => !expectedDimensions.includes(dim));
  
  const passed = missingDimensions.length === 0 && extraDimensions.length === 0;
  
  console.log(`Beklenen Boyut: ${expectedDimensions.length}`);
  console.log(`Bulunan Boyut: ${actualDimensions.size}`);
  console.log(`Sonuç: ${passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  
  if (missingDimensions.length > 0) {
    console.log(`Eksik Boyutlar: ${missingDimensions.join(', ')}`);
  }
  if (extraDimensions.length > 0) {
    console.log(`Fazla Boyutlar: ${extraDimensions.join(', ')}`);
  }
  
  addTest('Boyut Kapsama', passed,
    passed ? 'Tüm 16 boyut mevcut' : 'Eksik veya fazla boyut var');
  
  return passed;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

function runAllTests() {
  console.log('='.repeat(60));
  console.log('HIS SİSTEMİ TUTARLILIK VE ANOMALİ KONTROLÜ');
  console.log('='.repeat(60));
  
  testDimensionWeights();
  testIndicatorCounts();
  testIndicatorCodeUniqueness();
  testNormalizationFunctions();
  testMultiplierRanges();
  testIndicatorDataTypes();
  testEvaluationPanels();
  testDimensionCoverage();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('ÖZET SONUÇLAR');
  console.log('='.repeat(60));
  
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  
  console.log(`\nToplam Test: ${testResults.length}`);
  console.log(`Başarılı: ${passed} ✅`);
  console.log(`Başarısız: ${failed} ❌`);
  
  console.log('\nDetaylı Sonuçlar:');
  console.log('-'.repeat(50));
  
  for (const result of testResults) {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.message}`);
  }
  
  const overallPassed = failed === 0;
  console.log('\n' + '='.repeat(60));
  console.log(`GENEL SONUÇ: ${overallPassed ? '✅ TÜM TESTLER BAŞARILI' : '❌ BAZI TESTLER BAŞARISIZ'}`);
  console.log('='.repeat(60));
  
  return overallPassed;
}

// Run tests
const success = runAllTests();
process.exit(success ? 0 : 1);
