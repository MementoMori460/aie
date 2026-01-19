/**
 * Indicator definitions, descriptions, and metadata for the Academic Impact Evaluation System
 */

export type IndicatorType = "quantitative" | "qualitative" | "binary";
export type NormalizationType = "logarithmic" | "linear" | "binary";

export interface IndicatorDefinition {
  code: string;
  name: string;
  description: string;
  type: IndicatorType;
  normalization: NormalizationType;
  dataSource: string;
  measurementMethod: string;
  examples: string[];
  tips: string[];
}

export interface SubDimensionDefinition {
  code: string;
  name: string;
  weight: number;
  indicators: IndicatorDefinition[];
}

export interface DimensionDefinition {
  code: string;
  name: string;
  description: string;
  weight: number;
  subDimensions: SubDimensionDefinition[];
}

// D1: Akademik Etki
export const D1_ACADEMIC_IMPACT: DimensionDefinition = {
  code: "D1",
  name: "Akademik Etki",
  description: "Bilimsel topluluk içindeki etki ve katkı",
  weight: 0.35,
  subDimensions: [
    {
      code: "SD1.1",
      name: "Atıf Tabanlı Etki",
      weight: 0.40,
      indicators: [
        {
          code: "I_111",
          name: "Normalize Edilmiş Atıf Skoru",
          description: "Makalenin aldığı atıf sayısının, aynı yıl ve alanda yayınlanan makalelere göre normalize edilmiş değeri",
          type: "quantitative",
          normalization: "logarithmic",
          dataSource: "Web of Science, Scopus, Google Scholar",
          measurementMethod: "Atıf sayısını API veya manuel sorgu ile alın. Aynı yıl ve WoS kategorisindeki maksimum atıf sayısını referans alarak logaritmik normalizasyon uygulayın.",
          examples: [
            "120 atıf, max 500 → Score = 100 * (log(121) / log(501)) ≈ 68",
            "10 atıf, max 500 → Score = 100 * (log(11) / log(501)) ≈ 38"
          ],
          tips: [
            "Yeni makaleler için atıf sayısı düşük olabilir, bu normal",
            "Disipline göre atıf kültürü değişir, karşılaştırma yaparken dikkatli olun"
          ]
        },
        {
          code: "I_112",
          name: "Atıf Yapan Kaynakların Kalitesi Skoru",
          description: "Makaleye atıf yapan kaynakların kalitesi ve prestiji (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Atıf yapan dergilerin impakt faktörlerini, atıf yapan yazarların h-indekslerini inceleyin. 1=Düşük kalite, 5=Çok yüksek kalite",
          examples: [
            "Çoğunlukla yüksek IF dergilerden atıf → 4-5 puan",
            "Karışık kalitede atıflar → 3 puan"
          ],
          tips: [
            "Sadece sayıya değil, atıf yapan kaynakların kalitesine odaklanın",
            "Kendi kendine atıfları (self-citation) değerlendirmeye dahil etmeyin"
          ]
        },
        {
          code: "I_113",
          name: "Disiplinlerarası Atıf Çeşitliliği Skoru",
          description: "Makalenin farklı disiplinlerden atıf alması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Atıf yapan makalelerin WoS kategorilerini inceleyin. 1=Tek disiplin, 5=Çok geniş disiplinlerarası etki",
          examples: [
            "Sadece kendi alanından atıf → 1-2 puan",
            "3-4 farklı disiplinden atıf → 4 puan",
            "5+ farklı disiplinden atıf → 5 puan"
          ],
          tips: [
            "Disiplinlerarası etki, makalenin geniş kitleye ulaştığını gösterir",
            "WoS kategorilerini veya dergi alanlarını referans alın"
          ]
        },
        {
          code: "I_114",
          name: "Atıf Bağlamı Skoru",
          description: "Atıfların makalenin bulgularını desteklemek için mi, eleştirmek için mi yapıldığı (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Atıf yapan makalelerin ilgili bölümlerini okuyun. 1=Çoğunlukla eleştirel, 5=Çoğunlukla destekleyici",
          examples: [
            "Atıfların çoğu makalenin bulgularını temel alıyor → 4-5 puan",
            "Atıflar metodolojik zayıflıkları tartışıyor → 2 puan"
          ],
          tips: [
            "Atıf bağlamını anlamak için en az 5-10 atıf yapan makaleyi inceleyin",
            "Eleştirel atıflar her zaman kötü değildir, tartışmayı tetikleyebilir"
          ]
        }
      ]
    },
    {
      code: "SD1.2",
      name: "Alternatif ve Medya Etkisi",
      weight: 0.30,
      indicators: [
        {
          code: "I_121",
          name: "Altmetric Attention Score",
          description: "Makalenin sosyal medya, haber siteleri ve bloglarda aldığı dikkat",
          type: "quantitative",
          normalization: "logarithmic",
          dataSource: "Altmetric.com, PlumX",
          measurementMethod: "Altmetric.com'dan makalenin Attention Score'unu alın. Maksimum değer olarak 1000 kullanın.",
          examples: [
            "Altmetric Score 150, max 1000 → Score ≈ 52",
            "Altmetric Score 500, max 1000 → Score ≈ 90"
          ],
          tips: [
            "Yüksek altmetric her zaman kaliteyi göstermez, popülerlik olabilir",
            "Sosyal bilimlerde genellikle daha yüksek altmetric skorları görülür"
          ]
        },
        {
          code: "I_122",
          name: "Medya Görünürlüğü ve Kalitesi Skoru",
          description: "Makalenin haber sitelerinde ve medyada yer alması ve bu haberlerin kalitesi (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Google News, Altmetric.com",
          measurementMethod: "Makalenin kaç haber sitesinde yer aldığını ve haberlerin kalitesini değerlendirin. 1=Hiç yok, 5=Prestijli medyada geniş yer",
          examples: [
            "Nature News, Science Magazine'de haber → 5 puan",
            "Sadece üniversite haber bülteninde → 2 puan"
          ],
          tips: [
            "Prestijli bilim gazeteciliği platformlarına odaklanın",
            "Clickbait haberleri değerlendirmeye dahil etmeyin"
          ]
        },
        {
          code: "I_123",
          name: "Wikipedia ve Çevrimiçi Ansiklopedi Etkisi",
          description: "Makalenin Wikipedia veya diğer ansiklopedilerde referans olarak kullanılması",
          type: "binary",
          normalization: "binary",
          dataSource: "Wikipedia, Altmetric.com",
          measurementMethod: "Makalenin Wikipedia'da referans olarak kullanılıp kullanılmadığını kontrol edin. 1=Var, 0=Yok",
          examples: [
            "Wikipedia'da 3 farklı makalede referans → 1 (100 puan)",
            "Hiç referans yok → 0 (0 puan)"
          ],
          tips: [
            "Wikipedia referansı, makalenin genel bilgi kaynağı olarak kabul edildiğini gösterir",
            "Altmetric.com'da Wikipedia sekmesinden kontrol edebilirsiniz"
          ]
        },
        {
          code: "I_124",
          name: "Sosyal Medya ve Blog Tartışmalarının Derinliği",
          description: "Sosyal medya ve bloglarda makalenin ne kadar derinlemesine tartışıldığı (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Twitter, Reddit, Blogs",
          measurementMethod: "Sosyal medyada makalenin sadece paylaşılmadığını, aynı zamanda tartışıldığını kontrol edin. 1=Sadece paylaşım, 5=Derin analiz ve tartışma",
          examples: [
            "Reddit'te 50+ yorum ile tartışma → 4-5 puan",
            "Sadece Twitter'da paylaşım → 1-2 puan"
          ],
          tips: [
            "Sentiment analizi yaparak olumlu/olumsuz tartışmaları ayırın",
            "Botlar ve spam hesapları filtreyin"
          ]
        }
      ]
    },
    {
      code: "SD1.3",
      name: "Düşünsel ve Kavramsal Katkı",
      weight: 0.30,
      indicators: [
        {
          code: "I_131",
          name: "Paradigma Değişimi Potansiyeli Skoru",
          description: "Makalenin alandaki mevcut paradigmayı değiştirme potansiyeli (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makalenin bulguları mevcut teorileri çürütüyor mu, yeni bir bakış açısı sunuyor mu? 1=Artımsal katkı, 5=Paradigma değiştirici",
          examples: [
            "Kuantum hesaplama için yeni bir algoritma → 5 puan",
            "Mevcut yöntemin ufak bir iyileştirmesi → 2 puan"
          ],
          tips: [
            "Paradigma değişimi nadir görülür, çoğu makale 2-3 puan alır",
            "Alanın uzmanlarının görüşlerini dikkate alın"
          ]
        },
        {
          code: "I_132",
          name: "Yeni Araştırma Alanı Yaratma Skoru",
          description: "Makalenin tamamen yeni bir araştırma alanı veya alt alan yaratması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makale yeni bir araştırma sorusu, yöntem veya alan mı açtı? 1=Hayır, 5=Evet, tamamen yeni alan",
          examples: [
            "Deep learning'in ilk makalesi → 5 puan",
            "Mevcut alanda yeni bir uygulama → 3 puan"
          ],
          tips: [
            "Yeni alan yaratma, sonraki yıllarda birçok takip çalışmasının olmasıyla anlaşılır",
            "Google Scholar'da 'cited by' bölümünü inceleyin"
          ]
        },
        {
          code: "I_133",
          name: "Metodolojik veya Teorik Yenilik Skoru",
          description: "Makalenin yeni bir yöntem veya teori sunması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makale yeni bir araştırma yöntemi, analiz tekniği veya teorik çerçeve sunuyor mu? 1=Hayır, 5=Evet, çok yenilikçi",
          examples: [
            "CRISPR-Cas9 yönteminin ilk tanıtımı → 5 puan",
            "Mevcut yöntemin modifikasyonu → 3 puan"
          ],
          tips: [
            "Metodolojik yenilik, diğer araştırmacılar tarafından benimsenmeyle ölçülür",
            "Yöntem makaleleri genellikle yüksek puan alır"
          ]
        }
      ]
    }
  ]
};

// D2: Toplumsal ve Pratik Etki
export const D2_SOCIAL_PRACTICAL_IMPACT: DimensionDefinition = {
  code: "D2",
  name: "Toplumsal ve Pratik Etki",
  description: "Akademi dışındaki dünyada yarattığı değişim",
  weight: 0.40,
  subDimensions: [
    {
      code: "SD2.1",
      name: "Politika ve Yönetim Etkisi",
      weight: 0.30,
      indicators: [
        {
          code: "I_211",
          name: "Politika Belgelerindeki Referans Sayısı ve Ağırlığı",
          description: "Makalenin hükümet politika belgelerinde, raporlarda referans olarak kullanılması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Overton.io, hükümet web siteleri",
          measurementMethod: "Overton.io'da makaleyi arayın. Kaç politika belgesinde referans verildiğini ve belgelerin önemini değerlendirin. 1=Hiç yok, 5=Çok sayıda önemli belgede",
          examples: [
            "WHO raporunda merkezi referans → 5 puan",
            "Yerel belediye raporunda tek referans → 2 puan"
          ],
          tips: [
            "Ulusal ve uluslararası politika belgelerine öncelik verin",
            "Overton.io'nun ücretsiz sürümü sınırlıdır, manuel arama gerekebilir"
          ]
        },
        {
          code: "I_212",
          name: "Yasal ve Düzenleyici Değişikliklere Etki Skoru",
          description: "Makalenin yasal düzenlemelere veya standartlara etkisi (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Yasal veritabanları, haber kaynakları",
          measurementMethod: "Makalenin bulgularının bir yasanın, düzenlemenin veya standardın değişmesine katkıda bulunup bulunmadığını araştırın. 1=Hiç etki yok, 5=Doğrudan yasaya yansıdı",
          examples: [
            "AB'de GDPR'a katkıda bulunan makale → 5 puan",
            "Endüstri standardına dolaylı etki → 3 puan"
          ],
          tips: [
            "Bu etki genellikle yıllar sonra ortaya çıkar",
            "Yasal metinlerdeki referansları kontrol edin"
          ]
        },
        {
          code: "I_213",
          name: "Uluslararası Kuruluş Raporlarına Etki Skoru",
          description: "Makalenin UN, WHO, World Bank gibi kuruluşların raporlarında kullanılması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "UN, WHO, World Bank web siteleri",
          measurementMethod: "Uluslararası kuruluşların web sitelerinde makaleyi arayın. 1=Hiç yok, 5=Merkezi referans",
          examples: [
            "IPCC raporunda referans → 5 puan",
            "Bölgesel UN raporunda referans → 3 puan"
          ],
          tips: [
            "Bu kuruluşların raporları genellikle PDF formatındadır, manuel arama gerekir",
            "Google Scholar'da 'cited by' bölümünde kuruluş adlarını arayın"
          ]
        }
      ]
    },
    {
      code: "SD2.2",
      name: "Ekonomik ve Endüstriyel Etki",
      weight: 0.30,
      indicators: [
        {
          code: "I_221",
          name: "Patent Atıfları ve Lisanslama Skoru",
          description: "Makalenin patentlerde atıf alması ve teknoloji lisanslaması",
          type: "quantitative",
          normalization: "logarithmic",
          dataSource: "Google Patents, USPTO",
          measurementMethod: "Google Patents'te makaleyi arayın. Kaç patentte atıf aldığını sayın. Maksimum değer olarak 100 kullanın.",
          examples: [
            "5 patentte atıf, max 100 → Score ≈ 40",
            "50 patentte atıf, max 100 → Score ≈ 85"
          ],
          tips: [
            "Patent atıfları, makalenin ticari değerini gösterir",
            "Bazı alanlarda (mühendislik, tıp) patent atıfları daha yaygındır"
          ]
        },
        {
          code: "I_222",
          name: "Endüstriyel Standartlara ve Uygulamalara Etki Skoru",
          description: "Makalenin endüstri standartlarına veya uygulamalarına etkisi (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Endüstri raporları, şirket web siteleri",
          measurementMethod: "Makalenin bulgularının endüstride uygulanıp uygulanmadığını araştırın. 1=Hiç uygulanmadı, 5=Geniş çapta endüstri standardı oldu",
          examples: [
            "IEEE standardına dahil edildi → 5 puan",
            "Birkaç şirket tarafından pilot uygulamada → 3 puan"
          ],
          tips: [
            "Şirket blog yazıları ve teknik raporları inceleyin",
            "LinkedIn'de makalenin yazarlarının endüstri bağlantılarını kontrol edin"
          ]
        },
        {
          code: "I_223",
          name: "Yeni Ürün, Hizmet veya Şirket Yaratma Skoru",
          description: "Makalenin bulgularına dayalı yeni ürün, hizmet veya startup yaratılması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Crunchbase, şirket web siteleri",
          measurementMethod: "Makaleye dayalı bir startup kuruldu mu, yeni bir ürün geliştirildi mi? 1=Hayır, 5=Evet, birden fazla şirket/ürün",
          examples: [
            "Makaleye dayalı 3 startup kuruldu → 5 puan",
            "Bir şirket makalenin yöntemini ürüne dönüştürdü → 4 puan"
          ],
          tips: [
            "Yazarların LinkedIn profillerini kontrol edin",
            "Crunchbase'de şirket açıklamalarında makaleyi arayın"
          ]
        }
      ]
    },
    {
      code: "SD2.3",
      name: "Halk ve Kültür Etkisi",
      weight: 0.20,
      indicators: [
        {
          code: "I_231",
          name: "Kamuoyu Farkındalığı ve Davranış Değişikliği Skoru",
          description: "Makalenin halkın farkındalığını artırması ve davranış değişikliğine yol açması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Anketler, medya analizi",
          measurementMethod: "Makalenin bulgularının halk tarafından bilinip bilinmediğini ve davranış değişikliğine yol açıp açmadığını değerlendirin. 1=Hiç etki yok, 5=Geniş çapta davranış değişikliği",
          examples: [
            "Sigara zararları üzerine makale → kamu politikası değişikliği → 5 puan",
            "Sadece akademik çevrede biliniyor → 1 puan"
          ],
          tips: [
            "Bu etki genellikle sosyal bilimler ve sağlık alanlarında görülür",
            "Medya haberleri ve sosyal kampanyaları inceleyin"
          ]
        },
        {
          code: "I_232",
          name: "Sosyal Adalet ve Eşitlik Katkısı Skoru",
          description: "Makalenin sosyal adalet, eşitlik veya dezavantajlı gruplara katkısı (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makalenin bulgularının sosyal adalete, eşitliğe veya dezavantajlı gruplara katkıda bulunup bulunmadığını değerlendirin. 1=Hiç katkı yok, 5=Çok büyük katkı",
          examples: [
            "Eğitimde fırsat eşitliği üzerine makale → politika değişikliği → 5 puan",
            "Sadece teorik tartışma → 2 puan"
          ],
          tips: [
            "Bu gösterge subjektiftir, uzman görüşü önemlidir",
            "UN Sürdürülebilir Kalkınma Hedefleri ile ilişkisini kontrol edin"
          ]
        },
        {
          code: "I_233",
          name: "Kültürel Üretimlere Etki Skoru",
          description: "Makalenin film, kitap, sanat eseri gibi kültürel üretimlere ilham vermesi (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Film veritabanları, kitap referansları",
          measurementMethod: "Makalenin bulgularının bir film, kitap, sanat eseri veya müze sergisinde kullanılıp kullanılmadığını araştırın. 1=Hiç yok, 5=Birden fazla kültürel üretim",
          examples: [
            "Belgesel film yapıldı → 4-5 puan",
            "Popüler bilim kitabında referans → 3 puan"
          ],
          tips: [
            "Bu etki nadir görülür, çoğu makale 1 puan alır",
            "IMDb, Goodreads gibi platformlarda arama yapın"
          ]
        }
      ]
    },
    {
      code: "SD2.4",
      name: "Eğitim Etkisi",
      weight: 0.20,
      indicators: [
        {
          code: "I_241",
          name: "Eğitim Müfredatında Yer Alma Genişliği ve Derinliği",
          description: "Makalenin üniversite derslerinde ve müfredatlarda kullanılması (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Üniversite ders katalogları, syllabus'lar",
          measurementMethod: "Makalenin kaç üniversitede, kaç derste okuma listesinde olduğunu araştırın. 1=Hiç yok, 5=Çok sayıda üniversitede temel okuma",
          examples: [
            "50+ üniversitede lisans dersinde okuma → 5 puan",
            "Sadece 1-2 üniversitede yüksek lisans dersinde → 2 puan"
          ],
          tips: [
            "Google'da 'syllabus' + makale başlığı arayın",
            "Coursera, edX gibi MOOC platformlarını kontrol edin"
          ]
        },
        {
          code: "I_242",
          name: "Ders Kitapları ve Eğitim Materyallerindeki Yeri",
          description: "Makalenin ders kitaplarında veya eğitim materyallerinde referans olarak kullanılması",
          type: "binary",
          normalization: "binary",
          dataSource: "Google Books, Amazon",
          measurementMethod: "Makalenin ders kitaplarında referans olarak kullanılıp kullanılmadığını kontrol edin. 1=Var, 0=Yok",
          examples: [
            "3 farklı ders kitabında referans → 1 (100 puan)",
            "Hiç referans yok → 0 (0 puan)"
          ],
          tips: [
            "Google Books'ta 'cited by' özelliğini kullanın",
            "Amazon'da ders kitaplarının içindekiler bölümünü inceleyin"
          ]
        }
      ]
    }
  ]
};

// D3: Negatif Etki ve Risk
export const D3_NEGATIVE_IMPACT: DimensionDefinition = {
  code: "D3",
  name: "Negatif Etki ve Risk",
  description: "Yarattığı veya yaratabileceği zararlar",
  weight: 0.15,
  subDimensions: [
    {
      code: "SD3.1",
      name: "Bilimsel Geçersizlik ve Zayıflık",
      weight: 0.40,
      indicators: [
        {
          code: "I_311",
          name: "Metodolojik Zayıflık ve Eleştiri Skoru",
          description: "Makalenin metodolojik zayıflıkları ve aldığı eleştiriler (1-5 Likert, yüksek=kötü)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Literatür taraması, PubPeer",
          measurementMethod: "Makaleyi eleştiren yayınları ve PubPeer yorumlarını inceleyin. 1=Hiç eleştiri yok, 5=Ciddi metodolojik sorunlar",
          examples: [
            "Birçok makale metodolojik hataları eleştiriyor → 4-5 puan",
            "Ufak eleştiriler var → 2 puan"
          ],
          tips: [
            "PubPeer.com'da makaleyi arayın",
            "Google Scholar'da 'criticized' + makale başlığı arayın"
          ]
        },
        {
          code: "I_312",
          name: "Başarısız Replikasyon ve Çürütülme Skoru",
          description: "Makalenin bulgularının replike edilememesi veya çürütülmesi",
          type: "binary",
          normalization: "binary",
          dataSource: "Literatür taraması, Retraction Watch",
          measurementMethod: "Makalenin bulgularını çürüten veya replike edemeyen çalışmalar var mı? 1=Var, 0=Yok",
          examples: [
            "3 farklı çalışma replike edemedi → 1 (100 puan - kötü)",
            "Başarılı replikasyonlar var → 0 (0 puan - iyi)"
          ],
          tips: [
            "Retraction Watch veritabanını kontrol edin",
            "Google Scholar'da 'replication' + makale başlığı arayın"
          ]
        },
        {
          code: "I_313",
          name: "Geri Çekilme (Retraction) Durumu",
          description: "Makalenin geri çekilip çekilmediği",
          type: "binary",
          normalization: "binary",
          dataSource: "Retraction Watch",
          measurementMethod: "Makale geri çekildi mi? 1=Evet (çok kötü), 0=Hayır",
          examples: [
            "Makale geri çekildi → 1 (100 puan - çok kötü)",
            "Geri çekilmedi → 0 (0 puan - iyi)"
          ],
          tips: [
            "Retraction Watch veritabanında arama yapın",
            "Dergi web sitesinde 'retracted' etiketi var mı kontrol edin"
          ]
        }
      ]
    },
    {
      code: "SD3.2",
      name: "Yanlış Kullanım ve Suistimal Riski",
      weight: 0.30,
      indicators: [
        {
          code: "I_321",
          name: "Çarpıtılma ve Manipülasyon Potansiyeli Skoru",
          description: "Makalenin bulgularının çarpıtılma veya manipüle edilme riski (1-5 Likert, yüksek=kötü)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makalenin bulgularının yanlış anlaşılma veya kötüye kullanılma riski var mı? 1=Çok düşük risk, 5=Çok yüksek risk",
          examples: [
            "IQ ve ırk ilişkisi makalesi → yüksek çarpıtılma riski → 4-5 puan",
            "Teknik bir yöntem makalesi → düşük risk → 1-2 puan"
          ],
          tips: [
            "Sosyal ve politik açıdan hassas konular yüksek risk taşır",
            "Medyada makalenin nasıl sunulduğunu kontrol edin"
          ]
        },
        {
          code: "I_322",
          name: "Zararlı Uygulamalara Zemin Hazırlama Riski",
          description: "Makalenin bulgularının zararlı uygulamalara yol açma riski (1-5 Likert, yüksek=kötü)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi",
          measurementMethod: "Makalenin bulgularının etik olmayan veya zararlı uygulamalara yol açma riski var mı? 1=Çok düşük risk, 5=Çok yüksek risk",
          examples: [
            "Biyolojik silah geliştirmeye yönelik makale → 5 puan",
            "Temel bilim makalesi → 1 puan"
          ],
          tips: [
            "Dual-use araştırmaları (hem iyi hem kötü amaçla kullanılabilir) yüksek risk taşır",
            "Etik kurulların değerlendirmelerini inceleyin"
          ]
        },
        {
          code: "I_323",
          name: "Kanıtlanmış Yanlış Kullanım Vakaları",
          description: "Makalenin bulgularının yanlış kullanıldığına dair kanıtlanmış vakalar",
          type: "binary",
          normalization: "binary",
          dataSource: "Medya taraması, literatür",
          measurementMethod: "Makalenin bulgularının yanlış kullanıldığına dair kanıtlanmış vakalar var mı? 1=Var, 0=Yok",
          examples: [
            "Makale aşı karşıtı kampanyalarda kullanıldı → 1 (100 puan - kötü)",
            "Hiç yanlış kullanım yok → 0 (0 puan - iyi)"
          ],
          tips: [
            "Google News'te makale başlığı + 'misuse' arayın",
            "Fact-checking sitelerini kontrol edin"
          ]
        }
      ]
    },
    {
      code: "SD3.3",
      name: "Uygulama Başarısızlığı ve Olumsuz Sonuçlar",
      weight: 0.30,
      indicators: [
        {
          code: "I_331",
          name: "Uygulama Uçurumu Genişliği Skoru",
          description: "Makalenin teorideki vaatleri ile pratikteki sonuçları arasındaki boşluk (1-5 Likert, yüksek=kötü)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Uzman değerlendirmesi, literatür",
          measurementMethod: "Makalenin bulgularının pratikte uygulanması ne kadar zor? 1=Çok kolay uygulanabilir, 5=Pratikte neredeyse imkansız",
          examples: [
            "Teoride mükemmel ama pratikte çok pahalı → 4 puan",
            "Kolayca uygulanabilir → 1 puan"
          ],
          tips: [
            "Pilot uygulamaların sonuçlarını inceleyin",
            "Maliyet, altyapı ve eğitim gereksinimlerini değerlendirin"
          ]
        },
        {
          code: "I_332",
          name: "Beklenmedik Olumsuz Sonuçların Varlığı ve Şiddeti",
          description: "Makalenin bulgularının uygulanmasının beklenmedik olumsuz sonuçları (1-5 Likert, yüksek=kötü)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Literatür taraması, medya",
          measurementMethod: "Makalenin bulgularının uygulanması beklenmedik olumsuz sonuçlara yol açtı mı? 1=Hiç yok, 5=Ciddi olumsuz sonuçlar",
          examples: [
            "İlaç yan etkileri beklenenden çok daha ciddi → 5 puan",
            "Hiç olumsuz sonuç yok → 1 puan"
          ],
          tips: [
            "Klinik denemeler ve pilot uygulamaların raporlarını inceleyin",
            "Medyada 'unintended consequences' arayın"
          ]
        },
        {
          code: "I_333",
          name: "Rapor Edilmiş Başarısız Uygulama Vakaları",
          description: "Makalenin bulgularının uygulanmasının başarısız olduğuna dair raporlar",
          type: "binary",
          normalization: "binary",
          dataSource: "Literatür, medya",
          measurementMethod: "Makalenin bulgularının uygulanmasının başarısız olduğuna dair raporlar var mı? 1=Var, 0=Yok",
          examples: [
            "Birden fazla başarısız uygulama raporu → 1 (100 puan - kötü)",
            "Hiç başarısızlık raporu yok → 0 (0 puan - iyi)"
          ],
          tips: [
            "Google Scholar'da 'failed implementation' + makale başlığı arayın",
            "Sağlık alanında ClinicalTrials.gov'u kontrol edin"
          ]
        }
      ]
    }
  ]
};

// D4: Etik ve Sorumluluk
export const D4_ETHICS_RESPONSIBILITY: DimensionDefinition = {
  code: "D4",
  name: "Etik ve Sorumluluk",
  description: "Araştırmanın etik standartları",
  weight: 0.10,
  subDimensions: [
    {
      code: "SD4.1",
      name: "Araştırma Etiği Uygunluğu",
      weight: 0.60,
      indicators: [
        {
          code: "I_411",
          name: "Etik Kurul Onayı ve Standartlara Uygunluk",
          description: "Makalenin etik kurul onayı alması ve etik standartlara uygunluğu",
          type: "binary",
          normalization: "binary",
          dataSource: "Makale metni",
          measurementMethod: "Makalede etik kurul onayı belirtilmiş mi? 1=Evet, 0=Hayır",
          examples: [
            "Etik kurul onayı var → 1 (100 puan)",
            "Etik kurul onayı yok → 0 (0 puan)"
          ],
          tips: [
            "İnsan veya hayvan deneyleri içeren çalışmalarda zorunludur",
            "Makalenin 'Ethics' veya 'Methods' bölümünü kontrol edin"
          ]
        },
        {
          code: "I_412",
          name: "Bilgilendirilmiş Onam ve Denek Hakları Skoru",
          description: "Katılımcıların bilgilendirilmiş onamı ve haklarının korunması",
          type: "binary",
          normalization: "binary",
          dataSource: "Makale metni",
          measurementMethod: "Makalede bilgilendirilmiş onam süreci açıklanmış mı? 1=Evet, 0=Hayır veya N/A",
          examples: [
            "Bilgilendirilmiş onam süreci detaylı açıklanmış → 1 (100 puan)",
            "Açıklama yok veya N/A → 0 (0 puan)"
          ],
          tips: [
            "İnsan denekleri içeren çalışmalarda zorunludur",
            "Anonimlik ve gizlilik koruması da önemlidir"
          ]
        },
        {
          code: "I_413",
          name: "Çıkar Çatışması Beyanının Şeffaflığı",
          description: "Yazarların çıkar çatışması beyanının şeffaflığı",
          type: "binary",
          normalization: "binary",
          dataSource: "Makale metni",
          measurementMethod: "Makalede çıkar çatışması beyanı var mı? 1=Evet, 0=Hayır",
          examples: [
            "Çıkar çatışması beyanı var (olsun veya olmasın) → 1 (100 puan)",
            "Hiç beyan yok → 0 (0 puan)"
          ],
          tips: [
            "Çoğu dergi çıkar çatışması beyanını zorunlu tutar",
            "Makalenin son bölümünde veya acknowledgments'ta bulunur"
          ]
        }
      ]
    },
    {
      code: "SD4.2",
      name: "Şeffaflık ve Tekrarlanabilirlik",
      weight: 0.40,
      indicators: [
        {
          code: "I_421",
          name: "Veri ve Kod Paylaşımı Skoru",
          description: "Makalenin ham verilerini ve analizlerini paylaşması",
          type: "binary",
          normalization: "binary",
          dataSource: "Makale metni, GitHub, OSF",
          measurementMethod: "Makale veri ve/veya kod paylaşımı yapmış mı? 1=Evet, 0=Hayır",
          examples: [
            "GitHub'da kod ve OSF'de veri paylaşılmış → 1 (100 puan)",
            "Hiç paylaşım yok → 0 (0 puan)"
          ],
          tips: [
            "Makalede 'Data Availability' bölümünü kontrol edin",
            "GitHub, OSF, Zenodo gibi platformları arayın"
          ]
        },
        {
          code: "I_422",
          name: "Metodolojik Şeffaflık ve Detay Seviyesi",
          description: "Makalenin yöntemlerini ne kadar detaylı açıkladığı (1-5 Likert)",
          type: "qualitative",
          normalization: "linear",
          dataSource: "Makale metni",
          measurementMethod: "Makalenin 'Methods' bölümünü okuyun. Başka bir araştırmacı bu yöntemi tekrarlayabilir mi? 1=Çok belirsiz, 5=Çok detaylı",
          examples: [
            "Her adım detaylı açıklanmış, protokol paylaşılmış → 5 puan",
            "Yöntemler çok kısa ve belirsiz → 1-2 puan"
          ],
          tips: [
            "Tekrarlanabilirlik için yeterli detay önemlidir",
            "Supplementary materials'ı da kontrol edin"
          ]
        },
        {
          code: "I_423",
          name: "Ön Kayıt (Preregistration) Durumu",
          description: "Çalışmanın önceden kaydedilmesi (preregistration)",
          type: "binary",
          normalization: "binary",
          dataSource: "Makale metni, OSF, ClinicalTrials.gov",
          measurementMethod: "Çalışma önceden kaydedilmiş mi? 1=Evet, 0=Hayır",
          examples: [
            "OSF'de preregistration var → 1 (100 puan)",
            "Preregistration yok → 0 (0 puan)"
          ],
          tips: [
            "Preregistration, p-hacking ve HARKing'i önler",
            "Klinik denemeler için ClinicalTrials.gov zorunludur"
          ]
        }
      ]
    }
  ]
};

export const ALL_DIMENSIONS = [
  D1_ACADEMIC_IMPACT,
  D2_SOCIAL_PRACTICAL_IMPACT,
  D3_NEGATIVE_IMPACT,
  D4_ETHICS_RESPONSIBILITY
];

// Weights configuration
export const WEIGHTS = {
  dimensions: {
    W_A: 0.35, // Academic Impact
    W_S: 0.40, // Social & Practical Impact
    W_N: 0.15, // Negative Impact (used in penalty)
    W_E: 0.10, // Ethics (used in penalty)
  },
  sensitivityCoefficients: {
    k_E: 2, // Ethics sensitivity
    k_N: 1.5, // Negative impact sensitivity
  },
};
