# Kapsamlı Mod: Uçtan Uca Değerlendirme Kılavuzu

**Akademik Makale Etki Değerlendirmesi Sistemi**  
**Versiyon:** 2.0  
**Son Güncelleme:** Ocak 2026  
**Yazar:** Manus AI

---

## İçindekiler

1. [Giriş ve Genel Bakış](#1-giriş-ve-genel-bakış)
2. [Sistem Mimarisi ve Veri Akışı](#2-sistem-mimarisi-ve-veri-akışı)
3. [16 Boyut ve 193 Gösterge Detayları](#3-16-boyut-ve-193-gösterge-detayları)
4. [Veri Toplama Rehberi](#4-veri-toplama-rehberi)
5. [Hesaplama Metodolojisi](#5-hesaplama-metodolojisi)
6. [Zincirleme Etki Analizi](#6-zincirleme-etki-analizi)
7. [Çarpan Katsayıları](#7-çarpan-katsayıları)
8. [Ağ Etkileri ve Geri Besleme Döngüleri](#8-ağ-etkileri-ve-geri-besleme-döngüleri)
9. [Doğrulama ve Kontrol Listeleri](#9-doğrulama-ve-kontrol-listeleri)
10. [Gerçek Dünya Örnekleri](#10-gerçek-dünya-örnekleri)
11. [Sık Sorulan Sorular](#11-sık-sorulan-sorular)

---

## 1. Giriş ve Genel Bakış

### 1.1 Kapsamlı Mod Nedir?

Kapsamlı Mod, akademik makalelerin gerçek dünya etkisini **16 boyut** ve **193 gösterge** üzerinden değerlendiren gelişmiş bir analiz sistemidir. Hızlı Mod'un (37 gösterge, 4 boyut) ötesine geçerek, bir araştırmanın ekonomik, sağlık, çevresel, politik, teknolojik ve sosyal etkilerini zincirleme etki analizi ile birlikte değerlendirir.

### 1.2 Ne Zaman Kapsamlı Mod Kullanılmalı?

Kapsamlı Mod aşağıdaki durumlarda önerilir:

| Durum | Açıklama |
|-------|----------|
| **Büyük Ölçekli Araştırmalar** | Milyonlarca dolarlık bütçeye sahip, çok yıllık projeler |
| **Politika Etkisi Beklenen Çalışmalar** | Yasa veya düzenleme değişikliği potansiyeli olan araştırmalar |
| **Disiplinlerarası Projeler** | Birden fazla alanı etkileyen, geniş kapsamlı çalışmalar |
| **Endüstri İşbirliği** | Ticari uygulama veya teknoloji transferi potansiyeli olan araştırmalar |
| **Toplumsal Etki Odaklı Çalışmalar** | Sağlık, çevre veya sosyal adalet konularında doğrudan etki hedefleyen projeler |

### 1.3 Değerlendirme Süreci Özeti

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KAPSAMLI MOD DEĞERLENDİRME AKIŞI                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. MAKALE BİLGİLERİ           2. BOYUT DEĞERLENDİRME              │
│  ┌─────────────────┐           ┌─────────────────┐                 │
│  │ • Başlık        │           │ D1-D4: Temel    │                 │
│  │ • Yazarlar      │    ──►    │ D5-D12: Genişl. │                 │
│  │ • DOI/Yıl       │           │ D13-D16: İleri  │                 │
│  │ • PDF Yükleme   │           │ (16 boyut)      │                 │
│  └─────────────────┘           └─────────────────┘                 │
│           │                            │                            │
│           ▼                            ▼                            │
│  3. ZİNCİRLEME ETKİ ANALİZİ    4. HIS HESAPLAMA                    │
│  ┌─────────────────┐           ┌─────────────────┐                 │
│  │ • 5 Seviye      │           │ • Ağırlıklı     │                 │
│  │ • Çarpanlar     │    ──►    │   Toplam        │                 │
│  │ • Ağ Etkileri   │           │ • Cascade Amp.  │                 │
│  │ • Geri Besleme  │           │ • Final Skor    │                 │
│  └─────────────────┘           └─────────────────┘                 │
│           │                            │                            │
│           └────────────────────────────┘                            │
│                        │                                            │
│                        ▼                                            │
│              5. RAPOR VE GÖRSELLEŞTIRME                            │
│              ┌─────────────────────────┐                           │
│              │ • HIS Skoru             │                           │
│              │ • Boyut Grafikleri      │                           │
│              │ • Cascade Akış Şeması   │                           │
│              │ • Excel/PDF Export      │                           │
│              └─────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 Tahmini Süre

Kapsamlı Mod değerlendirmesi **30-45 dakika** sürer. Bu süre şunları içerir:

- **Makale Bilgileri:** 5 dakika (PDF yükleme ile otomatik doldurma)
- **16 Boyut Değerlendirme:** 20-30 dakika (her boyut için 1-2 dakika)
- **Sonuç İnceleme:** 5-10 dakika (rapor ve görselleştirme)

---

## 2. Sistem Mimarisi ve Veri Akışı

### 2.1 Veri Akış Diyagramı

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VERİ AKIŞ DİYAGRAMI                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  KULLANICI GİRİŞİ                                                  │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Makale Bilgileri + 16 Boyut Skorları (D1-D16)          │       │
│  │ [0-100 arası slider değerleri]                          │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  FRONTEND (React + TypeScript)                                     │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ ComprehensiveEvaluation.tsx                             │       │
│  │ • Slider state yönetimi                                 │       │
│  │ • Form validasyonu                                      │       │
│  │ • D1-D16 skorlarını backend'e gönderme                  │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  BACKEND (Express + tRPC)                                          │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ server/routers.ts - evaluations.create mutation         │       │
│  │                                                         │       │
│  │ 1. D1-D16 skorlarını al                                 │       │
│  │ 2. Mod tespiti (D5+ varsa → comprehensive)              │       │
│  │ 3. Cascade çarpanları hesapla:                          │       │
│  │    - calculateCascadeMultipliersFromDimensions()        │       │
│  │ 4. HIS hesapla:                                         │       │
│  │    - calculateHIS(mode, scores, cascadeMultiplier)      │       │
│  │ 5. Veritabanına kaydet                                  │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  VERİTABANI (PostgreSQL)                                           │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ evaluations tablosu                                     │       │
│  │ • D1-D16: REAL (boyut skorları)                         │       │
│  │ • HIS: REAL (hesaplanmış skor)                          │       │
│  │ • cascadeMultiplier: REAL                               │       │
│  │ • economicMultiplier: REAL                              │       │
│  │ • socialMultiplier: REAL                                │       │
│  │ • scientificMultiplier: REAL                            │       │
│  │ • environmentalMultiplier: REAL                         │       │
│  │ • networkEffectScore: REAL                              │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Hesaplama Modülleri

| Modül | Dosya | İşlev |
|-------|-------|-------|
| **Ağırlıklandırma** | `shared/weightingSystem.ts` | 16 boyut ağırlıkları, HIS hesaplama |
| **Cascade Engine** | `server/cascadeEngine.ts` | Zincirleme etki, çarpan katsayıları |
| **Normalizasyon** | `shared/calculations.ts` | Logaritmik, lineer, ikili normalizasyon |
| **Boyut Tanımları** | `shared/comprehensiveDimensions.ts` | 16 boyut konfigürasyonu |
| **Gösterge Tanımları** | `shared/indicators.ts` + `extendedIndicators*.ts` | 193 gösterge detayları |

---

## 3. 16 Boyut ve 193 Gösterge Detayları

### 3.1 Boyut Özeti Tablosu

| Kod | Boyut Adı | Ağırlık | Gösterge Sayısı | Açıklama |
|-----|-----------|---------|-----------------|----------|
| **D1** | Akademik Etki | 0.20 | 11 | Atıf, metodoloji, disiplinlerarası etki |
| **D2** | Toplumsal ve Pratik Etki | 0.20 | 11 | Politika, endüstri, medya etkisi |
| **D3** | Negatif Etki ve Risk | 0.10 | 9 | Çevresel, etik, kötüye kullanım riskleri |
| **D4** | Etik ve Sorumluluk | 0.10 | 6 | Etik standartlar, açık bilim |
| **D5** | Ekonomik Etki | 0.08 | 15 | GSYİH, istihdam, yatırım |
| **D6** | Sağlık Etkisi | 0.08 | 12 | QALY, mortalite, sağlık sistemi |
| **D7** | Çevresel Etki | 0.06 | 14 | İklim, enerji, biyoçeşitlilik |
| **D8** | Politik ve Yasal Etki | 0.04 | 10 | Yasa, politika, düzenleme |
| **D9** | Teknolojik Etki | 0.04 | 13 | Teknoloji transferi, inovasyon |
| **D10** | Sosyal ve Kültürel Etki | 0.03 | 15 | Davranış, sosyal adalet, kültür |
| **D11** | Eğitim Etkisi | 0.03 | 10 | Müfredat, öğrenci başarısı |
| **D12** | Dijital ve Medya Etkisi | 0.02 | 12 | Dijital içerik, sosyal medya |
| **D13** | Güvenlik ve Savunma Etkisi | 0.02 | 8 | Ulusal güvenlik, kamu güvenliği |
| **D14** | Psikolojik ve Refah Etkisi | 0.02 | 10 | Mental sağlık, yaşam memnuniyeti |
| **D15** | Uluslararası İşbirliği | 0.02 | 12 | Araştırma ağları, bilim diplomasisi |
| **D16** | Zincirleme ve Çarpan Etkileri | 0.02 | 15 | Cascade, ağ etkileri, geri besleme |
| | **TOPLAM** | **1.00** | **193** | |

### 3.2 Temel Boyutlar (D1-D4) - Detaylı Açıklama

#### D1: Akademik Etki (Ağırlık: 0.20)

Bu boyut, makalenin bilimsel topluluk içindeki etkisini ölçer. 11 gösterge üç alt boyutta gruplandırılmıştır:

**SD1.1: Atıf Tabanlı Etki (4 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Normalize Edilmiş Atıf Skoru | I_111 | Web of Science, Scopus | Logaritmik normalizasyon |
| Atıf Yapan Kaynakların Kalitesi | I_112 | Uzman değerlendirmesi | 1-5 Likert |
| Disiplinlerarası Atıf Çeşitliliği | I_113 | WoS kategorileri | 1-5 Likert |
| Atıf Bağlamı | I_114 | Metin analizi | 1-5 Likert |

**SD1.2: Alternatif ve Medya Etkisi (4 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Altmetric Attention Score | I_121 | Altmetric.com | Logaritmik normalizasyon |
| Medya Görünürlüğü | I_122 | Google News | 1-5 Likert |
| Wikipedia Etkisi | I_123 | Wikipedia | İkili (0/1) |
| Sosyal Medya Tartışma Derinliği | I_124 | Twitter, Reddit | 1-5 Likert |

**SD1.3: Düşünsel ve Kavramsal Katkı (3 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Paradigma Değişimi Potansiyeli | I_131 | Uzman değerlendirmesi | 1-5 Likert |
| Yeni Araştırma Alanı Yaratma | I_132 | Uzman değerlendirmesi | 1-5 Likert |
| Metodolojik/Teorik Yenilik | I_133 | Uzman değerlendirmesi | 1-5 Likert |

#### D2: Toplumsal ve Pratik Etki (Ağırlık: 0.20)

Bu boyut, makalenin akademi dışındaki etkisini ölçer. 11 gösterge üç alt boyutta gruplandırılmıştır:

**SD2.1: Politika Etkisi (4 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Politika Dokümanlarında Atıf | I_211 | Overton, policy briefs | Sayım |
| Politika Değişikliği Etkisi | I_212 | Uzman değerlendirmesi | 1-5 Likert |
| Politika Yapıcılarla İletişim | I_213 | Uzman değerlendirmesi | 1-5 Likert |
| Uluslararası Politika Etkisi | I_214 | UN, WHO raporları | 1-5 Likert |

**SD2.2: Endüstri ve Ticari Etki (4 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Patent Atıfları | I_221 | Google Patents, USPTO | Sayım |
| Endüstri İşbirliği | I_222 | Uzman değerlendirmesi | 1-5 Likert |
| Ticari Ürün/Hizmet Geliştirme | I_223 | Uzman değerlendirmesi | 1-5 Likert |
| Spin-off Şirket Oluşumu | I_224 | Uzman değerlendirmesi | İkili (0/1) |

**SD2.3: Toplumsal Fayda (3 gösterge)**

| Gösterge | Kod | Veri Kaynağı | Ölçüm Yöntemi |
|----------|-----|--------------|---------------|
| Toplumsal Sorun Çözümü | I_231 | Uzman değerlendirmesi | 1-5 Likert |
| Kamu Sağlığı Etkisi | I_232 | Uzman değerlendirmesi | 1-5 Likert |
| Çevresel Sürdürülebilirlik | I_233 | Uzman değerlendirmesi | 1-5 Likert |

#### D3: Negatif Etki ve Risk (Ağırlık: 0.10)

Bu boyut, makalenin potansiyel olumsuz etkilerini ölçer. **Yüksek skor daha fazla risk anlamına gelir** ve HIS hesaplamasında ters çevrilir.

| Gösterge | Kod | Risk Türü |
|----------|-----|-----------|
| Çevresel Zarar Potansiyeli | I_311 | Çevresel |
| Etik İhlal Riski | I_312 | Etik |
| Kötüye Kullanım Potansiyeli | I_313 | Güvenlik |
| Sosyal Eşitsizlik Artırma | I_314 | Sosyal |
| Ekonomik Zarar Potansiyeli | I_315 | Ekonomik |
| Sağlık Riski | I_316 | Sağlık |
| Gizlilik İhlali Riski | I_317 | Gizlilik |
| Yanlış Bilgi Yayma Riski | I_318 | Bilgi |
| Teknolojik Bağımlılık Riski | I_319 | Teknoloji |

#### D4: Etik ve Sorumluluk (Ağırlık: 0.10)

Bu boyut, makalenin etik standartlara uygunluğunu ölçer.

| Gösterge | Kod | Değerlendirme Kriteri |
|----------|-----|----------------------|
| Etik Kurul Onayı | I_411 | Onay belgesi mevcut mu? |
| Veri Şeffaflığı | I_412 | Veriler paylaşılmış mı? |
| Metodolojik Şeffaflık | I_413 | Yöntemler detaylı mı? |
| Çıkar Çatışması Beyanı | I_414 | Beyan yapılmış mı? |
| Açık Erişim | I_415 | Makale açık erişimli mi? |
| Tekrarlanabilirlik | I_416 | Çalışma tekrarlanabilir mi? |

### 3.3 Genişletilmiş Boyutlar (D5-D16) - Özet

#### D5: Ekonomik Etki (15 gösterge)

Makalenin ekonomi üzerindeki etkisini ölçer: GSYİH katkısı, istihdam yaratma, yatırım çekme, pazar oluşturma, verimlilik artışı.

**Anahtar Göstergeler:**
- GSYİH Katkısı (I_511): Araştırmanın ekonomiye doğrudan katkısı
- İstihdam Yaratma (I_512): Oluşturulan iş sayısı
- Yatırım Çekme (I_513): Çekilen yatırım miktarı
- Pazar Büyüklüğü (I_514): Oluşturulan/etkilenen pazar değeri

#### D6: Sağlık Etkisi (12 gösterge)

Makalenin sağlık sonuçları üzerindeki etkisini ölçer: QALY/DALY iyileşmesi, mortalite azalması, hastalık önleme, sağlık sistemi verimliliği.

**Anahtar Göstergeler:**
- QALY Kazanımı (I_611): Kaliteye ayarlanmış yaşam yılı artışı
- Mortalite Azalması (I_612): Ölüm oranlarındaki düşüş
- Hastalık Önleme (I_613): Önlenen vaka sayısı
- Tedavi Maliyeti Düşüşü (I_614): Sağlık harcamalarındaki tasarruf

#### D7: Çevresel Etki (14 gösterge)

Makalenin çevre üzerindeki etkisini ölçer: karbon emisyonu, enerji verimliliği, biyoçeşitlilik, kirlilik azaltma.

**Anahtar Göstergeler:**
- Karbon Emisyonu Azalması (I_711): CO2 eşdeğeri azalma
- Enerji Verimliliği (I_712): Enerji tasarrufu yüzdesi
- Biyoçeşitlilik Korunması (I_713): Korunan tür sayısı
- Atık Azaltma (I_714): Azaltılan atık miktarı

#### D8-D16: Diğer Boyutlar

| Boyut | Odak Alanı | Örnek Göstergeler |
|-------|------------|-------------------|
| D8: Politik/Yasal | Yasa değişikliği, politika oluşturma | Yasa etkisi, düzenleme değişikliği |
| D9: Teknolojik | Teknoloji transferi, inovasyon | Patent, spin-off, platform oluşturma |
| D10: Sosyal/Kültürel | Davranış değişikliği, sosyal adalet | Norm değişimi, eşitsizlik azalması |
| D11: Eğitim | Müfredat, öğrenci başarısı | Ders kitabı entegrasyonu, öğrenme sonuçları |
| D12: Dijital/Medya | Dijital içerik, sosyal medya | Viral yayılım, platform kullanımı |
| D13: Güvenlik | Ulusal güvenlik, kamu güvenliği | Savunma teknolojisi, suç önleme |
| D14: Psikolojik | Mental sağlık, yaşam memnuniyeti | İyi oluş, mutluluk artışı |
| D15: Uluslararası | Araştırma işbirliği, diplomasi | Ağ genişliği, bilgi transferi |
| D16: Zincirleme | Cascade, ağ etkileri | Çarpan katsayıları, geri besleme |

---

## 4. Veri Toplama Rehberi

### 4.1 Veri Kaynakları Tablosu

| Veri Türü | Birincil Kaynak | İkincil Kaynak | Erişim Yöntemi |
|-----------|-----------------|----------------|----------------|
| **Atıf Verileri** | Web of Science | Scopus, Google Scholar | API veya manuel sorgu |
| **Altmetric** | Altmetric.com | PlumX | API veya web arayüzü |
| **Patent** | Google Patents | USPTO, EPO | API veya manuel arama |
| **Politika** | Overton | Policy briefs, UN raporları | Web arama |
| **Medya** | Google News | Altmetric.com | Web arama |
| **Ekonomik** | World Bank | OECD, IMF | DataBank API |
| **Sağlık** | WHO | CDC, PubMed | API veya raporlar |
| **Çevresel** | EPA | IPCC, UNEP | Raporlar |

### 4.2 Boyut Bazlı Veri Toplama

#### D1: Akademik Etki - Veri Toplama Adımları

1. **Atıf Sayısı (I_111)**
   - Web of Science'a gidin: https://www.webofscience.com
   - DOI veya başlık ile makaleyi arayın
   - "Times Cited" değerini not edin
   - Aynı yıl ve kategorideki maksimum atıfı bulun (karşılaştırma için)
   - Formül: `Score = 100 × (log(1 + atıf) / log(1 + max_atıf))`

2. **Altmetric Score (I_121)**
   - Altmetric.com'a gidin: https://www.altmetric.com/explorer
   - DOI ile makaleyi arayın
   - "Attention Score" değerini not edin
   - Formül: `Score = 100 × (log(1 + altmetric) / log(1 + 1000))`

3. **Wikipedia Etkisi (I_123)**
   - Altmetric.com'da "Wikipedia" sekmesini kontrol edin
   - Veya Wikipedia'da makale DOI'sini arayın
   - Referans varsa: 100 puan, yoksa: 0 puan

#### D5: Ekonomik Etki - Veri Toplama Adımları

1. **GSYİH Katkısı (I_511)**
   - Araştırmanın ekonomik değerlendirme raporlarını arayın
   - Endüstri raporlarını inceleyin
   - Yoksa uzman tahmini kullanın (1-5 Likert)

2. **İstihdam Yaratma (I_512)**
   - Spin-off şirketlerin çalışan sayısını araştırın
   - Endüstri uygulamalarından kaynaklanan istihdamı tahmin edin
   - Yoksa uzman tahmini kullanın (1-5 Likert)

### 4.3 Uzman Değerlendirmesi Rehberi

Birçok gösterge için uzman değerlendirmesi gerekir. Aşağıdaki Likert ölçeğini kullanın:

| Puan | Anlam | Açıklama |
|------|-------|----------|
| 1 | Çok Düşük | Neredeyse hiç etki yok |
| 2 | Düşük | Minimal etki, sınırlı kanıt |
| 3 | Orta | Belirgin etki, bazı kanıtlar mevcut |
| 4 | Yüksek | Önemli etki, güçlü kanıtlar |
| 5 | Çok Yüksek | Olağanüstü etki, kapsamlı kanıtlar |

**Değerlendirme İpuçları:**
- Objektif olun, kişisel önyargılardan kaçının
- Mümkünse birden fazla uzmanın görüşünü alın
- Kanıtları belgeleyin (kaynak, tarih, bağlam)
- Belirsizlik durumunda orta değer (3) kullanın

---

## 5. Hesaplama Metodolojisi

### 5.1 Normalizasyon Fonksiyonları

Sistemde üç tür normalizasyon kullanılır:

#### 5.1.1 Logaritmik Normalizasyon

Çarpık dağılımlı nicel veriler için (atıf sayısı, patent sayısı vb.)

```
Score = 100 × (log(1 + değer) / log(1 + max_değer))
```

**Örnek:**
- Atıf sayısı: 120
- Maksimum atıf (aynı yıl/alan): 500
- Score = 100 × (log(121) / log(501)) = 100 × (2.08 / 2.70) = **77.0**

#### 5.1.2 Lineer Normalizasyon

Likert ölçeği (1-5) için

```
Score = ((değer - min) / (max - min)) × 100
```

**Örnek:**
- Likert değeri: 4
- Min: 1, Max: 5
- Score = ((4 - 1) / (5 - 1)) × 100 = **75.0**

#### 5.1.3 İkili Normalizasyon

Evet/Hayır göstergeleri için

```
Score = değer × 100  (değer: 0 veya 1)
```

**Örnek:**
- Wikipedia referansı var mı? Evet (1)
- Score = 1 × 100 = **100.0**

### 5.2 Boyut Skoru Hesaplama

Her boyut skoru, gösterge skorlarının ağırlıklı ortalamasıdır:

```
Boyut_Skoru = Σ(Gösterge_Skoru × Gösterge_Ağırlığı)
```

**Örnek D1 Hesaplama:**
- I_111 (Atıf): 77.0, Ağırlık: 0.15
- I_112 (Kalite): 75.0, Ağırlık: 0.10
- I_121 (Altmetric): 60.0, Ağırlık: 0.12
- ...

D1 = (77.0 × 0.15) + (75.0 × 0.10) + (60.0 × 0.12) + ... = **68.5**

### 5.3 HIS (Bütünsel Etki Skoru) Hesaplama

#### 5.3.1 Hızlı Mod Formülü (4 boyut)

```
RIS = (W_A × D1) + (W_S × D2)
M_E = (D4 / 100)^k_E
M_N = (1 - D3 / 100)^k_N
HIS = RIS × M_E × M_N
```

Burada:
- W_A = 0.35 (Akademik ağırlık)
- W_S = 0.35 (Sosyal ağırlık)
- k_E = 0.5 (Etik hassasiyet katsayısı)
- k_N = 0.3 (Negatif etki hassasiyet katsayısı)

#### 5.3.2 Kapsamlı Mod Formülü (16 boyut)

```
Base_HIS = Σ(Di × Wi) / Σ(Wi)

Not: D3 (Negatif Etki) ters çevrilir: (100 - D3)

Cascade_Amplified_HIS = Base_HIS × Cascade_Multiplier

Final_HIS = min(Cascade_Amplified_HIS, 100)
```

**Ağırlıklar (Wi):**

| Boyut | Ağırlık |
|-------|---------|
| D1, D2 | 0.20 |
| D3, D4 | 0.10 |
| D5, D6 | 0.08 |
| D7 | 0.06 |
| D8, D9 | 0.04 |
| D10, D11 | 0.03 |
| D12-D16 | 0.02 |
| **Toplam** | **1.00** |

**Örnek Hesaplama:**

| Boyut | Skor | Ağırlık | Katkı |
|-------|------|---------|-------|
| D1 | 70 | 0.20 | 14.0 |
| D2 | 65 | 0.20 | 13.0 |
| D3 | 30 (→70) | 0.10 | 7.0 |
| D4 | 80 | 0.10 | 8.0 |
| D5 | 60 | 0.08 | 4.8 |
| D6 | 55 | 0.08 | 4.4 |
| D7 | 50 | 0.06 | 3.0 |
| D8 | 45 | 0.04 | 1.8 |
| D9 | 70 | 0.04 | 2.8 |
| D10 | 40 | 0.03 | 1.2 |
| D11 | 35 | 0.03 | 1.05 |
| D12 | 50 | 0.02 | 1.0 |
| D13 | 30 | 0.02 | 0.6 |
| D14 | 45 | 0.02 | 0.9 |
| D15 | 55 | 0.02 | 1.1 |
| D16 | 60 | 0.02 | 1.2 |
| **Toplam** | | **1.00** | **65.85** |

Base_HIS = 65.85

Cascade_Multiplier = 1.25 (hesaplanmış)

Final_HIS = min(65.85 × 1.25, 100) = **82.3**

---

## 6. Zincirleme Etki Analizi

### 6.1 Zincirleme Etki Nedir?

Zincirleme etki (cascade effect), bir araştırmanın doğrudan etkisinin ötesinde, dolaylı ve uzun vadeli etkilerini ifade eder. Her seviye, bir önceki seviyenin sonucu olarak ortaya çıkar.

### 6.2 5 Seviye Zincirleme Etki Modeli

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ZİNCİRLEME ETKİ MODELİ                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SEVİYE 1: BİRİNCİL ETKİ (100%)                                    │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Araştırmanın doğrudan sonuçları                         │       │
│  │ Örnek: Yeni bir ilaç molekülü keşfedildi                │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  SEVİYE 2: İKİNCİL ETKİ (85%)                                      │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Birincil etkinin doğrudan sonuçları                     │       │
│  │ Örnek: İlaç şirketi bu ilacı üretiyor → istihdam        │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  SEVİYE 3: ÜÇÜNCÜL ETKİ (70%)                                      │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ İkincil etkinin sonuçları                               │       │
│  │ Örnek: Hastalar iyileşiyor → işgücüne dönüyorlar        │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  SEVİYE 4: DÖRDÜNCÜL ETKİ (55%)                                    │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Üçüncül etkinin sonuçları                               │       │
│  │ Örnek: Sağlık sistemi tasarrufu → başka alanlara yatırım│       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│                              ▼                                      │
│  SEVİYE 5: BEŞİNCİL ETKİ (40%)                                     │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Dördüncül etkinin sonuçları                             │       │
│  │ Örnek: Araştırma yöntemleri başka hastalıklara uygulanır│       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 Decay (Azalma) Modeli

Her seviyede etki %15 azalır:

```
Seviye_Etkisi = Temel_Etki × (0.85)^(seviye-1)
```

| Seviye | Decay Faktörü | Etki Yüzdesi |
|--------|---------------|--------------|
| 1 | 1.00 | 100% |
| 2 | 0.85 | 85% |
| 3 | 0.72 | 72% |
| 4 | 0.61 | 61% |
| 5 | 0.52 | 52% |

### 6.4 Hesaplama Formülü

```javascript
function calculate5LevelCascade(dimensionScores) {
  // Tüm boyutların ortalaması (D3 ters çevrilir)
  const allScores = [
    D1, D2, (100 - D3), D4, D5, D6, D7, D8, 
    D9, D10, D11, D12, D13, D14, D15
  ];
  const baseScore = average(allScores);
  
  return {
    level1: baseScore,           // 100% - Birincil
    level2: baseScore * 0.85,    // 85%  - İkincil
    level3: baseScore * 0.72,    // 72%  - Üçüncül
    level4: baseScore * 0.61,    // 61%  - Dördüncül
    level5: baseScore * 0.52     // 52%  - Beşincil
  };
}
```

---

## 7. Çarpan Katsayıları

### 7.1 Çarpan Türleri

Sistem dört tür çarpan katsayısı hesaplar:

| Çarpan Türü | Aralık | Hesaplama Kaynağı | Açıklama |
|-------------|--------|-------------------|----------|
| **Ekonomik** | 1.5x - 5.0x | D5 (Ekonomik Etki) | Her 1$ yatırım → X$ değer |
| **Sosyal** | 2.0x - 10.0x | D2 + D10 | Doğrudan faydalanan başına X dolaylı faydalanan |
| **Bilimsel** | 10x - 1000x | D1 + D9 | 1 öncü makale → X takip makalesi |
| **Çevresel** | 1.5x - 4.0x | D7 | Çevresel etki çarpanı |

### 7.2 Çarpan Hesaplama Formülleri

#### 7.2.1 Ekonomik Çarpan

```
economicMultiplier = 1.5 + (D5 / 100) × 3.5
```

| D5 Skoru | Ekonomik Çarpan |
|----------|-----------------|
| 0 | 1.5x |
| 25 | 2.4x |
| 50 | 3.3x |
| 75 | 4.1x |
| 100 | 5.0x |

**Örnek:** Bir araştırma 1 milyon $ yatırım aldı ve D5 skoru 60 ise:
- Ekonomik çarpan = 1.5 + (60/100) × 3.5 = 3.6x
- Toplam ekonomik değer = 1M × 3.6 = **3.6 milyon $**

#### 7.2.2 Sosyal Çarpan

```
socialScore = (D2 + D10) / 2
socialMultiplier = 2.0 + (socialScore / 100) × 8.0
```

| Sosyal Skor | Sosyal Çarpan |
|-------------|---------------|
| 0 | 2.0x |
| 25 | 4.0x |
| 50 | 6.0x |
| 75 | 8.0x |
| 100 | 10.0x |

**Örnek:** Bir sağlık müdahalesi 10,000 kişiyi doğrudan etkiledi ve sosyal skor 70 ise:
- Sosyal çarpan = 2.0 + (70/100) × 8.0 = 7.6x
- Dolaylı faydalanan = 10,000 × 7.6 = **76,000 kişi**

#### 7.2.3 Bilimsel Çarpan (Logaritmik)

```
scientificScore = (D1 + D9) / 2
scientificMultiplier = 10 × 10^((scientificScore / 100) × 2)
```

| Bilimsel Skor | Bilimsel Çarpan |
|---------------|-----------------|
| 0 | 10x |
| 25 | 32x |
| 50 | 100x |
| 75 | 316x |
| 100 | 1000x |

**Örnek:** Bir öncü makale yayınlandı ve bilimsel skor 80 ise:
- Bilimsel çarpan = 10 × 10^(0.8 × 2) = 10 × 10^1.6 = **398x**
- Beklenen takip makalesi = 1 × 398 = **398 makale**

#### 7.2.4 Çevresel Çarpan

```
environmentalMultiplier = 1.5 + (D7 / 100) × 2.5
```

| D7 Skoru | Çevresel Çarpan |
|----------|-----------------|
| 0 | 1.5x |
| 25 | 2.1x |
| 50 | 2.8x |
| 75 | 3.4x |
| 100 | 4.0x |

### 7.3 Toplam Cascade Çarpanı

Tüm çarpanlar birleştirilerek toplam cascade çarpanı hesaplanır:

```
cascadeMultiplier = min(
  (economicMultiplier × 0.25) +
  (socialMultiplier × 0.25) +
  (min(scientificMultiplier, 100) × 0.01) +
  (environmentalMultiplier × 0.15) +
  ((1 + networkEffectScore / 100) × 0.34),
  10.0  // Maksimum 10x ile sınırlandırılır
)
```

---

## 8. Ağ Etkileri ve Geri Besleme Döngüleri

### 8.1 Ağ Etkileri (Network Effects)

Ağ etkileri, bir ürün veya hizmetin değerinin kullanıcı sayısı arttıkça artmasını ifade eder. Metcalfe Yasası'na göre, bir ağın değeri kullanıcı sayısının karesiyle orantılıdır.

**Sistemdeki Uygulama:**

```
networkEffectScore = (avgNetworkScore / 100)^1.5 × 100
```

Burada `avgNetworkScore` şu boyutların ortalamasıdır:
- D9 (Teknolojik Etki)
- D12 (Dijital ve Medya Etkisi)
- D15 (Uluslararası İşbirliği)

**Örnek:**
- D9 = 70, D12 = 60, D15 = 50
- avgNetworkScore = (70 + 60 + 50) / 3 = 60
- networkEffectScore = (60/100)^1.5 × 100 = 0.465 × 100 = **46.5**

### 8.2 Geri Besleme Döngüleri

#### 8.2.1 Pozitif Geri Besleme (Self-Reinforcing)

Kendini güçlendiren döngüler, etkinin zamanla artmasına neden olur.

**Örnek:** Platform oluşturma
- Daha fazla kullanıcı → Daha fazla içerik → Daha fazla kullanıcı

#### 8.2.2 Negatif Geri Besleme (Balancing)

Dengeleyici döngüler, etkinin zamanla azalmasına veya stabilize olmasına neden olur.

**Örnek:** Pazar doygunluğu
- Daha fazla rakip → Fiyat düşüşü → Kar azalması → Yatırım azalması

#### 8.2.3 Gecikmeli Geri Besleme (Delayed)

Etkinin gecikmeli olarak ortaya çıkması.

**Örnek:** "Sleeping Beauty" makaleler
- Yayınlandıktan yıllar sonra keşfedilen ve atıf almaya başlayan makaleler

### 8.3 Geri Besleme Hesaplama

```javascript
feedbackAdjustment = 1 + 
  (positiveFeedback / 200) -    // Pozitif etki: +%50'ye kadar
  (negativeFeedback / 400) +    // Negatif etki: -%25'e kadar
  (delayedFeedback / 300)       // Gecikmeli etki: +%33'e kadar
```

---

## 9. Doğrulama ve Kontrol Listeleri

### 9.1 Veri Toplama Kontrol Listesi

| Adım | Kontrol | Tamamlandı |
|------|---------|------------|
| 1 | Makale DOI doğrulandı | ☐ |
| 2 | Atıf verileri en az 2 kaynaktan alındı | ☐ |
| 3 | Altmetric skoru kontrol edildi | ☐ |
| 4 | Patent atıfları araştırıldı | ☐ |
| 5 | Politika dokümanları tarandı | ☐ |
| 6 | Medya görünürlüğü değerlendirildi | ☐ |
| 7 | Ekonomik etki verileri toplandı | ☐ |
| 8 | Sağlık etki verileri toplandı | ☐ |
| 9 | Çevresel etki verileri toplandı | ☐ |
| 10 | Uzman değerlendirmeleri tamamlandı | ☐ |

### 9.2 Hesaplama Doğrulama Kontrol Listesi

| Adım | Kontrol | Beklenen Aralık |
|------|---------|-----------------|
| 1 | Tüm gösterge skorları 0-100 arasında | 0 ≤ skor ≤ 100 |
| 2 | Boyut ağırlıkları toplamı 1.00 | Σ(Wi) = 1.00 |
| 3 | D3 (Negatif Etki) ters çevrildi | 100 - D3 |
| 4 | Ekonomik çarpan aralığı | 1.5 ≤ x ≤ 5.0 |
| 5 | Sosyal çarpan aralığı | 2.0 ≤ x ≤ 10.0 |
| 6 | Bilimsel çarpan aralığı | 10 ≤ x ≤ 1000 |
| 7 | Çevresel çarpan aralığı | 1.5 ≤ x ≤ 4.0 |
| 8 | Cascade çarpanı maksimum 10x | x ≤ 10.0 |
| 9 | Final HIS maksimum 100 | HIS ≤ 100 |

### 9.3 Sonuç Yorumlama Kontrol Listesi

| HIS Aralığı | Yorum | Aksiyon |
|-------------|-------|---------|
| 0-20 | Çok Düşük Etki | Araştırma stratejisini gözden geçirin |
| 21-40 | Düşük Etki | Yaygınlaştırma faaliyetlerini artırın |
| 41-60 | Orta Etki | Belirli alanlarda iyileştirme yapın |
| 61-80 | Yüksek Etki | Başarılı, sürdürülebilirliği sağlayın |
| 81-100 | Çok Yüksek Etki | Olağanüstü, model olarak paylaşın |

---

## 10. Gerçek Dünya Örnekleri

### 10.1 Örnek 1: İlaç Geliştirme Araştırması

**Makale:** "Novel mRNA Vaccine Platform for Infectious Diseases"

#### Boyut Skorları

| Boyut | Skor | Gerekçe |
|-------|------|---------|
| D1 | 85 | 5000+ atıf, Nature'da yayın, paradigma değiştirici |
| D2 | 90 | COVID-19 aşısına dönüştü, milyarlarca doz |
| D3 | 25 | Düşük risk, güvenlik profili iyi |
| D4 | 95 | Etik onay, açık veri, şeffaf süreç |
| D5 | 95 | 100+ milyar $ pazar, 100,000+ istihdam |
| D6 | 98 | Milyonlarca hayat kurtarıldı, QALY artışı |
| D7 | 60 | Soğuk zincir gereksinimi, atık yönetimi |
| D8 | 85 | Acil kullanım onayları, düzenlemeler |
| D9 | 90 | mRNA teknolojisi yaygınlaştı, yeni platformlar |
| D10 | 70 | Aşı tereddüdü tartışmaları, sosyal etki |
| D11 | 75 | Tıp eğitimi müfredatına girdi |
| D12 | 95 | Viral yayılım, sürekli medya ilgisi |
| D13 | 60 | Biyogüvenlik tartışmaları |
| D14 | 65 | Pandemi kaygısı azalması |
| D15 | 85 | Küresel işbirliği, COVAX |
| D16 | 90 | Güçlü zincirleme etkiler |

#### Zincirleme Etki Analizi

**Seviye 1 - Birincil Etki:**
- mRNA aşı teknolojisi geliştirildi
- Klinik denemeler başarıyla tamamlandı

**Seviye 2 - İkincil Etki:**
- Pfizer/BioNTech ve Moderna aşıları üretildi
- 10+ milyar doz üretildi
- 100,000+ kişi istihdam edildi

**Seviye 3 - Üçüncül Etki:**
- Milyonlarca hayat kurtarıldı
- Ekonomiler yeniden açıldı
- Seyahat ve turizm canlandı

**Seviye 4 - Dördüncül Etki:**
- Sağlık sistemleri rahatladı
- Diğer hastalıklar için mRNA araştırmaları hızlandı
- Kanser aşıları geliştirilmeye başlandı

**Seviye 5 - Beşincil Etki:**
- mRNA teknolojisi diğer alanlara uygulandı
- Kişiselleştirilmiş tıp gelişti
- Yeni biyoteknoloji şirketleri kuruldu

#### Çarpan Katsayıları

| Çarpan | Değer | Açıklama |
|--------|-------|----------|
| Ekonomik | 4.8x | 1$ Ar-Ge → 4.8$ ekonomik değer |
| Sosyal | 9.2x | 1 doğrudan faydalanan → 9.2 dolaylı faydalanan |
| Bilimsel | 750x | 1 öncü makale → 750 takip makalesi |
| Çevresel | 2.8x | Çevresel etki çarpanı |

#### Final HIS Hesaplama

- Base HIS: 82.5
- Cascade Multiplier: 1.35
- **Final HIS: 100** (maksimum değer)

### 10.2 Örnek 2: İklim Değişikliği Modelleme Araştırması

**Makale:** "Integrated Assessment Model for Climate Policy"

#### Boyut Skorları

| Boyut | Skor | Gerekçe |
|-------|------|---------|
| D1 | 75 | 2000+ atıf, IPCC raporlarında referans |
| D2 | 80 | Paris Anlaşması'na katkı, politika etkisi |
| D3 | 20 | Düşük risk |
| D4 | 85 | Açık model, şeffaf varsayımlar |
| D5 | 70 | Karbon fiyatlandırma politikaları |
| D6 | 50 | Dolaylı sağlık etkileri |
| D7 | 95 | İklim politikalarına doğrudan etki |
| D8 | 90 | Uluslararası anlaşmalar, yasalar |
| D9 | 65 | Modelleme araçları geliştirildi |
| D10 | 60 | İklim aktivizmi, davranış değişikliği |
| D11 | 70 | Çevre eğitimi müfredatı |
| D12 | 75 | Medya ilgisi, belgeseller |
| D13 | 45 | İklim güvenliği tartışmaları |
| D14 | 55 | İklim kaygısı, eko-anksiyete |
| D15 | 85 | COP toplantıları, küresel işbirliği |
| D16 | 75 | Zincirleme etkiler |

#### Final HIS: 78.5

### 10.3 Örnek 3: Yapay Zeka Etik Araştırması

**Makale:** "Ethical Guidelines for AI Development"

#### Boyut Skorları (Özet)

| Boyut | Skor |
|-------|------|
| D1 | 65 |
| D2 | 70 |
| D3 | 35 |
| D4 | 90 |
| D5 | 55 |
| D6 | 40 |
| D7 | 45 |
| D8 | 80 |
| D9 | 75 |
| D10 | 65 |
| D11 | 60 |
| D12 | 70 |
| D13 | 60 |
| D14 | 50 |
| D15 | 55 |
| D16 | 60 |

#### Final HIS: 62.3

---

## 11. Sık Sorulan Sorular

### 11.1 Genel Sorular

**S: Hızlı Mod ve Kapsamlı Mod arasındaki fark nedir?**

C: Hızlı Mod 37 gösterge ve 4 boyut kullanır (15-30 dakika). Kapsamlı Mod 193 gösterge ve 16 boyut kullanır, zincirleme etki analizi ve çarpan katsayıları içerir (30-45 dakika).

**S: Hangi modu kullanmalıyım?**

C: Büyük ölçekli, politika etkisi beklenen veya disiplinlerarası araştırmalar için Kapsamlı Mod önerilir. Hızlı değerlendirme veya temel akademik etki analizi için Hızlı Mod yeterlidir.

### 11.2 Hesaplama Soruları

**S: Neden D3 (Negatif Etki) ters çevriliyor?**

C: D3'te yüksek skor daha fazla risk anlamına gelir. HIS hesaplamasında bu olumsuz bir faktördür, bu nedenle (100 - D3) kullanılarak ters çevrilir.

**S: Cascade çarpanı neden maksimum 10x ile sınırlı?**

C: Aşırı yüksek çarpanlar gerçekçi olmayan sonuçlar üretebilir. 10x sınırı, hesaplamaların makul aralıkta kalmasını sağlar.

**S: Bilimsel çarpan neden logaritmik?**

C: Bilimsel etki üstel olarak büyüyebilir (bir öncü makale yüzlerce takip makalesi üretebilir). Logaritmik ölçek bu geniş aralığı daha iyi temsil eder.

### 11.3 Veri Toplama Soruları

**S: Atıf verisi için hangi kaynağı kullanmalıyım?**

C: Web of Science veya Scopus birincil kaynak olarak önerilir. Google Scholar daha kapsamlı ancak kalite kontrolü daha zayıftır. Mümkünse birden fazla kaynağı karşılaştırın.

**S: Uzman değerlendirmesi için kaç uzman gerekli?**

C: İdeal olarak 3-5 uzman. Tek uzman yeterli olabilir ancak önyargı riski vardır. Uzmanlar arası tutarlılık kontrol edilmelidir.

### 11.4 Yorumlama Soruları

**S: HIS skoru 50 ne anlama gelir?**

C: Orta düzeyde etki. Araştırma belirli alanlarda katkı sağlıyor ancak dönüştürücü bir etki yaratmıyor. İyileştirme alanları belirlenebilir.

**S: Zincirleme etki analizi ne kadar güvenilir?**

C: Zincirleme etki analizi tahmine dayalıdır. Birincil ve ikincil etkiler daha güvenilir, üçüncül ve sonrası etkiler daha spekülatiftir. Sonuçları dikkatli yorumlayın.

---

## Sonuç

Bu kılavuz, Kapsamlı Mod değerlendirmesinin tüm yönlerini kapsamaktadır. Doğru veri toplama, tutarlı hesaplama ve dikkatli yorumlama ile akademik araştırmaların gerçek dünya etkisini kapsamlı bir şekilde değerlendirebilirsiniz.

**Önemli Hatırlatmalar:**
1. Veri kalitesi sonuç kalitesini belirler
2. Uzman değerlendirmelerinde objektif olun
3. Zincirleme etki tahminlerini dikkatli yorumlayın
4. Sonuçları bağlamında değerlendirin (alan, zaman, coğrafya)
5. Belirsizlikleri raporlayın

---

**Yazar:** Manus AI  
**Versiyon:** 2.0  
**Son Güncelleme:** Ocak 2026  
**Lisans:** CC BY-NC-SA 4.0
