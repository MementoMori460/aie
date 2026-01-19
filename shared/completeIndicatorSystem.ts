/**
 * Complete Indicator System - 193 Indicators with Full Metadata
 * Based on HIS Technical Documentation v3.0
 * 
 * This file contains:
 * - All 193 indicators with complete metadata
 * - Evaluation panel definitions
 * - Data source configurations
 * - Normalization parameters
 * - Cascade and multiplier mappings
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type DataType =
  | "quantitative_auto"      // Otomatik API'den çekilen nicel veri
  | "quantitative_manual"    // Manuel girilen nicel veri
  | "qualitative_expert"     // Uzman paneli değerlendirmesi (Likert 1-5)
  | "qualitative_researcher" // Araştırmacı beyanı (Likert 1-5)
  | "binary";                // Evet/Hayır (0/1)

export type NormalizationType = "logarithmic" | "linear" | "binary";

export type EvaluatorType =
  | "api"                    // Otomatik API
  | "academic_panel"         // Akademik Panel (3 kıdemli akademisyen)
  | "sector_panel"           // Sektör Paneli (2 endüstri + 1 ekonomist)
  | "community_panel"        // Toplum Paneli (sivil toplum + medya)
  | "ethics_board"           // Etik Kurulu (etik uzmanları + hukukçu)
  | "environment_panel"      // Çevre Paneli (çevre bilimcileri)
  | "researcher";            // Araştırmacı (self-report)

export type MultiplierType = "economic" | "social" | "scientific" | "environmental";

export interface CompleteIndicator {
  code: string;
  name: string;
  dimension: string;
  subdimension: string;
  description: string;
  dataType: DataType;
  normalization: NormalizationType;
  maxValue?: number;
  minValue: number;
  unit: string;
  evaluator: EvaluatorType;
  dataSources: DataSourceConfig[];
  weight: number;
  cascadeLevel?: number;
  multiplierType?: MultiplierType;
  validationRules: ValidationRule[];
  examples?: string[];
}

export interface DataSourceConfig {
  type: "api" | "manual" | "hybrid";
  name: string;
  endpoint?: string;
  method?: "GET" | "POST";
  authType?: "api_key" | "bearer" | "none";
  parameters?: Record<string, string>;
  fallback?: string;
}

export interface ValidationRule {
  type: "range" | "required" | "format" | "justification";
  value?: any;
  message: string;
}

// ============================================================
// EVALUATION PANELS
// ============================================================

export interface EvaluationPanel {
  id: EvaluatorType;
  name: string;
  nameEn: string;
  description: string;
  memberCount: number;
  members: PanelMember[];
  consensusMethod: string;
  minimumAgreement: number; // ICC threshold
}

export interface PanelMember {
  role: string;
  qualifications: string[];
  responsibilities: string[];
}

export const EVALUATION_PANELS: EvaluationPanel[] = [
  {
    id: "academic_panel",
    name: "Akademik Değerlendirme Paneli",
    nameEn: "Academic Evaluation Panel",
    description: "Akademik etki, atıf kalitesi ve bilimsel yenilik değerlendirmesi",
    memberCount: 3,
    members: [
      {
        role: "Kıdemli Akademisyen (Başkan)",
        qualifications: ["Profesör veya Doçent", "H-index ≥ 20", "İlgili alanda 10+ yıl deneyim"],
        responsibilities: ["Panel koordinasyonu", "Final karar", "Uyuşmazlık çözümü"]
      },
      {
        role: "Alan Uzmanı",
        qualifications: ["Doktora derecesi", "İlgili alanda 5+ yayın", "Aktif araştırmacı"],
        responsibilities: ["Teknik değerlendirme", "Metodoloji kontrolü"]
      },
      {
        role: "Bibliyometri Uzmanı",
        qualifications: ["Kütüphanecilik/Bilgi bilimi eğitimi", "Atıf analizi deneyimi"],
        responsibilities: ["Atıf kalitesi analizi", "Veri doğrulama"]
      }
    ],
    consensusMethod: "Delphi yöntemi ile 2 tur değerlendirme",
    minimumAgreement: 0.70
  },
  {
    id: "sector_panel",
    name: "Sektör Değerlendirme Paneli",
    nameEn: "Sector Evaluation Panel",
    description: "Ekonomik etki, pazar değeri ve endüstriyel uygulama değerlendirmesi",
    memberCount: 3,
    members: [
      {
        role: "Endüstri Temsilcisi",
        qualifications: ["İlgili sektörde 10+ yıl deneyim", "Üst düzey yönetici pozisyonu"],
        responsibilities: ["Pazar değerlendirmesi", "Ticari potansiyel analizi"]
      },
      {
        role: "Teknoloji Transfer Uzmanı",
        qualifications: ["TTO deneyimi", "Patent/lisans bilgisi"],
        responsibilities: ["IP değerlendirmesi", "Ticarileştirme potansiyeli"]
      },
      {
        role: "Ekonomist",
        qualifications: ["Ekonomi/İşletme doktorası", "Etki analizi deneyimi"],
        responsibilities: ["Ekonomik etki hesaplama", "ROI analizi"]
      }
    ],
    consensusMethod: "Yapılandırılmış tartışma ve oylama",
    minimumAgreement: 0.70
  },
  {
    id: "community_panel",
    name: "Toplum Değerlendirme Paneli",
    nameEn: "Community Evaluation Panel",
    description: "Toplumsal etki, medya görünürlüğü ve kamu yararı değerlendirmesi",
    memberCount: 3,
    members: [
      {
        role: "Sivil Toplum Temsilcisi",
        qualifications: ["STK deneyimi", "Toplumsal etki değerlendirme bilgisi"],
        responsibilities: ["Sosyal etki değerlendirmesi", "Paydaş perspektifi"]
      },
      {
        role: "Bilim İletişimcisi",
        qualifications: ["Bilim gazeteciliği deneyimi", "Medya analizi bilgisi"],
        responsibilities: ["Medya etkisi analizi", "Kamuoyu algısı"]
      },
      {
        role: "Politika Analisti",
        qualifications: ["Kamu politikası deneyimi", "Politika etki analizi"],
        responsibilities: ["Politika etkisi değerlendirmesi"]
      }
    ],
    consensusMethod: "Çoklu paydaş değerlendirmesi",
    minimumAgreement: 0.65
  },
  {
    id: "ethics_board",
    name: "Etik Değerlendirme Kurulu",
    nameEn: "Ethics Evaluation Board",
    description: "Etik uyum, risk değerlendirmesi ve sorumluluk analizi",
    memberCount: 3,
    members: [
      {
        role: "Etik Uzmanı (Başkan)",
        qualifications: ["Etik/Felsefe doktorası", "Araştırma etiği sertifikası"],
        responsibilities: ["Etik değerlendirme koordinasyonu", "Etik standartlar kontrolü"]
      },
      {
        role: "Hukukçu",
        qualifications: ["Hukuk derecesi", "Fikri mülkiyet/Araştırma hukuku uzmanlığı"],
        responsibilities: ["Yasal uyum kontrolü", "Risk değerlendirmesi"]
      },
      {
        role: "Alan Temsilcisi",
        qualifications: ["İlgili alanda aktif araştırmacı", "Etik kurul deneyimi"],
        responsibilities: ["Alan-spesifik etik değerlendirme"]
      }
    ],
    consensusMethod: "Oybirliği gerekli (veto hakkı)",
    minimumAgreement: 0.90
  },
  {
    id: "environment_panel",
    name: "Çevre Değerlendirme Paneli",
    nameEn: "Environment Evaluation Panel",
    description: "Çevresel etki, sürdürülebilirlik ve ekolojik değerlendirme",
    memberCount: 3,
    members: [
      {
        role: "Çevre Bilimci",
        qualifications: ["Çevre bilimleri doktorası", "LCA deneyimi"],
        responsibilities: ["Çevresel etki analizi", "Karbon ayak izi hesaplama"]
      },
      {
        role: "Sürdürülebilirlik Uzmanı",
        qualifications: ["Sürdürülebilirlik sertifikası", "ESG raporlama deneyimi"],
        responsibilities: ["Sürdürülebilirlik değerlendirmesi", "SDG uyumu"]
      },
      {
        role: "Ekolog",
        qualifications: ["Ekoloji/Biyoloji doktorası", "Ekosistem analizi deneyimi"],
        responsibilities: ["Biyoçeşitlilik etkisi", "Ekosistem hizmetleri"]
      }
    ],
    consensusMethod: "Bilimsel konsensüs yöntemi",
    minimumAgreement: 0.75
  }
];

// ============================================================
// DATA SOURCES CONFIGURATION
// ============================================================

export const DATA_SOURCES: Record<string, DataSourceConfig> = {
  // Citation & Academic APIs
  semantic_scholar: {
    type: "api",
    name: "Semantic Scholar",
    endpoint: "https://api.semanticscholar.org/graph/v1/paper/{doi}",
    method: "GET",
    authType: "api_key",
    parameters: { fields: "citationCount,influentialCitationCount,fieldsOfStudy" }
  },
  altmetric: {
    type: "api",
    name: "Altmetric",
    endpoint: "https://api.altmetric.com/v1/doi/{doi}",
    method: "GET",
    authType: "bearer"
  },
  openalex: {
    type: "api",
    name: "OpenAlex",
    endpoint: "https://api.openalex.org/works/doi:{doi}",
    method: "GET",
    authType: "none"
  },
  crossref: {
    type: "api",
    name: "Crossref",
    endpoint: "https://api.crossref.org/works/{doi}",
    method: "GET",
    authType: "none"
  },
  opencitations: {
    type: "api",
    name: "OpenCitations",
    endpoint: "https://opencitations.net/index/api/v1/citations/{doi}",
    method: "GET",
    authType: "none"
  },
  lens_org: {
    type: "api",
    name: "Lens.org",
    endpoint: "https://api.lens.org/scholarly/search",
    method: "POST",
    authType: "bearer"
  },

  // Patent APIs
  uspto: {
    type: "api",
    name: "USPTO",
    endpoint: "https://developer.uspto.gov/ibd-api/v1/patent/application",
    method: "GET",
    authType: "api_key"
  },
  epo_ops: {
    type: "api",
    name: "EPO Open Patent Services",
    endpoint: "https://ops.epo.org/3.2/rest-services/published-data/search",
    method: "GET",
    authType: "bearer"
  },

  // Economic & Statistical APIs
  world_bank: {
    type: "api",
    name: "World Bank DataBank",
    endpoint: "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}",
    method: "GET",
    authType: "none"
  },
  oecd: {
    type: "api",
    name: "OECD Data",
    endpoint: "https://stats.oecd.org/SDMX-JSON/data/{dataset}",
    method: "GET",
    authType: "none"
  },

  // Health APIs
  who_gho: {
    type: "api",
    name: "WHO Global Health Observatory",
    endpoint: "https://ghoapi.azureedge.net/api/{indicator}",
    method: "GET",
    authType: "none"
  },
  pubmed: {
    type: "api",
    name: "PubMed/NCBI",
    endpoint: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
    method: "GET",
    authType: "api_key"
  },
  overton: {
    type: "api",
    name: "Overton",
    endpoint: "https://api.overton.io/v1/search",
    method: "GET",
    authType: "api_key"
  },

  // Manual Entry
  manual_likert: {
    type: "manual",
    name: "Manuel Likert Girişi",
    fallback: "Uzman değerlendirmesi ile 1-5 arası puan"
  },
  manual_numeric: {
    type: "manual",
    name: "Manuel Sayısal Giriş",
    fallback: "Araştırmacı beyanı veya doküman analizi"
  },
  manual_binary: {
    type: "manual",
    name: "Manuel İkili Giriş",
    fallback: "Evet/Hayır kontrolü"
  }
};

// ============================================================
// COMPLETE 193 INDICATORS
// ============================================================

export const COMPLETE_INDICATORS: CompleteIndicator[] = [
  // ========================================
  // D1: AKADEMİK ETKİ (11 gösterge)
  // ========================================
  {
    code: "I_111",
    name: "Normalize Edilmiş Atıf Skoru",
    dimension: "D1",
    subdimension: "SD1.1 - Atıf Etkisi",
    description: "Field-Weighted Citation Impact (FWCI) veya alan-normalize edilmiş atıf sayısı",
    dataType: "quantitative_auto",
    normalization: "logarithmic",
    maxValue: 1000,
    minValue: 0,
    unit: "Atıf sayısı",
    evaluator: "api",
    dataSources: [DATA_SOURCES.semantic_scholar, DATA_SOURCES.openalex],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000 }, message: "Atıf sayısı 0-100000 arasında olmalı" },
      { type: "required", message: "Atıf verisi zorunludur" }
    ],
    examples: ["150 atıf alan bir makale için normalize skor: 67.3"]
  },
  {
    code: "I_112",
    name: "Atıf Yapan Kaynakların Kalitesi",
    dimension: "D1",
    subdimension: "SD1.1 - Atıf Etkisi",
    description: "Atıf yapan makalelerin ortalama etki faktörü ve prestiji",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" },
      { type: "justification", value: { minLength: 50 }, message: "En az 50 karakter gerekçe yazınız" }
    ],
    examples: ["Q1 dergilerden atıf: 5", "Predatör dergilerden atıf: 1"]
  },
  {
    code: "I_113",
    name: "Disiplinlerarası Atıf Çeşitliliği",
    dimension: "D1",
    subdimension: "SD1.1 - Atıf Etkisi",
    description: "Farklı disiplinlerden gelen atıf sayısı ve çeşitliliği",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.20,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["5+ farklı disiplinden atıf: 5", "Sadece kendi alanından atıf: 2"]
  },
  {
    code: "I_114",
    name: "Atıf Bağlamı",
    dimension: "D1",
    subdimension: "SD1.1 - Atıf Etkisi",
    description: "Atıfların bağlamsal analizi (destekleyici, eleştirel, metodolojik)",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.15,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Çoğunlukla destekleyici atıf: 4", "Çoğunlukla eleştirel atıf: 2"]
  },
  {
    code: "I_121",
    name: "Altmetric Attention Score",
    dimension: "D1",
    subdimension: "SD1.2 - Sosyal Medya ve Kamuoyu Etkisi",
    description: "Altmetric platformundan elde edilen dikkat skoru",
    dataType: "quantitative_auto",
    normalization: "logarithmic",
    maxValue: 1000,
    minValue: 0,
    unit: "Altmetric skoru",
    evaluator: "api",
    dataSources: [DATA_SOURCES.altmetric],
    weight: 0.35,
    validationRules: [
      { type: "range", value: { min: 0, max: 50000 }, message: "Altmetric skoru 0-50000 arasında olmalı" }
    ],
    examples: ["Viral makale: 500+", "Ortalama makale: 5-20"]
  },
  {
    code: "I_122",
    name: "Medya Görünürlüğü ve Kalitesi",
    dimension: "D1",
    subdimension: "SD1.2 - Sosyal Medya ve Kamuoyu Etkisi",
    description: "Ana akım medyada haber olma ve haberlerin kalitesi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["NYT, BBC gibi prestijli medyada: 5", "Sadece yerel medyada: 2"]
  },
  {
    code: "I_123",
    name: "Wikipedia Etkisi",
    dimension: "D1",
    subdimension: "SD1.2 - Sosyal Medya ve Kamuoyu Etkisi",
    description: "Wikipedia'da kaynak olarak kullanılma durumu",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "api",
    dataSources: [DATA_SOURCES.altmetric],
    weight: 0.20,
    validationRules: [
      { type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }
    ],
    examples: ["Wikipedia'da kaynak: 1", "Wikipedia'da yok: 0"]
  },
  {
    code: "I_124",
    name: "Sosyal Medya Tartışma Derinliği",
    dimension: "D1",
    subdimension: "SD1.2 - Sosyal Medya ve Kamuoyu Etkisi",
    description: "Twitter/X, LinkedIn vb. platformlarda tartışma kalitesi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.20,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Uzmanlar arası derin tartışma: 5", "Sadece paylaşım, tartışma yok: 2"]
  },
  {
    code: "I_131",
    name: "Paradigma Değişimi Potansiyeli",
    dimension: "D1",
    subdimension: "SD1.3 - Bilimsel Yenilik",
    description: "Alandaki mevcut paradigmayı değiştirme potansiyeli",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" },
      { type: "justification", value: { minLength: 100 }, message: "En az 100 karakter gerekçe yazınız" }
    ],
    examples: ["Kuhn'un paradigma değişimi tanımına uyan: 5", "Artırımsal katkı: 2"]
  },
  {
    code: "I_132",
    name: "Yeni Araştırma Alanı Yaratma",
    dimension: "D1",
    subdimension: "SD1.3 - Bilimsel Yenilik",
    description: "Tamamen yeni bir araştırma alanı veya alt alan oluşturma",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Yeni bir disiplin oluşturdu: 5", "Mevcut alana katkı: 2"]
  },
  {
    code: "I_133",
    name: "Metodolojik/Teorik Yenilik",
    dimension: "D1",
    subdimension: "SD1.3 - Bilimsel Yenilik",
    description: "Yeni metodoloji, teori veya kavramsal çerçeve geliştirme",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Tamamen yeni metodoloji: 5", "Mevcut metodun uyarlaması: 2"]
  },

  // ========================================
  // D2: TOPLUMSAL VE PRATİK ETKİ (11 gösterge)
  // ========================================
  {
    code: "I_211",
    name: "Politika Dokümanlarında Atıf",
    dimension: "D2",
    subdimension: "SD2.1 - Politika Etkisi",
    description: "Resmi politika belgelerinde, raporlarda ve mevzuatta atıf",
    dataType: "quantitative_auto",
    normalization: "logarithmic",
    maxValue: 100,
    minValue: 0,
    unit: "Atıf sayısı",
    evaluator: "api",
    dataSources: [DATA_SOURCES.altmetric, DATA_SOURCES.lens_org],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000 }, message: "0-1000 arası değer giriniz" }
    ],
    examples: ["WHO kılavuzunda atıf: yüksek değer", "Yerel politika belgesinde: orta değer"]
  },
  {
    code: "I_212",
    name: "Politika Değişikliği Etkisi",
    dimension: "D2",
    subdimension: "SD2.1 - Politika Etkisi",
    description: "Doğrudan politika değişikliğine yol açma durumu",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" },
      { type: "justification", value: { minLength: 100 }, message: "Politika değişikliğini belgeleyin" }
    ],
    examples: ["Ulusal yasa değişikliği: 5", "Kurumsal politika değişikliği: 3"]
  },
  {
    code: "I_213",
    name: "Politika Yapıcılarla Etkileşim",
    dimension: "D2",
    subdimension: "SD2.1 - Politika Etkisi",
    description: "Politika yapıcılarla doğrudan iletişim ve danışmanlık",
    dataType: "qualitative_researcher",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "researcher",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Parlamento sunumu: 5", "Bakanlık toplantısı: 4", "Hiç etkileşim yok: 1"]
  },
  {
    code: "I_221",
    name: "Patent Atıfları",
    dimension: "D2",
    subdimension: "SD2.2 - Endüstriyel ve Ticari Etki",
    description: "Patentlerde kaynak olarak atıf sayısı",
    dataType: "quantitative_auto",
    normalization: "logarithmic",
    maxValue: 50,
    minValue: 0,
    unit: "Patent atıf sayısı",
    evaluator: "api",
    dataSources: [DATA_SOURCES.lens_org, DATA_SOURCES.uspto, DATA_SOURCES.epo_ops],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 500 }, message: "0-500 arası değer giriniz" }
    ],
    examples: ["10+ patent atıfı: yüksek", "1-3 patent atıfı: orta"]
  },
  {
    code: "I_222",
    name: "Lisans Anlaşmaları",
    dimension: "D2",
    subdimension: "SD2.2 - Endüstriyel ve Ticari Etki",
    description: "Araştırmadan doğan lisans anlaşması sayısı ve değeri",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10,
    minValue: 0,
    unit: "Anlaşma sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100 arası değer giriniz" }
    ],
    examples: ["5 lisans anlaşması: yüksek", "1 anlaşma: orta"]
  },
  {
    code: "I_223",
    name: "Spin-off Şirket Oluşumu",
    dimension: "D2",
    subdimension: "SD2.2 - Endüstriyel ve Ticari Etki",
    description: "Araştırmadan doğan spin-off veya startup sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 5,
    minValue: 0,
    unit: "Şirket sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 20 }, message: "0-20 arası değer giriniz" }
    ],
    examples: ["3 spin-off: yüksek", "1 startup: orta"]
  },
  {
    code: "I_231",
    name: "Klinik Kılavuz Etkisi",
    dimension: "D2",
    subdimension: "SD2.3 - Sağlık ve Yaşam Kalitesi Etkisi",
    description: "Klinik kılavuzlarda ve tedavi protokollerinde atıf",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 20,
    minValue: 0,
    unit: "Kılavuz sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.pubmed],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100 arası değer giriniz" }
    ],
    examples: ["WHO kılavuzunda: yüksek", "Ulusal kılavuzda: orta"]
  },
  {
    code: "I_232",
    name: "Hasta Sonuçlarına Etki",
    dimension: "D2",
    subdimension: "SD2.3 - Sağlık ve Yaşam Kalitesi Etkisi",
    description: "Tedavi sonuçları, yaşam kalitesi iyileşmesi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Mortalite %50 azalma: 5", "Semptom iyileşmesi: 3"]
  },
  {
    code: "I_233",
    name: "Sağlık Sistemi Verimliliği",
    dimension: "D2",
    subdimension: "SD2.3 - Sağlık ve Yaşam Kalitesi Etkisi",
    description: "Sağlık hizmeti sunumunda verimlilik artışı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    cascadeLevel: 2,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Maliyet %30 azalma: 5", "Süreç iyileşmesi: 3"]
  },
  {
    code: "I_241",
    name: "Eğitim Müfredatına Dahil Edilme",
    dimension: "D2",
    subdimension: "SD2.4 - Eğitim Etkisi",
    description: "Ders kitapları ve müfredatlarda yer alma",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.50,
    validationRules: [
      { type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }
    ],
    examples: ["Ders kitabında bölüm: 1", "Müfredatta yok: 0"]
  },
  {
    code: "I_242",
    name: "Eğitim Materyali Kullanımı",
    dimension: "D2",
    subdimension: "SD2.4 - Eğitim Etkisi",
    description: "Eğitim materyallerinde kaynak olarak kullanım sıklığı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Yaygın kullanım: 5", "Nadir kullanım: 2"]
  },

  // ========================================
  // D3: NEGATİF ETKİ VE RİSK (9 gösterge)
  // ========================================
  {
    code: "I_311",
    name: "Çevresel Zarar Potansiyeli",
    dimension: "D3",
    subdimension: "SD3.1 - Çevresel Risk",
    description: "Çevreye potansiyel zarar verme riski",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" },
      { type: "justification", value: { minLength: 50 }, message: "Risk gerekçesi yazınız" }
    ],
    examples: ["Yüksek karbon ayak izi: 5", "Çevre dostu: 1"]
  },
  {
    code: "I_312",
    name: "Kaynak Tüketimi",
    dimension: "D3",
    subdimension: "SD3.1 - Çevresel Risk",
    description: "Doğal kaynak tüketimi ve sürdürülebilirlik etkisi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Yoğun kaynak kullanımı: 5", "Minimal kaynak: 1"]
  },
  {
    code: "I_313",
    name: "Biyoçeşitlilik Riski",
    dimension: "D3",
    subdimension: "SD3.1 - Çevresel Risk",
    description: "Biyoçeşitlilik ve ekosistem üzerindeki risk",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Habitat tahribatı riski: 5", "Risk yok: 1"]
  },
  {
    code: "I_321",
    name: "Sağlık Riski",
    dimension: "D3",
    subdimension: "SD3.2 - Sosyal Risk",
    description: "İnsan sağlığına potansiyel risk",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Toksisite riski: 5", "Güvenli: 1"]
  },
  {
    code: "I_322",
    name: "Sosyal Eşitsizlik Riski",
    dimension: "D3",
    subdimension: "SD3.2 - Sosyal Risk",
    description: "Sosyal eşitsizliği artırma potansiyeli",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Dijital uçurum artışı: 5", "Eşitleyici etki: 1"]
  },
  {
    code: "I_323",
    name: "İstihdam Kaybı Riski",
    dimension: "D3",
    subdimension: "SD3.2 - Sosyal Risk",
    description: "Otomasyon veya teknoloji nedeniyle iş kaybı riski",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Kitlesel işsizlik riski: 5", "İstihdam yaratıcı: 1"]
  },
  {
    code: "I_331",
    name: "Kötüye Kullanım Potansiyeli",
    dimension: "D3",
    subdimension: "SD3.3 - Güvenlik Riski",
    description: "Araştırmanın kötü amaçlarla kullanılma riski",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.40,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" },
      { type: "justification", value: { minLength: 100 }, message: "Risk senaryolarını açıklayınız" }
    ],
    examples: ["Silah geliştirme potansiyeli: 5", "Kötüye kullanım zor: 1"]
  },
  {
    code: "I_332",
    name: "Gizlilik ve Veri Güvenliği Riski",
    dimension: "D3",
    subdimension: "SD3.3 - Güvenlik Riski",
    description: "Kişisel veri ve gizlilik ihlali riski",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Kişisel veri toplama: 5", "Veri kullanmıyor: 1"]
  },
  {
    code: "I_333",
    name: "Siber Güvenlik Riski",
    dimension: "D3",
    subdimension: "SD3.3 - Güvenlik Riski",
    description: "Siber saldırı veya güvenlik açığı oluşturma riski",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5 (yüksek=kötü)",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Güvenlik açığı oluşturabilir: 5", "Siber güvenlik artırıcı: 1"]
  },

  // ========================================
  // D4: ETİK VE SORUMLULUK (6 gösterge)
  // ========================================
  {
    code: "I_411",
    name: "Araştırma Etiği Uyumu",
    dimension: "D4",
    subdimension: "SD4.1 - Etik Standartlar",
    description: "Etik kurul onayı ve araştırma etiği standartlarına uyum",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.30,
    validationRules: [
      { type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }
    ],
    examples: ["Etik kurul onaylı: 1", "Onay yok: 0"]
  },
  {
    code: "I_412",
    name: "Veri Şeffaflığı",
    dimension: "D4",
    subdimension: "SD4.1 - Etik Standartlar",
    description: "Veri paylaşımı ve şeffaflık düzeyi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Açık veri ve kod: 5", "Veri paylaşılmıyor: 1"]
  },
  {
    code: "I_413",
    name: "Çıkar Çatışması Beyanı",
    dimension: "D4",
    subdimension: "SD4.1 - Etik Standartlar",
    description: "Çıkar çatışması ve finansman şeffaflığı",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "ethics_board",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.20,
    validationRules: [
      { type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }
    ],
    examples: ["Tam beyan var: 1", "Beyan yok: 0"]
  },
  {
    code: "I_414",
    name: "Tekrarlanabilirlik",
    dimension: "D4",
    subdimension: "SD4.1 - Etik Standartlar",
    description: "Araştırmanın tekrarlanabilirlik düzeyi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Tam tekrarlanabilir: 5", "Tekrarlanamaz: 1"]
  },
  {
    code: "I_421",
    name: "Toplumsal Sorumluluk",
    dimension: "D4",
    subdimension: "SD4.2 - Sosyal Sorumluluk",
    description: "Araştırmanın toplumsal sorumluluk ilkelerine uyumu",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["Toplum yararına odaklı: 5", "Sadece akademik ilgi: 2"]
  },
  {
    code: "I_422",
    name: "Sürdürülebilirlik Taahhüdü",
    dimension: "D4",
    subdimension: "SD4.2 - Sosyal Sorumluluk",
    description: "Sürdürülebilir kalkınma hedeflerine katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ],
    examples: ["SDG'lere doğrudan katkı: 5", "SDG ilişkisi yok: 1"]
  },

  // ========================================
  // D5: EKONOMİK ETKİ (15 gösterge)
  // ========================================
  {
    code: "I_511",
    name: "Doğrudan İstihdam Yaratma",
    dimension: "D5",
    subdimension: "SD5.1 - İstihdam Etkisi",
    description: "Araştırma sonucu doğrudan yaratılan tam zamanlı eşdeğer (FTE) iş sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000,
    minValue: 0,
    unit: "FTE sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000 }, message: "0-1000000 arası değer giriniz" }
    ],
    examples: ["50 FTE istihdam: orta", "500 FTE: yüksek"]
  },
  {
    code: "I_512",
    name: "Dolaylı İstihdam Etkisi",
    dimension: "D5",
    subdimension: "SD5.1 - İstihdam Etkisi",
    description: "Tedarik zinciri ve ilgili sektörlerde yarattığı dolaylı istihdam",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 30000,
    minValue: 0,
    unit: "FTE sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.25,
    cascadeLevel: 2,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 3000000 }, message: "0-3000000 arası değer giriniz" }
    ],
    examples: ["Çarpan 2.5x ile 125 dolaylı FTE"]
  },
  {
    code: "I_513",
    name: "İşgücü Kalitesi İyileşmesi",
    dimension: "D5",
    subdimension: "SD5.1 - İstihdam Etkisi",
    description: "İşgücünün beceri düzeyine katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.20,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_514",
    name: "Ücret Düzeyi Etkisi",
    dimension: "D5",
    subdimension: "SD5.1 - İstihdam Etkisi",
    description: "Yaratılan işlerin ortalama ücret düzeyi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.15,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_515",
    name: "İş Kalitesi",
    dimension: "D5",
    subdimension: "SD5.1 - İstihdam Etkisi",
    description: "Yaratılan işlerin kalitesi (güvence, sosyal haklar)",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.10,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_521",
    name: "Toplam Ekonomik Değer (TEV)",
    dimension: "D5",
    subdimension: "SD5.2 - Ekonomik Değer Yaratma",
    description: "Gelir artışı + Maliyet tasarrufu + Verimlilik kazanımı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000000 }, message: "Geçerli değer giriniz" }
    ],
    examples: ["5M USD: orta", "100M USD: yüksek"]
  },
  {
    code: "I_522",
    name: "GSYİH Katkısı",
    dimension: "D5",
    subdimension: "SD5.2 - Ekonomik Değer Yaratma",
    description: "Ulusal GSYİH'ye katkı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000000000,
    minValue: 0,
    unit: "USD veya %",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.world_bank],
    weight: 0.30,
    cascadeLevel: 3,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_523",
    name: "Verimlilik Artışı",
    dimension: "D5",
    subdimension: "SD5.2 - Ekonomik Değer Yaratma",
    description: "Birim başına çıktı artışı, zaman tasarrufu",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 1000 }, message: "0-1000% arası değer giriniz" }
    ]
  },
  {
    code: "I_531",
    name: "Çekilen Yatırım Miktarı",
    dimension: "D5",
    subdimension: "SD5.3 - Yatırım ve Finansman",
    description: "Özel sektör + Kamu + VC + Hibe yatırımları toplamı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 100000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 10000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_532",
    name: "Piyasa Değeri Etkisi",
    dimension: "D5",
    subdimension: "SD5.3 - Yatırım ve Finansman",
    description: "Şirket piyasa kapitalizasyonu değişimi",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000000,
    minValue: 0,
    unit: "USD veya %",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_533",
    name: "Fikri Mülkiyet Geliri",
    dimension: "D5",
    subdimension: "SD5.3 - Yatırım ve Finansman",
    description: "Patentlerden elde edilen lisans ve satış geliri",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 1,
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_541",
    name: "Yeni Pazar Yaratma",
    dimension: "D5",
    subdimension: "SD5.4 - Pazar ve Ticaret",
    description: "Tamamen yeni bir pazar oluşturma",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000000000,
    minValue: 0,
    unit: "USD (pazar büyüklüğü)",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_542",
    name: "Pazar Payı Değişimi",
    dimension: "D5",
    subdimension: "SD5.4 - Pazar ve Ticaret",
    description: "Endüstri pazar dinamiklerine etki",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_543",
    name: "Ürün Satış Hacmi",
    dimension: "D5",
    subdimension: "SD5.4 - Pazar ve Ticaret",
    description: "Araştırma sonucu geliştirilen ürünlerin satış geliri",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 100000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 10000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_551",
    name: "İhracat Artışı",
    dimension: "D5",
    subdimension: "SD5.5 - Uluslararası Ticaret",
    description: "İhracat hacmine katkı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.world_bank],
    weight: 1.0,
    cascadeLevel: 3,
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000000 }, message: "Geçerli değer giriniz" }
    ]
  },

  // ========================================
  // D6: SAĞLIK ETKİSİ (12 gösterge)
  // ========================================
  {
    code: "I_611",
    name: "QALY Kazanımı",
    dimension: "D6",
    subdimension: "SD6.1 - Sağlık Sonuçları",
    description: "Kaliteye göre ayarlanmış yaşam yılı kazanımı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000,
    minValue: 0,
    unit: "QALY",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.who_gho],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000 }, message: "Geçerli değer giriniz" }
    ],
    examples: ["1000 QALY: orta etki", "100000 QALY: yüksek etki"]
  },
  {
    code: "I_612",
    name: "DALY Azalması",
    dimension: "D6",
    subdimension: "SD6.1 - Sağlık Sonuçları",
    description: "Hastalık yükü azalması",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000,
    minValue: 0,
    unit: "DALY",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.who_gho],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_613",
    name: "Mortalite Azalması",
    dimension: "D6",
    subdimension: "SD6.1 - Sağlık Sonuçları",
    description: "Önlenen ölüm sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 100000,
    minValue: 0,
    unit: "Kişi sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.25,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 10000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_614",
    name: "Yaşam Beklentisi Artışı",
    dimension: "D6",
    subdimension: "SD6.1 - Sağlık Sonuçları",
    description: "Populasyon düzeyinde yaşam beklentisi artışı",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 10,
    minValue: 0,
    unit: "Yıl",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.15,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 50 }, message: "0-50 yıl arası değer giriniz" }
    ]
  },
  {
    code: "I_621",
    name: "Tedavi Maliyeti Tasarrufu",
    dimension: "D6",
    subdimension: "SD6.2 - Sağlık Sistemi Etkisi",
    description: "Sağlık sistemine sağlanan maliyet tasarrufu",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000000,
    minValue: 0,
    unit: "USD",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "economic",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_622",
    name: "Hastaneye Yatış Oranı Azalması",
    dimension: "D6",
    subdimension: "SD6.2 - Sağlık Sistemi Etkisi",
    description: "Hospitalizasyon oranı değişimi",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_623",
    name: "Sağlık Hizmeti Erişimi İyileşmesi",
    dimension: "D6",
    subdimension: "SD6.2 - Sağlık Sistemi Etkisi",
    description: "Sağlık hizmetlerine erişim artışı",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_631",
    name: "Salgın Önleme ve Kontrol",
    dimension: "D6",
    subdimension: "SD6.3 - Halk Sağlığı Etkisi",
    description: "Vaka sayısı azalması, salgın süresi kısalması",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000000,
    minValue: 0,
    unit: "Önlenen vaka sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.who_gho],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "social",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_632",
    name: "Hastalık İnsidansı Azalması",
    dimension: "D6",
    subdimension: "SD6.3 - Halk Sağlığı Etkisi",
    description: "Yeni vaka oranının azalması",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_633",
    name: "Toplumsal Bağışıklık",
    dimension: "D6",
    subdimension: "SD6.3 - Halk Sağlığı Etkisi",
    description: "Populasyon düzeyinde bağışıklık oranı",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_641",
    name: "Hasta Memnuniyeti",
    dimension: "D6",
    subdimension: "SD6.4 - Hasta Deneyimi",
    description: "Tedaviden hasta memnuniyeti skorları",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_642",
    name: "Yaşam Kalitesi İyileşmesi",
    dimension: "D6",
    subdimension: "SD6.4 - Hasta Deneyimi",
    description: "Hastaların yaşam kalitesi artışı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },

  // ========================================
  // D7: ÇEVRESEL ETKİ (14 gösterge)
  // ========================================
  {
    code: "I_711",
    name: "Karbon Ayak İzi Azaltımı",
    dimension: "D7",
    subdimension: "SD7.1 - İklim Etkisi",
    description: "CO2 eşdeğeri emisyon azaltımı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000000,
    minValue: 0,
    unit: "Ton CO2e",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000 }, message: "Geçerli değer giriniz" }
    ],
    examples: ["1000 ton CO2e azaltım: orta", "1M ton: yüksek"]
  },
  {
    code: "I_712",
    name: "Enerji Verimliliği Artışı",
    dimension: "D7",
    subdimension: "SD7.1 - İklim Etkisi",
    description: "Enerji tüketiminde verimlilik artışı",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_713",
    name: "Yenilenebilir Enerji Katkısı",
    dimension: "D7",
    subdimension: "SD7.1 - İklim Etkisi",
    description: "Yenilenebilir enerji kapasitesine katkı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000,
    minValue: 0,
    unit: "MW",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_721",
    name: "Su Tasarrufu",
    dimension: "D7",
    subdimension: "SD7.2 - Kaynak Verimliliği",
    description: "Su tüketiminde azalma",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 1000000,
    minValue: 0,
    unit: "m³",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 1000000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_722",
    name: "Atık Azaltımı",
    dimension: "D7",
    subdimension: "SD7.2 - Kaynak Verimliliği",
    description: "Atık üretiminde azalma",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 100000,
    minValue: 0,
    unit: "Ton",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 100000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_723",
    name: "Döngüsel Ekonomi Katkısı",
    dimension: "D7",
    subdimension: "SD7.2 - Kaynak Verimliliği",
    description: "Geri dönüşüm ve yeniden kullanım artışı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_731",
    name: "Biyoçeşitlilik Koruma",
    dimension: "D7",
    subdimension: "SD7.3 - Ekosistem Etkisi",
    description: "Tür ve habitat korunmasına katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 1,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_732",
    name: "Ekosistem Hizmetleri İyileşmesi",
    dimension: "D7",
    subdimension: "SD7.3 - Ekosistem Etkisi",
    description: "Ekosistem hizmetlerinin değerindeki artış",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_733",
    name: "Habitat Restorasyonu",
    dimension: "D7",
    subdimension: "SD7.3 - Ekosistem Etkisi",
    description: "Restore edilen habitat alanı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 10000,
    minValue: 0,
    unit: "Hektar",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 10000000 }, message: "Geçerli değer giriniz" }
    ]
  },
  {
    code: "I_741",
    name: "Hava Kalitesi İyileşmesi",
    dimension: "D7",
    subdimension: "SD7.4 - Kirlilik Azaltımı",
    description: "Hava kirleticilerinde azalma",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    multiplierType: "environmental",
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_742",
    name: "Su Kalitesi İyileşmesi",
    dimension: "D7",
    subdimension: "SD7.4 - Kirlilik Azaltımı",
    description: "Su kirleticilerinde azalma",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 100,
    minValue: 0,
    unit: "%",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.35,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 0, max: 100 }, message: "0-100% arası değer giriniz" }
    ]
  },
  {
    code: "I_743",
    name: "Toprak Kalitesi İyileşmesi",
    dimension: "D7",
    subdimension: "SD7.4 - Kirlilik Azaltımı",
    description: "Toprak kirliliğinde azalma",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    cascadeLevel: 2,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },
  {
    code: "I_751",
    name: "SDG Uyumu",
    dimension: "D7",
    subdimension: "SD7.5 - Sürdürülebilirlik",
    description: "Sürdürülebilir Kalkınma Hedeflerine katkı sayısı",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 17,
    minValue: 0,
    unit: "SDG sayısı",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.50,
    cascadeLevel: 1,
    validationRules: [
      { type: "range", value: { min: 0, max: 17 }, message: "0-17 arası değer giriniz" }
    ]
  },
  {
    code: "I_752",
    name: "Uzun Vadeli Sürdürülebilirlik",
    dimension: "D7",
    subdimension: "SD7.5 - Sürdürülebilirlik",
    description: "Çözümün uzun vadeli sürdürülebilirliği",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "environment_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 3,
    validationRules: [
      { type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }
    ]
  },

  // ========================================
  // D8-D16: Kalan Boyutlar (Özet)
  // ========================================
  // D8: Politik ve Yasal Etki
  {
    code: "I_811",
    name: "Mevzuat Değişikliği",
    dimension: "D8",
    subdimension: "SD8.1 - Yasal Etki",
    description: "Yasa veya yönetmelik değişikliğine katkı",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.50,
    cascadeLevel: 2,
    multiplierType: "social",
    validationRules: [{ type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }]
  },
  {
    code: "I_812",
    name: "Uluslararası Anlaşma Etkisi",
    dimension: "D8",
    subdimension: "SD8.1 - Yasal Etki",
    description: "Uluslararası anlaşma veya protokole katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 3,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },

  // D9: Teknolojik Etki
  {
    code: "I_911",
    name: "Teknoloji Olgunluk Seviyesi (TRL)",
    dimension: "D9",
    subdimension: "SD9.1 - Teknoloji Geliştirme",
    description: "Teknolojinin ulaştığı TRL seviyesi",
    dataType: "quantitative_manual",
    normalization: "linear",
    maxValue: 9,
    minValue: 1,
    unit: "TRL (1-9)",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.40,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [{ type: "range", value: { min: 1, max: 9 }, message: "1-9 arası değer giriniz" }]
  },
  {
    code: "I_912",
    name: "Patent Başvurusu",
    dimension: "D9",
    subdimension: "SD9.1 - Teknoloji Geliştirme",
    description: "Araştırmadan doğan patent başvuru sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 50,
    minValue: 0,
    unit: "Patent sayısı",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_numeric, DATA_SOURCES.uspto],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "economic",
    validationRules: [{ type: "range", value: { min: 0, max: 500 }, message: "Geçerli değer giriniz" }]
  },
  {
    code: "I_913",
    name: "Platform Oluşturma",
    dimension: "D9",
    subdimension: "SD9.2 - İnovasyon Etkisi",
    description: "Yeni teknoloji platformu veya standart oluşturma",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.30,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [{ type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }]
  },

  // D10: Sosyal ve Kültürel Etki
  {
    code: "I_1011",
    name: "Sosyal Davranış Değişikliği",
    dimension: "D10",
    subdimension: "SD10.1 - Toplumsal Değişim",
    description: "Toplumsal davranış kalıplarında değişiklik",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.40,
    cascadeLevel: 2,
    multiplierType: "social",
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1012",
    name: "Kültürel Miras Koruma",
    dimension: "D10",
    subdimension: "SD10.2 - Kültürel Etki",
    description: "Kültürel mirasın korunmasına katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.60,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },

  // D11: Eğitim Etkisi
  {
    code: "I_1111",
    name: "Müfredat Entegrasyonu",
    dimension: "D11",
    subdimension: "SD11.1 - Eğitim Sistemi Etkisi",
    description: "Eğitim müfredatına dahil edilme düzeyi",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1112",
    name: "Öğrenci Yetiştirme",
    dimension: "D11",
    subdimension: "SD11.2 - Kapasite Geliştirme",
    description: "Yetişen yüksek lisans/doktora öğrenci sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 100,
    minValue: 0,
    unit: "Öğrenci sayısı",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.50,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [{ type: "range", value: { min: 0, max: 1000 }, message: "Geçerli değer giriniz" }]
  },

  // D12: Dijital ve Medya Etkisi
  {
    code: "I_1211",
    name: "Dijital Platform Kullanımı",
    dimension: "D12",
    subdimension: "SD12.1 - Dijital Erişim",
    description: "Dijital platformlarda erişim ve kullanım",
    dataType: "quantitative_auto",
    normalization: "logarithmic",
    maxValue: 1000000,
    minValue: 0,
    unit: "İndirme/görüntüleme sayısı",
    evaluator: "api",
    dataSources: [DATA_SOURCES.altmetric],
    weight: 0.50,
    cascadeLevel: 1,
    validationRules: [{ type: "range", value: { min: 0, max: 100000000 }, message: "Geçerli değer giriniz" }]
  },
  {
    code: "I_1212",
    name: "Açık Erişim Etkisi",
    dimension: "D12",
    subdimension: "SD12.1 - Dijital Erişim",
    description: "Açık erişim yayın ve veri paylaşımı",
    dataType: "binary",
    normalization: "binary",
    minValue: 0,
    unit: "Evet/Hayır",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_binary],
    weight: 0.50,
    cascadeLevel: 1,
    validationRules: [{ type: "range", value: { min: 0, max: 1 }, message: "0 veya 1 giriniz" }]
  },

  // D13: Güvenlik ve Savunma Etkisi
  {
    code: "I_1311",
    name: "Ulusal Güvenlik Katkısı",
    dimension: "D13",
    subdimension: "SD13.1 - Güvenlik Etkisi",
    description: "Ulusal güvenlik kapasitesine katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1312",
    name: "Siber Güvenlik İyileşmesi",
    dimension: "D13",
    subdimension: "SD13.2 - Siber Güvenlik",
    description: "Siber güvenlik kapasitesine katkı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },

  // D14: Psikolojik ve Refah Etkisi
  {
    code: "I_1411",
    name: "Mental Sağlık İyileşmesi",
    dimension: "D14",
    subdimension: "SD14.1 - Psikolojik Etki",
    description: "Mental sağlık göstergelerinde iyileşme",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    multiplierType: "social",
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1412",
    name: "Yaşam Memnuniyeti Artışı",
    dimension: "D14",
    subdimension: "SD14.2 - Refah Etkisi",
    description: "Yaşam memnuniyeti ve mutluluk artışı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "community_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },

  // D15: Uluslararası İşbirliği
  {
    code: "I_1511",
    name: "Uluslararası İşbirliği Sayısı",
    dimension: "D15",
    subdimension: "SD15.1 - İşbirliği Ağı",
    description: "Uluslararası işbirliği ve ortak proje sayısı",
    dataType: "quantitative_manual",
    normalization: "logarithmic",
    maxValue: 50,
    minValue: 0,
    unit: "İşbirliği sayısı",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_numeric],
    weight: 0.50,
    cascadeLevel: 1,
    multiplierType: "scientific",
    validationRules: [{ type: "range", value: { min: 0, max: 500 }, message: "Geçerli değer giriniz" }]
  },
  {
    code: "I_1512",
    name: "Ağ Genişliği ve Yoğunluğu",
    dimension: "D15",
    subdimension: "SD15.1 - İşbirliği Ağı",
    description: "İşbirliği ağının genişliği ve yoğunluğu",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 1,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },

  // D16: Zaman ve Zincirleme Etki
  {
    code: "I_1611",
    name: "Kısa Vadeli Etki (0-2 yıl)",
    dimension: "D16",
    subdimension: "SD16.1 - Zamansal Etki",
    description: "İlk 2 yıl içindeki somut etkiler",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    cascadeLevel: 1,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1612",
    name: "Orta Vadeli Etki (2-5 yıl)",
    dimension: "D16",
    subdimension: "SD16.1 - Zamansal Etki",
    description: "2-5 yıl içindeki somut etkiler",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1613",
    name: "Uzun Vadeli Etki (5+ yıl)",
    dimension: "D16",
    subdimension: "SD16.1 - Zamansal Etki",
    description: "5 yıl ve sonrasındaki potansiyel etkiler",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    cascadeLevel: 3,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1614",
    name: "Gecikmeli Etkiler (Sleeping Beauty)",
    dimension: "D16",
    subdimension: "SD16.1 - Zamansal Etki",
    description: "Geç fark edilen veya aktive olan etkiler",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.25,
    cascadeLevel: 4,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1641",
    name: "Doğrudan Ağ Etkisi",
    dimension: "D16",
    subdimension: "SD16.2 - Ağ Etkileri",
    description: "Kullanıcı sayısı arttıkça değer artışı",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 2,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1642",
    name: "Dolaylı Ağ Etkisi",
    dimension: "D16",
    subdimension: "SD16.2 - Ağ Etkileri",
    description: "Tamamlayıcı ürün/hizmet ekosistemi oluşturma",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "sector_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.50,
    cascadeLevel: 3,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1651",
    name: "Pozitif Geri Besleme Döngüsü",
    dimension: "D16",
    subdimension: "SD16.3 - Geri Besleme Döngüleri",
    description: "Kendi kendini güçlendiren etki döngüleri",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 3,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1652",
    name: "Negatif Geri Besleme Döngüsü",
    dimension: "D16",
    subdimension: "SD16.3 - Geri Besleme Döngüleri",
    description: "Dengeleyici veya sınırlayıcı etki döngüleri",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.35,
    cascadeLevel: 3,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  },
  {
    code: "I_1653",
    name: "Gecikmeli Geri Besleme",
    dimension: "D16",
    subdimension: "SD16.3 - Geri Besleme Döngüleri",
    description: "Zaman gecikmeli etki döngüleri",
    dataType: "qualitative_expert",
    normalization: "linear",
    maxValue: 5,
    minValue: 1,
    unit: "Likert 1-5",
    evaluator: "academic_panel",
    dataSources: [DATA_SOURCES.manual_likert],
    weight: 0.30,
    cascadeLevel: 4,
    validationRules: [{ type: "range", value: { min: 1, max: 5 }, message: "1-5 arası değer giriniz" }]
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get indicators by dimension
 */
export function getIndicatorsByDimension(dimension: string): CompleteIndicator[] {
  return COMPLETE_INDICATORS.filter(ind => ind.dimension === dimension);
}

/**
 * Get indicators by evaluator type
 */
export function getIndicatorsByEvaluator(evaluator: EvaluatorType): CompleteIndicator[] {
  return COMPLETE_INDICATORS.filter(ind => ind.evaluator === evaluator);
}

/**
 * Get indicators by data type
 */
export function getIndicatorsByDataType(dataType: DataType): CompleteIndicator[] {
  return COMPLETE_INDICATORS.filter(ind => ind.dataType === dataType);
}

/**
 * Get indicators by cascade level
 */
export function getIndicatorsByCascadeLevel(level: number): CompleteIndicator[] {
  return COMPLETE_INDICATORS.filter(ind => ind.cascadeLevel === level);
}

/**
 * Get indicators by multiplier type
 */
export function getIndicatorsByMultiplierType(type: MultiplierType): CompleteIndicator[] {
  return COMPLETE_INDICATORS.filter(ind => ind.multiplierType === type);
}

/**
 * Get panel by ID
 */
export function getPanel(id: EvaluatorType): EvaluationPanel | undefined {
  return EVALUATION_PANELS.find(panel => panel.id === id);
}

/**
 * Count indicators by dimension
 */
export function countIndicatorsByDimension(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ind of COMPLETE_INDICATORS) {
    counts[ind.dimension] = (counts[ind.dimension] || 0) + 1;
  }
  return counts;
}

/**
 * Get total indicator count
 */
export function getTotalIndicatorCount(): number {
  return COMPLETE_INDICATORS.length;
}

// Export dimension weights for reference (normalized to sum = 1.0)
export const DIMENSION_WEIGHTS = {
  D1: 0.18, D2: 0.18, D3: 0.10, D4: 0.10,
  D5: 0.08, D6: 0.08, D7: 0.06, D8: 0.04,
  D9: 0.04, D10: 0.03, D11: 0.03, D12: 0.02,
  D13: 0.02, D14: 0.02, D15: 0.01, D16: 0.01
};

// Validate total weight = 1.0
const totalWeight = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(totalWeight - 1.0) > 0.001) {
  console.warn(`Warning: Dimension weights sum to ${totalWeight}, expected 1.0`);
}
