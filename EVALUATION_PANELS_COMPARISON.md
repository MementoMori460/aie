# DEĞERLENDİRME PANELLERİ KARŞILAŞTIRMALI ANALİZ

**Yazar:** Manus AI  
**Tarih:** 7 Ocak 2026  
**Versiyon:** 1.0

---

## GİRİŞ

Akademik Etki Değerlendirme Sistemi'nde **5 farklı değerlendirme paneli** bulunmaktadır. Her panel, belirli göstergeleri değerlendirmek için **uzman bilgisine** sahip kişilerden oluşur. Bu doküman, panellerin ağırlıklandırma formüllerini, veri kaynaklarını ve değerlendirme kriterlerini karşılaştırmalı olarak sunar.

---

## PANEL KARŞILAŞTIRMA TABLOSU

| Özellik | Akademik Panel | Sektör Paneli | Toplum Paneli | Etik Kurulu | Çevre Paneli |
|---------|----------------|---------------|---------------|-------------|--------------|
| **Üye Sayısı** | 3 | 3 | 3 | 3 | 3 |
| **Üye Profili** | Kıdemli akademisyenler (Profesör, Doçent) | 2 endüstri uzmanı + 1 ekonomist | Sivil toplum temsilcileri + medya uzmanları | Etik uzmanları + hukukçu + biyoetik uzmanı | Çevre bilimcileri + sürdürülebilirlik uzmanları |
| **Değerlendirdiği Boyutlar** | D1 (Akademik Etki) | D5 (Ekonomik Etki), D9 (Teknolojik Etki) | D2 (Toplumsal Etki), D10 (Sosyal Etki), D12 (Dijital Etki) | D4 (Etik ve Sorumluluk), D3 (Negatif Etki - risk değerlendirmesi) | D7 (Çevresel Etki) |
| **Toplam Ağırlık** | %19 | %12 (%8 + %4) | %24 (%19 + %3 + %2) | %18 (%9 + %9) | %6 |
| **Değerlendirme Süresi** | 45-60 dakika | 30-45 dakika | 60-90 dakika | 60-75 dakika | 30-45 dakika |
| **Karar Mekanizması** | Çoğunluk (2/3) | Konsensüs (3/3) | Çoğunluk (2/3) | Oybirliği (3/3) | Çoğunluk (2/3) |

---

## PANEL DETAYLARI

### 1. AKADEMİK PANEL

**Üye Profili:**
- 3 kıdemli akademisyen (Profesör veya Doçent)
- En az 10 yıl araştırma deneyimi
- h-indeksi ≥ 20
- Değerlendirilen makalenin alanında uzman

**Değerlendirdiği Boyutlar:**

| Boyut | Ağırlık | Alt Boyutlar |
|-------|---------|--------------|
| D1: Akademik Etki | %19 | D1.1: Atıf Etkisi (%40)<br>D1.2: Bilimsel Yenilik (%30)<br>D1.3: Metodolojik Katkı (%30) |

**Ağırlıklandırma Formülü:**

```
D1_Skoru = (D1.1 × 0.40) + (D1.2 × 0.30) + (D1.3 × 0.30)

D1.1 (Atıf Etkisi) = 
  (Toplam_Atıf × 0.30) + 
  (Yıllık_Atıf × 0.25) + 
  (h_indeksi × 0.20) + 
  (Alan_Normalize_Atıf × 0.15) + 
  (Top10_Atıf × 0.10)

D1.2 (Bilimsel Yenilik) = Likert(1-5) → [0-100]
D1.3 (Metodolojik Katkı) = Likert(1-5) → [0-100]
```

**Veri Kaynakları:**

| Gösterge | Veri Kaynağı | Erişim Yöntemi | Güncelleme Sıklığı |
|----------|--------------|----------------|-------------------|
| Toplam atıf sayısı | Web of Science, Scopus, Google Scholar | API (otomatik) | Günlük |
| Yıllık atıf oranı | Web of Science, Scopus | API (otomatik) | Günlük |
| h-indeksi | Semantic Scholar, Google Scholar | API (otomatik) | Haftalık |
| Alan-normalize atıf | Scimago Journal Rank (SJR) | API (otomatik) | Aylık |
| Top %10 atıf | Web of Science (InCites) | API (otomatik) | Haftalık |
| Bilimsel yenilik | Uzman değerlendirmesi (panel) | Manuel | Değerlendirme anında |
| Metodolojik katkı | Uzman değerlendirmesi (panel) | Manuel | Değerlendirme anında |

**Değerlendirme Kriterleri:**

**Bilimsel Yenilik (Likert 1-5):**
- 1: Mevcut bilginin tekrarı
- 2: Küçük iyileştirmeler
- 3: Orta düzeyde yenilik
- 4: Önemli yenilik
- 5: Çığır açıcı, paradigma değiştiren

**Metodolojik Katkı (Likert 1-5):**
- 1: Standart yöntemler
- 2: Küçük metodolojik iyileştirmeler
- 3: Yeni yöntem varyasyonu
- 4: Yeni yöntem geliştirme
- 5: Devrim niteliğinde yöntem

---

### 2. SEKTÖR PANELİ

**Üye Profili:**
- 2 endüstri uzmanı (C-level veya VP)
- 1 ekonomist (PhD veya 10+ yıl deneyim)
- Değerlendirilen alanla ilgili sektör deneyimi

**Değerlendirdiği Boyutlar:**

| Boyut | Ağırlık | Alt Boyutlar |
|-------|---------|--------------|
| D5: Ekonomik Etki | %8 | D5.1: GSYİH Etkisi (%35)<br>D5.2: İstihdam Etkisi (%30)<br>D5.3: Yatırım ve Pazar Etkisi (%35) |
| D9: Teknolojik Etki | %4 | D9.1: Teknoloji Transferi (%40)<br>D9.2: İnovasyon (%35)<br>D9.3: Dijitalleşme (%25) |

**Ağırlıklandırma Formülleri:**

```
D5_Skoru = (D5.1 × 0.35) + (D5.2 × 0.30) + (D5.3 × 0.35)

D5.1 (GSYİH Etkisi) = 
  (Tahmini_GSYİH_Katkısı × 0.40) + 
  (Sektör_Büyüme_Oranı × 0.30) + 
  (Ekonomik_Çarpan × 0.30)

D5.2 (İstihdam Etkisi) = 
  (Doğrudan_İstihdam × 0.50) + 
  (Dolaylı_İstihdam × 0.30) + 
  (Beceri_Geliştirme × 0.20)

D5.3 (Yatırım ve Pazar Etkisi) = 
  (Araştırma_Yatırımı × 0.35) + 
  (Pazar_Büyüklüğü × 0.35) + 
  (Rekabet_Avantajı × 0.30)

D9_Skoru = (D9.1 × 0.40) + (D9.2 × 0.35) + (D9.3 × 0.25)

D9.1 (Teknoloji Transferi) = Patent_Sayısı + Lisans_Anlaşmaları + Spin-off_Şirketler
D9.2 (İnovasyon) = Likert(1-5) → [0-100]
D9.3 (Dijitalleşme) = Likert(1-5) → [0-100]
```

**Veri Kaynakları:**

| Gösterge | Veri Kaynağı | Erişim Yöntemi | Güncelleme Sıklığı |
|----------|--------------|----------------|-------------------|
| Tahmini GSYİH katkısı | World Bank, OECD | API (otomatik) | Yıllık |
| Sektör büyüme oranı | Bloomberg, Reuters | API (otomatik) | Çeyrek yıllık |
| Ekonomik çarpan | Ekonomist hesaplaması | Manuel | Değerlendirme anında |
| Doğrudan istihdam | Şirket raporları, LinkedIn | API/Manuel | Yıllık |
| Dolaylı istihdam | Ekonomist tahmini | Manuel | Değerlendirme anında |
| Beceri geliştirme | Eğitim programları sayısı | Manuel | Yıllık |
| Araştırma yatırımı | NSF, Horizon Europe | API (otomatik) | Yıllık |
| Pazar büyüklüğü | Market research raporları | Manuel | Yıllık |
| Rekabet avantajı | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Patent sayısı | USPTO, EPO, WIPO | API (otomatik) | Haftalık |
| Lisans anlaşmaları | Şirket raporları | Manuel | Yıllık |
| Spin-off şirketler | Crunchbase, PitchBook | API (otomatik) | Aylık |
| İnovasyon | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Dijitalleşme | Uzman değerlendirmesi | Manuel | Değerlendirme anında |

**Değerlendirme Kriterleri:**

**İnovasyon (Likert 1-5):**
- 1: İnovasyon yok
- 2: Artımsal iyileştirme
- 3: Orta düzeyde inovasyon
- 4: Radikal inovasyon
- 5: Disruptive inovasyon

**Dijitalleşme (Likert 1-5):**
- 1: Dijital etki yok
- 2: Küçük dijital iyileştirmeler
- 3: Orta düzeyde dijitalleşme
- 4: Önemli dijital dönüşüm
- 5: Tam dijital transformasyon

---

### 3. TOPLUM PANELİ

**Üye Profili:**
- 1 sivil toplum temsilcisi (STK yöneticisi)
- 1 medya uzmanı (gazeteci veya iletişim uzmanı)
- 1 toplum lideri (yerel yönetim veya topluluk temsilcisi)

**Değerlendirdiği Boyutlar:**

| Boyut | Ağırlık | Alt Boyutlar |
|-------|---------|--------------|
| D2: Toplumsal ve Pratik Etki | %19 | D2.1: Gerçek Dünya Uygulamaları (%40)<br>D2.2: Toplumsal Fayda (%35)<br>D2.3: Erişilebilirlik (%25) |
| D10: Sosyal ve Kültürel Etki | %3 | D10.1: Davranış Değişikliği (%40)<br>D10.2: Sosyal Adalet (%35)<br>D10.3: Kültürel Üretim (%25) |
| D12: Dijital ve Medya Etkisi | %2 | D12.1: Medya Haberleri (%50)<br>D12.2: Sosyal Medya (%30)<br>D12.3: Popüler Kültür (%20) |

**Ağırlıklandırma Formülleri:**

```
D2_Skoru = (D2.1 × 0.40) + (D2.2 × 0.35) + (D2.3 × 0.25)

D2.1 (Gerçek Dünya Uygulamaları) = 
  (Uygulama_Sayısı × 0.40) + 
  (Ulaşılan_Kişi_Sayısı × 0.35) + 
  (Uygulama_Başarısı × 0.25)

D2.2 (Toplumsal Fayda) = Likert(1-5) → [0-100]
D2.3 (Erişilebilirlik) = Likert(1-5) → [0-100]

D10_Skoru = (D10.1 × 0.40) + (D10.2 × 0.35) + (D10.3 × 0.25)

D10.1 (Davranış Değişikliği) = Likert(1-5) → [0-100]
D10.2 (Sosyal Adalet) = Likert(1-5) → [0-100]
D10.3 (Kültürel Üretim) = Likert(1-5) → [0-100]

D12_Skoru = (D12.1 × 0.50) + (D12.2 × 0.30) + (D12.3 × 0.20)

D12.1 (Medya Haberleri) = log(1 + Haber_Sayısı)
D12.2 (Sosyal Medya) = log(1 + Tweet_Sayısı + Facebook_Paylaşım)
D12.3 (Popüler Kültür) = Likert(1-5) → [0-100]
```

**Veri Kaynakları:**

| Gösterge | Veri Kaynağı | Erişim Yöntemi | Güncelleme Sıklığı |
|----------|--------------|----------------|-------------------|
| Uygulama sayısı | Araştırmacı raporu | Manuel | Değerlendirme anında |
| Ulaşılan kişi sayısı | Proje raporları | Manuel | Yıllık |
| Uygulama başarısı | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Toplumsal fayda | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Erişilebilirlik | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Davranış değişikliği | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Sosyal adalet | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Kültürel üretim | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Medya haberleri | Altmetric, Meltwater | API (otomatik) | Günlük |
| Sosyal medya | Altmetric, Twitter API | API (otomatik) | Günlük |
| Popüler kültür | Uzman değerlendirmesi | Manuel | Değerlendirme anında |

**Değerlendirme Kriterleri:**

**Toplumsal Fayda (Likert 1-5):**
- 1: Toplumsal fayda yok
- 2: Küçük bir gruba fayda
- 3: Orta ölçekli toplumsal fayda
- 4: Geniş toplumsal fayda
- 5: Toplumun tamamına büyük fayda

**Erişilebilirlik (Likert 1-5):**
- 1: Sadece uzmanlar erişebilir
- 2: Eğitimli kişiler erişebilir
- 3: Orta düzeyde erişilebilir
- 4: Geniş kitlelere erişilebilir
- 5: Herkes kolayca erişebilir

---

### 4. ETİK KURULU

**Üye Profili:**
- 1 etik uzmanı (felsefe veya etik doktoru)
- 1 hukukçu (araştırma hukuku uzmanı)
- 1 biyoetik uzmanı (tıp veya biyoloji etiği)

**Değerlendirdiği Boyutlar:**

| Boyut | Ağırlık | Alt Boyutlar |
|-------|---------|--------------|
| D4: Etik ve Sorumluluk | %9 | D4.1: Etik Standartlar (%40)<br>D4.2: Sosyal Sorumluluk (%35)<br>D4.3: Şeffaflık (%25) |
| D3: Negatif Etki ve Risk | %9 | D3.1: Potansiyel Zararlar (%40)<br>D3.2: Risk Yönetimi (%35)<br>D3.3: Uzun Vadeli Riskler (%25) |

**Ağırlıklandırma Formülleri:**

```
D4_Skoru = (D4.1 × 0.40) + (D4.2 × 0.35) + (D4.3 × 0.25)

D4.1 (Etik Standartlar) = 
  (İnsan_Denekleri_Onayı × 0.30) + 
  (Veri_Gizliliği × 0.30) + 
  (Çıkar_Çatışması × 0.20) + 
  (Etik_Uygunluk × 0.20)

D4.2 (Sosyal Sorumluluk) = Likert(1-5) → [0-100]
D4.3 (Şeffaflık) = Likert(1-5) → [0-100]

D3_Skoru = (D3.1 × 0.40) + (D3.2 × 0.35) + (D3.3 × 0.25)

D3.1 (Potansiyel Zararlar) = Likert(1-5) → [0-100] (TERS ÇEVRİLİR)
D3.2 (Risk Yönetimi) = Likert(1-5) → [0-100]
D3.3 (Uzun Vadeli Riskler) = Likert(1-5) → [0-100] (TERS ÇEVRİLİR)

NOT: D3 boyutu için yüksek skor = yüksek risk = düşük HIS katkısı
Final hesaplamada D3 skoru ters çevrilir: D3_final = 100 - D3
```

**Veri Kaynakları:**

| Gösterge | Veri Kaynağı | Erişim Yöntemi | Güncelleme Sıklığı |
|----------|--------------|----------------|-------------------|
| İnsan denekleri onayı | IRB/Etik kurul raporları | Manuel | Değerlendirme anında |
| Veri gizliliği | GDPR uyumluluk raporları | Manuel | Değerlendirme anında |
| Çıkar çatışması | Yazar beyanları | Manuel | Değerlendirme anında |
| Etik uygunluk | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Sosyal sorumluluk | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Şeffaflık | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Potansiyel zararlar | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Risk yönetimi | Uzman değerlendirmesi | Manuel | Değerlendirme anında |
| Uzun vadeli riskler | Uzman değerlendirmesi | Manuel | Değerlendirme anında |

**Değerlendirme Kriterleri:**

**Etik Uygunluk (Likert 1-5):**
- 1: Ciddi etik ihlaller
- 2: Küçük etik endişeler
- 3: Kabul edilebilir etik standartlar
- 4: İyi etik standartlar
- 5: Örnek etik standartlar

**Sosyal Sorumluluk (Likert 1-5):**
- 1: Sosyal sorumluluk yok
- 2: Minimal sosyal sorumluluk
- 3: Orta düzeyde sosyal sorumluluk
- 4: Yüksek sosyal sorumluluk
- 5: Örnek sosyal sorumluluk

**Potansiyel Zararlar (Likert 1-5) - TERS ÇEVRİLİR:**
- 1: Zarar yok
- 2: Minimal zarar
- 3: Orta düzeyde zarar
- 4: Önemli zarar
- 5: Ciddi zarar

---

### 5. ÇEVRE PANELİ

**Üye Profili:**
- 2 çevre bilimcisi (iklim, ekoloji veya sürdürülebilirlik)
- 1 sürdürülebilirlik uzmanı (çevre mühendisi veya yeşil teknoloji)

**Değerlendirdiği Boyutlar:**

| Boyut | Ağırlık | Alt Boyutlar |
|-------|---------|--------------|
| D7: Çevresel Etki | %6 | D7.1: İklim ve Enerji (%40)<br>D7.2: Biyoçeşitlilik (%30)<br>D7.3: Kirlilik ve Atık (%30) |

**Ağırlıklandırma Formülü:**

```
D7_Skoru = (D7.1 × 0.40) + (D7.2 × 0.30) + (D7.3 × 0.30)

D7.1 (İklim ve Enerji) = 
  (Karbon_Emisyonu_Azaltma × 0.40) + 
  (Yenilenebilir_Enerji × 0.35) + 
  (Enerji_Verimliliği × 0.25)

D7.2 (Biyoçeşitlilik) = 
  (Habitat_Koruma × 0.50) + 
  (Tür_Koruma × 0.50)

D7.3 (Kirlilik ve Atık) = 
  (Hava_Kalitesi × 0.35) + 
  (Su_Kalitesi × 0.35) + 
  (Atık_Azaltma × 0.30)
```

**Veri Kaynakları:**

| Gösterge | Veri Kaynağı | Erişim Yöntemi | Güncelleme Sıklığı |
|----------|--------------|----------------|-------------------|
| Karbon emisyonu azaltma | UN Environment, EPA | API (otomatik) | Yıllık |
| Yenilenebilir enerji | IEA, IRENA | API (otomatik) | Yıllık |
| Enerji verimliliği | IEA | API (otomatik) | Yıllık |
| Habitat koruma | IUCN, WWF | API/Manuel | Yıllık |
| Tür koruma | IUCN Red List | API (otomatik) | Yıllık |
| Hava kalitesi | WHO, EPA | API (otomatik) | Aylık |
| Su kalitesi | WHO, UN Water | API (otomatik) | Yıllık |
| Atık azaltma | Proje raporları | Manuel | Yıllık |

**Değerlendirme Kriterleri:**

**Karbon Emisyonu Azaltma:**
- Ölçüm: Ton CO2 eşdeğeri azaltma
- Normalizasyon: Logaritmik (0-100)
- Referans: Paris İklim Anlaşması hedefleri

**Biyoçeşitlilik:**
- Ölçüm: Korunan tür sayısı, habitat alanı (km²)
- Normalizasyon: Lineer (0-100)
- Referans: IUCN koruma hedefleri

**Kirlilik Azaltma:**
- Ölçüm: PM2.5, NO2, SO2 azaltma (µg/m³)
- Normalizasyon: Lineer (0-100)
- Referans: WHO hava kalitesi standartları

---

## PANEL KARŞILAŞTIRMASI: ÖZET TABLO

| Kriter | Akademik Panel | Sektör Paneli | Toplum Paneli | Etik Kurulu | Çevre Paneli |
|--------|----------------|---------------|---------------|-------------|--------------|
| **Toplam Ağırlık** | %19 | %12 | %24 | %18 | %6 |
| **Otomatik Veri Oranı** | %70 | %60 | %30 | %10 | %80 |
| **Manuel Değerlendirme Oranı** | %30 | %40 | %70 | %90 | %20 |
| **API Veri Kaynağı Sayısı** | 5 | 7 | 2 | 0 | 8 |
| **Değerlendirme Süresi** | 45-60 dk | 30-45 dk | 60-90 dk | 60-75 dk | 30-45 dk |
| **Karar Mekanizması** | Çoğunluk (2/3) | Konsensüs (3/3) | Çoğunluk (2/3) | Oybirliği (3/3) | Çoğunluk (2/3) |
| **Likert Ölçeği Kullanımı** | 2 gösterge | 2 gösterge | 7 gösterge | 6 gösterge | 0 gösterge |
| **Nicel Gösterge Sayısı** | 5 | 9 | 3 | 3 | 8 |
| **Nitel Gösterge Sayısı** | 2 | 2 | 7 | 6 | 0 |
| **Kritik Öneme Sahip** | Evet (temel) | Orta | Evet (temel) | Evet (temel) | Orta |

---

## PANEL ETKİLEŞİMLERİ

Paneller **bağımsız değildir**. Bir panelin değerlendirmesi, diğer panellerin değerlendirmelerini **dolaylı olarak** etkiler.

### Etkileşim Matrisi

| Panel | Akademik | Sektör | Toplum | Etik | Çevre |
|-------|----------|--------|--------|------|-------|
| **Akademik** | - | Güçlü (+) | Orta (+) | Zayıf (+) | Zayıf (+) |
| **Sektör** | Güçlü (+) | - | Güçlü (+) | Orta (-) | Orta (-) |
| **Toplum** | Orta (+) | Güçlü (+) | - | Güçlü (+) | Orta (+) |
| **Etik** | Zayıf (+) | Orta (-) | Güçlü (+) | - | Orta (+) |
| **Çevre** | Zayıf (+) | Orta (-) | Orta (+) | Orta (+) | - |

**Açıklama:**
- **Güçlü (+):** Bir panelin yüksek skoru, diğer panelin skorunu önemli ölçüde artırır
- **Orta (+):** Bir panelin yüksek skoru, diğer panelin skorunu orta düzeyde artırır
- **Zayıf (+):** Bir panelin yüksek skoru, diğer panelin skorunu az miktarda artırır
- **Orta (-):** Bir panelin yüksek skoru, diğer panelin skorunu orta düzeyde azaltır (trade-off)

### Etkileşim Örnekleri

**Akademik → Sektör (Güçlü +):**  
Yüksek akademik etki (D1=95) → Daha fazla araştırma fonu → Daha fazla patent → Yüksek ekonomik etki (D5↑)

**Sektör → Toplum (Güçlü +):**  
Yüksek ekonomik etki (D5=88) → Daha fazla istihdam → Daha fazla toplumsal fayda → Yüksek toplumsal etki (D2↑)

**Etik → Toplum (Güçlü +):**  
Yüksek etik standartlar (D4=85) → Toplumsal güven → Daha fazla kabul → Yüksek toplumsal etki (D2↑)

**Sektör → Çevre (Orta -):**  
Yüksek ekonomik etki (D5=88) → Daha fazla üretim → Daha fazla karbon emisyonu → Düşük çevresel etki (D7↓) [Trade-off]

---

## PANEL SEÇIM KRİTERLERİ

Her panel için üye seçimi **3 aşamalı bir süreçle** yapılır:

### Aşama 1: Yetkinlik Değerlendirmesi

**Akademik Panel:**
- PhD derecesi (zorunlu)
- Profesör veya Doçent unvanı (tercih edilir)
- h-indeksi ≥ 20
- En az 10 yıl araştırma deneyimi
- Değerlendirilen alanında en az 5 yayın

**Sektör Paneli:**
- MBA veya mühendislik derecesi (zorunlu)
- C-level veya VP pozisyonu (tercih edilir)
- En az 15 yıl endüstri deneyimi
- Ekonomist için: PhD veya 10+ yıl deneyim

**Toplum Paneli:**
- Lisans derecesi (zorunlu)
- STK yöneticisi: En az 5 yıl STK deneyimi
- Medya uzmanı: En az 10 yıl gazetecilik deneyimi
- Toplum lideri: Yerel yönetim veya topluluk temsilcisi

**Etik Kurulu:**
- PhD derecesi (zorunlu)
- Etik uzmanı: Felsefe veya etik doktoru
- Hukukçu: Araştırma hukuku uzmanı
- Biyoetik uzmanı: Tıp veya biyoloji etiği

**Çevre Paneli:**
- Lisans derecesi (zorunlu)
- Çevre bilimcisi: İklim, ekoloji veya sürdürülebilirlik
- Sürdürülebilirlik uzmanı: Çevre mühendisi veya yeşil teknoloji

### Aşama 2: Çıkar Çatışması Kontrolü

Tüm panel üyeleri için:
- Değerlendirilen makalenin yazarlarıyla **doğrudan işbirliği yok** (son 5 yıl)
- Değerlendirilen makalenin yazarlarıyla **akrabalık yok**
- Değerlendirilen makalenin yazarlarıyla **finansal ilişki yok**
- Değerlendirilen makalenin konusunda **kişisel çıkar yok**

### Aşama 3: Eğitim ve Kalibrasyon

Tüm panel üyeleri için:
- **Değerlendirme eğitimi:** 2 saatlik online eğitim
- **Kalibrasyon testi:** 3 örnek makale değerlendirmesi
- **Tutarlılık kontrolü:** Inter-rater reliability (ICC) ≥ 0.70

---

## SONUÇ

5 değerlendirme paneli, Akademik Etki Değerlendirme Sistemi'nin **temel yapı taşlarıdır**. Her panel, farklı bir bakış açısından araştırmanın etkisini değerlendirir. Panellerin **ağırlıklandırma formülleri** ve **veri kaynakları** bilimsel konsensüs ve pratik uygulanabilirlik temelinde belirlenmiştir.

**Temel Bulgular:**
- **Akademik Panel:** En yüksek otomatik veri oranı (%70), en güvenilir metrikler
- **Sektör Paneli:** Ekonomik etki ve teknoloji transferi odaklı, konsensüs kararı
- **Toplum Paneli:** En yüksek ağırlık (%24), en fazla manuel değerlendirme (%70)
- **Etik Kurulu:** En kritik panel, oybirliği kararı, tamamen manuel değerlendirme
- **Çevre Paneli:** En yüksek otomatik veri oranı (%80), objektif metrikler

**Öneriler:**
- Panel üyelerinin düzenli eğitimi ve kalibrasyonu
- API veri kaynaklarının genişletilmesi (manuel değerlendirmeyi azaltmak için)
- Panel etkileşimlerinin daha detaylı modellenmesi
- Disiplinler arası normalizasyon için panel-spesifik ağırlıklar

---

**Son Güncelleme:** 7 Ocak 2026  
**Versiyon:** 1.0  
**Yazar:** Manus AI
