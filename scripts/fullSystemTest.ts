/**
 * Tam Sistem Testi - Uctan Uca Dogrulama
 */

import { calculateHIS, DimensionScores } from '../shared/weightingSystem';
import { calculateCascadeMultipliersFromDimensions } from '../server/cascadeEngine';
import { COMPREHENSIVE_DIMENSIONS } from '../shared/comprehensiveDimensions';
import { COMPLETE_INDICATORS, EVALUATION_PANELS, DATA_SOURCES } from '../shared/completeIndicatorSystem';

console.log('================================================================================');
console.log('AKADEMIK ETKI DEGERLENDIRME SISTEMI - TAM DOGRULAMA TESTI');
console.log('================================================================================');
console.log('');

// Test verisi: mRNA Asi Makalesi
const testDimensionScores: DimensionScores = {
  D1: 95,   // Akademik Etki
  D2: 90,   // Toplumsal Etki
  D3: 15,   // Negatif Etki
  D4: 85,   // Etik
  D5: 88,   // Ekonomik Etki
  D6: 92,   // Saglik Etkisi
  D7: 45,   // Cevresel Etki
  D8: 70,   // Politik Etki
  D9: 85,   // Teknolojik Etki
  D10: 75,  // Sosyal Etki
  D11: 65,  // Egitim Etkisi
  D12: 80,  // Dijital Etki
  D13: 40,  // Guvenlik Etkisi
  D14: 70,  // Psikolojik Etki
  D15: 78,  // Uluslararasi Isbirligi
  D16: 0    // Otomatik hesaplanacak
};

console.log('TEST 1: Sistem Bilesenleri Kontrolu');
console.log('----------------------------------------');

// 1. Gosterge sayisi kontrolu
const indicatorCount = Object.keys(COMPLETE_INDICATORS).length;
console.log('Gosterge sayisi: ' + indicatorCount);

// 2. Boyut sayisi kontrolu
const dimensionCount = COMPREHENSIVE_DIMENSIONS.length;
console.log('Boyut sayisi: ' + dimensionCount);

// 3. Degerlendirme paneli sayisi kontrolu
const panelCount = Object.keys(EVALUATION_PANELS).length;
console.log('Degerlendirme paneli sayisi: ' + panelCount);

// 4. API kaynak sayisi kontrolu
const apiCount = Object.keys(DATA_SOURCES).length;
console.log('API kaynak sayisi: ' + apiCount);

console.log('');
console.log('TEST 2: Boyut Agirliklari Kontrolu');
console.log('----------------------------------------');

// Boyut agirliklarini kontrol et
let totalWeight = 0;
COMPREHENSIVE_DIMENSIONS.forEach(dim => {
  totalWeight += dim.weight;
  const weightPercent = (dim.weight * 100).toFixed(1);
  console.log('  ' + dim.code + ': ' + dim.name + ' - Agirlik: ' + weightPercent + '%');
});

const totalWeightPercent = (totalWeight * 100).toFixed(1);
console.log('  TOPLAM: ' + totalWeightPercent + '%');

if (Math.abs(totalWeight - 1.0) < 0.001) {
  console.log('BASARILI: Boyut agirliklari toplami: 100%');
} else {
  console.log('HATALI: Boyut agirliklari toplami: ' + totalWeightPercent + '%');
}

console.log('');
console.log('TEST 3: HIS Hesaplama');
console.log('----------------------------------------');

// Cascade carpanlarini hesapla
const cascadeMetrics = calculateCascadeMultipliersFromDimensions(testDimensionScores);
console.log('Cascade Carpanlari:');
console.log('  Ekonomik Carpan: ' + cascadeMetrics.economicMultiplier.toFixed(2) + 'x');
console.log('  Sosyal Carpan: ' + cascadeMetrics.socialMultiplier.toFixed(2) + 'x');
console.log('  Bilimsel Carpan: ' + cascadeMetrics.scientificMultiplier.toFixed(2) + 'x');
console.log('  Cevresel Carpan: ' + cascadeMetrics.environmentalMultiplier.toFixed(2) + 'x');
console.log('  Ag Etkisi Skoru: ' + cascadeMetrics.networkEffectScore.toFixed(2));
console.log('  Toplam Cascade Carpani: ' + cascadeMetrics.cascadeMultiplier.toFixed(2) + 'x');

// HIS hesapla
const HIS = calculateHIS(testDimensionScores, 'comprehensive', cascadeMetrics.cascadeMultiplier);
console.log('');
console.log('Hesaplanan HIS: ' + HIS.toFixed(2));

// HIS aralik kontrolu
if (HIS >= 0 && HIS <= 100) {
  console.log('BASARILI: HIS aralik kontrolu: 0-100 arasi');
} else {
  console.log('HATALI: HIS aralik kontrolu: ' + HIS.toFixed(2));
}

console.log('');
console.log('TEST 4: Detayli Hesaplama Adimlari');
console.log('----------------------------------------');

// Manuel hesaplama ile dogrulama
let manualBaseHIS = 0;
COMPREHENSIVE_DIMENSIONS.forEach(dim => {
  const dimNum = parseInt(dim.code.replace('D', ''));
  const dimKey = ('D' + dimNum) as keyof DimensionScores;
  const score = testDimensionScores[dimKey] || 0;
  const contribution = score * dim.weight;
  manualBaseHIS += contribution;
  console.log('  ' + dim.code + ': ' + score + ' x ' + (dim.weight * 100).toFixed(1) + '% = ' + contribution.toFixed(2));
});

console.log('  BASE HIS (Agirlikli Toplam): ' + manualBaseHIS.toFixed(2));
console.log('  Cascade Carpani: ' + cascadeMetrics.cascadeMultiplier.toFixed(2) + 'x');

const manualFinalHIS = Math.min(100, manualBaseHIS * cascadeMetrics.cascadeMultiplier);
console.log('  FINAL HIS: min(100, ' + manualBaseHIS.toFixed(2) + ' x ' + cascadeMetrics.cascadeMultiplier.toFixed(2) + ') = ' + manualFinalHIS.toFixed(2));

// Hesaplama tutarliligi kontrolu
if (Math.abs(HIS - manualFinalHIS) < 0.1) {
  console.log('BASARILI: Hesaplama tutarliligi: Otomatik ve manuel hesaplamalar eslesiyor');
} else {
  console.log('HATALI: Hesaplama tutarsizligi: Otomatik=' + HIS.toFixed(2) + ', Manuel=' + manualFinalHIS.toFixed(2));
}

console.log('');
console.log('TEST 5: Zincirleme Etki Analizi');
console.log('----------------------------------------');

// 5 seviye cascade analizi
const cascadeLevels = [
  { level: 1, name: 'Birincil Etki', decay: 1.0 },
  { level: 2, name: 'Ikincil Etki', decay: 0.85 },
  { level: 3, name: 'Ucuncul Etki', decay: 0.7225 },
  { level: 4, name: 'Dorduncul Etki', decay: 0.614 },
  { level: 5, name: 'Besincil Etki', decay: 0.522 }
];

console.log('Zincirleme Etki Seviyeleri (mRNA Asi Ornegi):');
cascadeLevels.forEach(level => {
  const effectiveScore = manualBaseHIS * level.decay;
  console.log('  Seviye ' + level.level + ' - ' + level.name + ':');
  console.log('    Decay: ' + (level.decay * 100).toFixed(1) + '%');
  console.log('    Efektif Skor: ' + effectiveScore.toFixed(2));
});

console.log('');
console.log('TEST 6: Veri Turu Dagilimi');
console.log('----------------------------------------');

// Gostergeleri veri turune gore say
const dataTypeCounts: Record<string, number> = {};
Object.values(COMPLETE_INDICATORS).forEach(indicator => {
  const type = indicator.dataType;
  dataTypeCounts[type] = (dataTypeCounts[type] || 0) + 1;
});

console.log('Gosterge Veri Turu Dagilimi:');
Object.entries(dataTypeCounts).forEach(([type, count]) => {
  console.log('  ' + type + ': ' + count + ' gosterge');
});

console.log('');
console.log('================================================================================');
console.log('DOGRULAMA SONUCU');
console.log('================================================================================');

// Sonuc ozeti
const tests = [
  { name: 'Gosterge Sayisi (>=100)', pass: indicatorCount >= 100 },
  { name: 'Boyut Sayisi (=16)', pass: dimensionCount === 16 },
  { name: 'Panel Sayisi (=5)', pass: panelCount === 5 },
  { name: 'Agirlik Toplami (=100%)', pass: Math.abs(totalWeight - 1.0) < 0.001 },
  { name: 'HIS Araligi (0-100)', pass: HIS >= 0 && HIS <= 100 },
  { name: 'Hesaplama Tutarliligi', pass: Math.abs(HIS - manualFinalHIS) < 0.1 }
];

let passCount = 0;
tests.forEach(test => {
  const status = test.pass ? 'BASARILI' : 'BASARISIZ';
  console.log(status + ': ' + test.name);
  if (test.pass) passCount++;
});

console.log('');
console.log('TOPLAM: ' + passCount + '/' + tests.length + ' test basarili');

if (passCount === tests.length) {
  console.log('');
  console.log('TUM TESTLER BASARILI - SISTEM DOGRULANDI!');
} else {
  console.log('');
  console.log('BAZI TESTLER BASARISIZ - DUZELTME GEREKLI!');
}

console.log('');
console.log('================================================================================');
