/**
 * Sample Evaluation Script
 * 
 * This script demonstrates a complete evaluation of a sample academic paper
 * using the HIS (Holistic Impact Score) system with all 193 indicators.
 * 
 * Sample Paper: "mRNA Vaccine Technology for COVID-19 Prevention"
 * - A landmark paper on mRNA vaccine development
 * - Published in Nature, 2020
 * - High citation count, significant policy and health impact
 */

import { 
  COMPLETE_INDICATORS, 
  EVALUATION_PANELS,
  getTotalIndicatorCount,
  countIndicatorsByDimension 
} from '../shared/completeIndicatorSystem';

import {
  performFullEvaluation,
  generateCalculationReport,
  normalizeLogarithmic,
  normalizeLinear,
  normalizeBinary,
  calculate5LevelCascade,
  calculateTotalCascadeMultiplier
} from '../shared/completeCalculationEngine';

// ============================================================
// SAMPLE PAPER METADATA
// ============================================================

const samplePaper = {
  title: "mRNA Vaccine Technology for COVID-19 Prevention: Development, Efficacy and Global Impact",
  authors: ["Dr. Sarah Chen", "Prof. Michael Roberts", "Dr. Lisa Wang"],
  journal: "Nature Medicine",
  year: 2020,
  doi: "10.1038/s41591-020-example",
  field: "Biomedical Sciences / Immunology",
  abstract: `This landmark study presents the development and clinical validation of mRNA-based 
    vaccine technology for COVID-19 prevention. Our research demonstrates 95% efficacy in 
    preventing symptomatic COVID-19 infection across diverse populations. The study includes 
    Phase III clinical trial data from 43,548 participants across 6 countries. Results show 
    significant reduction in severe disease, hospitalization, and mortality. This technology 
    platform has potential applications for future pandemic preparedness and other infectious 
    diseases.`
};

// ============================================================
// SAMPLE INDICATOR VALUES
// ============================================================

/**
 * Sample data for the mRNA vaccine paper
 * Values are realistic estimates based on actual vaccine research impact
 */
const sampleIndicatorValues = new Map<string, number>([
  // D1: Akademik Etki
  ["I_111", 15000],    // Normalize Edilmiş Atıf Skoru - 15,000 citations
  ["I_112", 5],        // Atıf Yapan Kaynakların Kalitesi - Excellent (Q1 journals)
  ["I_113", 5],        // Disiplinlerarası Atıf Çeşitliliği - Very high
  ["I_114", 4],        // Atıf Bağlamı - Mostly supportive
  ["I_121", 850],      // Altmetric Attention Score - Very high
  ["I_122", 5],        // Medya Görünürlüğü - Global coverage
  ["I_123", 1],        // Wikipedia Etkisi - Yes
  ["I_124", 5],        // Sosyal Medya Tartışma Derinliği - Expert discussions
  ["I_131", 5],        // Paradigma Değişimi Potansiyeli - Revolutionary
  ["I_132", 5],        // Yeni Araştırma Alanı Yaratma - mRNA therapeutics field
  ["I_133", 5],        // Metodolojik/Teorik Yenilik - Novel platform

  // D2: Toplumsal ve Pratik Etki
  ["I_211", 45],       // Politika Dokümanlarında Atıf - WHO, CDC, EMA guidelines
  ["I_212", 5],        // Politika Değişikliği Etkisi - Global vaccination policies
  ["I_213", 5],        // Politika Yapıcılarla Etkileşim - Direct advisory roles
  ["I_221", 25],       // Patent Atıfları - Multiple patent citations
  ["I_222", 8],        // Lisans Anlaşmaları - Multiple licensing deals
  ["I_223", 3],        // Spin-off Şirket Oluşumu - BioNTech, Moderna growth
  ["I_231", 15],       // Klinik Kılavuz Etkisi - Global clinical guidelines
  ["I_232", 5],        // Hasta Sonuçlarına Etki - Prevented millions of deaths
  ["I_233", 5],        // Sağlık Sistemi Verimliliği - Reduced hospitalizations
  ["I_241", 1],        // Eğitim Müfredatına Dahil Edilme - Yes
  ["I_242", 5],        // Eğitim Materyali Kullanımı - Widely used

  // D3: Negatif Etki ve Risk (lower is better)
  ["I_311", 1],        // Çevresel Zarar Potansiyeli - Minimal
  ["I_312", 2],        // Kaynak Tüketimi - Low
  ["I_313", 1],        // Biyoçeşitlilik Riski - None
  ["I_321", 2],        // Sağlık Riski - Minor side effects
  ["I_322", 1],        // Sosyal Eşitsizlik Riski - Addressed through COVAX
  ["I_323", 1],        // İstihdam Kaybı Riski - None
  ["I_331", 2],        // Kötüye Kullanım Potansiyeli - Low
  ["I_332", 1],        // Gizlilik ve Veri Güvenliği Riski - Minimal
  ["I_333", 1],        // Siber Güvenlik Riski - None

  // D4: Etik ve Sorumluluk
  ["I_411", 1],        // Araştırma Etiği Uyumu - Full compliance
  ["I_412", 5],        // Veri Şeffaflığı - Open data sharing
  ["I_413", 1],        // Çıkar Çatışması Beyanı - Declared
  ["I_414", 5],        // Tekrarlanabilirlik - Highly reproducible
  ["I_421", 5],        // Toplumsal Sorumluluk - Global health focus
  ["I_422", 5],        // Sürdürülebilirlik Taahhüdü - SDG 3 alignment

  // D5: Ekonomik Etki
  ["I_511", 50000],    // Doğrudan İstihdam Yaratma - Manufacturing jobs
  ["I_512", 150000],   // Dolaylı İstihdam Etkisi - Supply chain
  ["I_513", 5],        // İşgücü Kalitesi İyileşmesi - Biotech skills
  ["I_514", 4],        // Ücret Düzeyi Etkisi - High-paying jobs
  ["I_515", 4],        // İş Kalitesi - Good working conditions
  ["I_521", 50000000000], // Toplam Ekonomik Değer - $50B+ market
  ["I_522", 100000000000], // GSYİH Katkısı - $100B+ economic activity
  ["I_523", 35],       // Verimlilik Artışı - 35% healthcare efficiency
  ["I_531", 20000000000], // Çekilen Yatırım Miktarı - $20B+ investments
  ["I_532", 100000000000], // Piyasa Değeri Etkisi - $100B+ market cap increase
  ["I_533", 5000000000], // Fikri Mülkiyet Geliri - $5B+ licensing
  ["I_541", 100000000000], // Yeni Pazar Yaratma - mRNA therapeutics market
  ["I_542", 15],       // Pazar Payı Değişimi - 15% of vaccine market
  ["I_543", 80000000000], // Ürün Satış Hacmi - $80B+ sales
  ["I_551", 30000000000], // İhracat Artışı - $30B+ exports

  // D6: Sağlık Etkisi
  ["I_611", 50000000], // QALY Kazanımı - 50M QALYs
  ["I_612", 30000000], // DALY Azalması - 30M DALYs prevented
  ["I_613", 20000000], // Mortalite Azalması - 20M deaths prevented
  ["I_614", 0.5],      // Yaşam Beklentisi Artışı - 0.5 years globally
  ["I_621", 500000000000], // Tedavi Maliyeti Tasarrufu - $500B saved
  ["I_622", 60],       // Hastaneye Yatış Oranı Azalması - 60% reduction
  ["I_623", 40],       // Sağlık Hizmeti Erişimi İyileşmesi - 40% improvement
  ["I_631", 500000000], // Salgın Önleme ve Kontrol - 500M cases prevented
  ["I_632", 70],       // Hastalık İnsidansı Azalması - 70% reduction
  ["I_633", 75],       // Toplumsal Bağışıklık - 75% population immunity
  ["I_641", 4],        // Hasta Memnuniyeti - High
  ["I_642", 5],        // Yaşam Kalitesi İyileşmesi - Significant

  // D7: Çevresel Etki
  ["I_711", 1000000],  // Karbon Ayak İzi Azaltımı - 1M tons CO2e saved
  ["I_712", 10],       // Enerji Verimliliği Artışı - 10%
  ["I_713", 0],        // Yenilenebilir Enerji Katkısı - N/A
  ["I_721", 100000],   // Su Tasarrufu - 100K m³
  ["I_722", 50000],    // Atık Azaltımı - 50K tons
  ["I_723", 3],        // Döngüsel Ekonomi Katkısı - Moderate
  ["I_731", 3],        // Biyoçeşitlilik Koruma - Neutral
  ["I_732", 3],        // Ekosistem Hizmetleri İyileşmesi - Neutral
  ["I_733", 0],        // Habitat Restorasyonu - N/A
  ["I_741", 5],        // Hava Kalitesi İyileşmesi - 5% (reduced travel)
  ["I_742", 3],        // Su Kalitesi İyileşmesi - Neutral
  ["I_743", 3],        // Toprak Kalitesi İyileşmesi - Neutral
  ["I_751", 3],        // SDG Uyumu - SDG 3, 8, 9
  ["I_752", 4],        // Uzun Vadeli Sürdürülebilirlik - Good

  // D8: Politik ve Yasal Etki
  ["I_811", 1],        // Mevzuat Değişikliği - Emergency use authorizations
  ["I_812", 5],        // Uluslararası Anlaşma Etkisi - COVAX, WHO agreements

  // D9: Teknolojik Etki
  ["I_911", 9],        // Teknoloji Olgunluk Seviyesi - TRL 9 (deployed)
  ["I_912", 50],       // Patent Başvurusu - 50+ patents
  ["I_913", 1],        // Platform Oluşturma - mRNA platform

  // D10: Sosyal ve Kültürel Etki
  ["I_1011", 5],       // Sosyal Davranış Değişikliği - Vaccination acceptance
  ["I_1012", 3],       // Kültürel Miras Koruma - Neutral

  // D11: Eğitim Etkisi
  ["I_1111", 5],       // Müfredat Entegrasyonu - Medical schools
  ["I_1112", 500],     // Öğrenci Yetiştirme - 500+ researchers trained

  // D12: Dijital ve Medya Etkisi
  ["I_1211", 10000000], // Dijital Platform Kullanımı - 10M+ downloads
  ["I_1212", 1],       // Açık Erişim Etkisi - Open access

  // D13: Güvenlik ve Savunma Etkisi
  ["I_1311", 5],       // Ulusal Güvenlik Katkısı - Pandemic preparedness
  ["I_1312", 3],       // Siber Güvenlik İyileşmesi - Neutral

  // D14: Psikolojik ve Refah Etkisi
  ["I_1411", 4],       // Mental Sağlık İyileşmesi - Reduced pandemic anxiety
  ["I_1412", 4],       // Yaşam Memnuniyeti Artışı - Return to normalcy

  // D15: Uluslararası İşbirliği
  ["I_1511", 100],     // Uluslararası İşbirliği Sayısı - 100+ collaborations
  ["I_1512", 5],       // Ağ Genişliği ve Yoğunluğu - Global network

  // D16: Zaman ve Zincirleme Etki
  ["I_1611", 5],       // Kısa Vadeli Etki - Immediate deployment
  ["I_1612", 5],       // Orta Vadeli Etki - Pandemic control
  ["I_1613", 5],       // Uzun Vadeli Etki - Future pandemic prep
  ["I_1614", 4],       // Gecikmeli Etkiler - mRNA cancer vaccines
  ["I_1641", 5],       // Doğrudan Ağ Etkisi - Herd immunity
  ["I_1642", 5],       // Dolaylı Ağ Etkisi - mRNA ecosystem
  ["I_1651", 5],       // Pozitif Geri Besleme Döngüsü - Research acceleration
  ["I_1652", 2],       // Negatif Geri Besleme Döngüsü - Vaccine hesitancy
  ["I_1653", 4],       // Gecikmeli Geri Besleme - Long-term immunity
]);

// ============================================================
// EVALUATION EXECUTION
// ============================================================

function runSampleEvaluation() {
  console.log('=' .repeat(80));
  console.log('HIS (Holistic Impact Score) - Örnek Makale Değerlendirmesi');
  console.log('=' .repeat(80));
  console.log('');
  
  // Paper info
  console.log('📄 MAKALE BİLGİLERİ');
  console.log('-'.repeat(40));
  console.log(`Başlık: ${samplePaper.title}`);
  console.log(`Yazarlar: ${samplePaper.authors.join(', ')}`);
  console.log(`Dergi: ${samplePaper.journal}`);
  console.log(`Yıl: ${samplePaper.year}`);
  console.log(`Alan: ${samplePaper.field}`);
  console.log('');
  
  // System info
  console.log('📊 SİSTEM BİLGİLERİ');
  console.log('-'.repeat(40));
  console.log(`Toplam Gösterge Sayısı: ${getTotalIndicatorCount()}`);
  console.log(`Boyut Dağılımı:`);
  const dimCounts = countIndicatorsByDimension();
  for (const [dim, count] of Object.entries(dimCounts)) {
    console.log(`  ${dim}: ${count} gösterge`);
  }
  console.log('');
  
  // Perform evaluation
  console.log('🔄 DEĞERLENDİRME YAPILIYOR...');
  console.log('-'.repeat(40));
  
  const result = performFullEvaluation(sampleIndicatorValues, 'comprehensive');
  
  // Results
  console.log('');
  console.log('📈 SONUÇLAR');
  console.log('=' .repeat(80));
  console.log('');
  
  console.log('ÖZET SKORLAR');
  console.log('-'.repeat(40));
  console.log(`Base HIS: ${result.baseHIS.toFixed(2)}`);
  console.log(`Cascade Çarpanı: ${result.cascadeMultiplier.toFixed(2)}x`);
  console.log(`Final HIS: ${result.finalHIS.toFixed(2)}`);
  console.log(`Doğrulama Durumu: ${result.validationStatus}`);
  console.log('');
  
  console.log('BOYUT SKORLARI');
  console.log('-'.repeat(40));
  console.log('Boyut\t\tAd\t\t\t\tSkor\tAğırlık');
  for (const dim of result.dimensionScores) {
    if (dim.score > 0) {
      const name = dim.name.substring(0, 20).padEnd(20);
      console.log(`${dim.code}\t\t${name}\t${dim.score.toFixed(1)}\t${(dim.weight * 100).toFixed(0)}%`);
    }
  }
  console.log('');
  
  console.log('ÇARPAN KATSAYILARI');
  console.log('-'.repeat(40));
  console.log(`Ekonomik Çarpan: ${result.multipliers.economic}x (aralık: 1.5-5.0x)`);
  console.log(`Sosyal Çarpan: ${result.multipliers.social}x (aralık: 2.0-10.0x)`);
  console.log(`Bilimsel Çarpan: ${result.multipliers.scientific}x (aralık: 10-1000x)`);
  console.log(`Çevresel Çarpan: ${result.multipliers.environmental}x (aralık: 1.5-4.0x)`);
  console.log(`Ağ Etkisi: ${result.multipliers.networkEffect} (aralık: 0-100)`);
  console.log(`Toplam Çarpan: ${result.multipliers.total}x (max: 10x)`);
  console.log('');
  
  console.log('ZİNCİRLEME ETKİ SEVİYELERİ');
  console.log('-'.repeat(40));
  console.log('Seviye\tAd\t\tDecay\t\tEtki\t\tKümülatif');
  for (const level of result.cascadeLevels) {
    console.log(`${level.level}\t${level.name}\t\t${level.decayFactor}\t\t${level.effect.toFixed(1)}\t\t${level.cumulative.toFixed(1)}`);
  }
  console.log('');
  
  console.log('VERİ KALİTESİ');
  console.log('-'.repeat(40));
  console.log(`Toplam Gösterge: ${result.calculationDetails.totalIndicators}`);
  console.log(`Doldurulan: ${result.calculationDetails.filledIndicators}`);
  console.log(`Kapsama: ${result.calculationDetails.coveragePercent}%`);
  console.log(`API Verisi: ${result.calculationDetails.dataQuality.apiDataCount}`);
  console.log(`Manuel Veri: ${result.calculationDetails.dataQuality.manualDataCount}`);
  console.log(`Uzman Değerlendirmesi: ${result.calculationDetails.dataQuality.expertDataCount}`);
  console.log('');
  
  if (result.warnings.length > 0) {
    console.log('⚠️ UYARILAR');
    console.log('-'.repeat(40));
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
    console.log('');
  }
  
  console.log('HESAPLAMA FORMÜLLER');
  console.log('-'.repeat(40));
  for (const formula of result.calculationDetails.formulasUsed) {
    console.log(`${formula.name}:`);
    console.log(`  Formül: ${formula.formula}`);
    console.log(`  Sonuç: ${formula.output.toFixed(4)}`);
    console.log('');
  }
  
  // Generate full report
  console.log('=' .repeat(80));
  console.log('TAM RAPOR');
  console.log('=' .repeat(80));
  console.log('');
  console.log(generateCalculationReport(result));
  
  return result;
}

// Run evaluation
const evaluationResult = runSampleEvaluation();

// Export for use in other modules
export { samplePaper, sampleIndicatorValues, evaluationResult };
