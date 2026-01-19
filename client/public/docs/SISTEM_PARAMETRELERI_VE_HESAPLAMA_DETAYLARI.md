# AKADEMİK MAKALE ETKİ DEĞERLENDİRMESİ SİSTEMİ
## KAPSAMLI TEKNİK DOKÜMANTASYON

**Versiyon:** 2.0  
**Tarih:** 2026-01-06  
**Kapsam:** Tüm parametreler, formüller, ağırlıklandırmalar, etkileşimler ve uç durumlar

---

## İÇİNDEKİLER

1. [Sistem Mimarisi ve Genel Bakış](#1-sistem-mimarisi-ve-genel-bakış)
2. [Hiyerarşik Yapı ve Organizasyon](#2-hiyerarşik-yapı-ve-organizasyon)
3. [33 Gösterge: Detaylı Tanımlar ve Hesaplama](#3-33-gösterge-detaylı-tanımlar-ve-hesaplama)
4. [Normalizasyon Fonksiyonları](#4-normalizasyon-fonksiyonları)
5. [Ağırlıklandırma Sistemi](#5-ağırlıklandırma-sistemi)
6. [Alt Boyut Hesaplamaları](#6-alt-boyut-hesaplamaları)
7. [Ana Boyut Hesaplamaları](#7-ana-boyut-hesaplamaları)
8. [Bütünsel Etki Skoru (HIS) Hesaplama](#8-bütünsel-etki-skoru-his-hesaplama)
9. [Parametreler Arası Etkileşimler](#9-parametreler-arası-etkileşimler)
10. [Uç Durumlar ve Özel Senaryolar](#10-uç-durumlar-ve-özel-senaryolar)
11. [Hassasiyet Analizi](#11-hassasiyet-analizi)
12. [Eksik Veriler ve Varsayılan Değerler](#12-eksik-veriler-ve-varsayılan-değerler)
13. [Gelişmiş Özellikler](#13-gelişmiş-özellikler)

---

## 1. SİSTEM MİMARİSİ VE GENEL BAKIŞ

### 1.1 Temel Felsefe

Akademik makalenin etkisini değerlendirmek için **çok boyutlu, bütünsel ve dengeli** bir yaklaşım benimsenmiştir. Sistem, sadece atıf sayısı gibi tek bir metriğe dayanmaz; aksine **akademik, toplumsal, negatif ve etik** boyutları birlikte ele alır.

### 1.2 Matematiksel Model

Sistem, **ağırlıklı toplam** ve **normalizasyon** prensiplerini kullanır:

```
HIS = Σ (W_i × D_i)
```

Burada:
- `HIS`: Bütünsel Etki Skoru (0-100 arası)
- `W_i`: i. ana boyutun ağırlığı
- `D_i`: i. ana boyutun normalize edilmiş skoru

### 1.3 Veri Akışı

```
Ham Veri (33 gösterge)
    ↓
Normalizasyon (0-1 arası)
    ↓
Alt Boyut Skorları (11 alt boyut)
    ↓
Ana Boyut Skorları (4 ana boyut)
    ↓
Bütünsel Etki Skoru (HIS)
```

---

## 2. HİYERARŞİK YAPI VE ORGANİZASYON

### 2.1 Dört Katmanlı Hiyerarşi

```
Seviye 0: Ham Göstergeler (33 adet)
    ↓
Seviye 1: Alt Boyutlar (11 adet)
    ↓
Seviye 2: Ana Boyutlar (4 adet)
    ↓
Seviye 3: Bütünsel Etki Skoru (HIS)
```

### 2.2 Ana Boyutlar ve Ağırlıkları

| Kod | Ana Boyut | Ağırlık (W) | Açıklama |
|-----|-----------|-------------|----------|
| D1 | Akademik Etki | 0.30 | Geleneksel akademik metrikler |
| D2 | Toplumsal ve Pratik Etki | 0.35 | Gerçek dünya uygulamaları |
| D3 | Negatif Etki ve Risk | -0.15 | Zararlı sonuçlar (negatif katkı) |
| D4 | Etik ve Sorumluluk | 0.20 | Etik standartlar ve şeffaflık |

**Not:** D3'ün negatif ağırlığı, yüksek negatif etki skorunun HIS'i düşüreceği anlamına gelir.

### 2.3 Alt Boyutlar ve Ağırlıkları

#### D1: Akademik Etki (3 alt boyut)

| Kod | Alt Boyut | Ağırlık (w) | Gösterge Sayısı |
|-----|-----------|-------------|-----------------|
| D1.1 | Atıf ve Tanınma | 0.40 | 4 gösterge |
| D1.2 | Disiplinlerarası Etki | 0.30 | 4 gösterge |
| D1.3 | Uzun Vadeli Akademik Etki | 0.30 | 3 gösterge |

#### D2: Toplumsal ve Pratik Etki (3 alt boyut)

| Kod | Alt Boyut | Ağırlık (w) | Gösterge Sayısı |
|-----|-----------|-------------|-----------------|
| D2.1 | Medya ve Kamuoyu Etkisi | 0.25 | 3 gösterge |
| D2.2 | Politika ve Karar Alma Etkisi | 0.35 | 4 gösterge |
| D2.3 | Ekonomik ve Teknolojik Etki | 0.40 | 4 gösterge |

#### D3: Negatif Etki ve Risk (3 alt boyut)

| Kod | Alt Boyut | Ağırlık (w) | Gösterge Sayısı |
|-----|-----------|-------------|-----------------|
| D3.1 | Sosyal ve Çevresel Zarar | 0.40 | 3 gösterge |
| D3.2 | Bilimsel Güvenilirlik Sorunları | 0.35 | 3 gösterge |
| D3.3 | Yanlış Kullanım ve Manipülasyon | 0.25 | 3 gösterge |

#### D4: Etik ve Sorumluluk (2 alt boyut)

| Kod | Alt Boyut | Ağırlık (w) | Gösterge Sayısı |
|-----|-----------|-------------|-----------------|
| D4.1 | Etik Standartlar | 0.50 | 3 gösterge |
| D4.2 | Şeffaflık ve Açık Bilim | 0.50 | 3 gösterge |

---

## 3. 33 GÖSTERGE: DETAYLI TANIMLAR VE HESAPLAMA

### 3.1 D1.1: Atıf ve Tanınma (4 gösterge)

#### I_111: Toplam Atıf Sayısı
- **Tip:** Nicel (sayı)
- **Normalizasyon:** Logaritmik
- **Ağırlık:** 0.30
- **Formül:** `N(x) = log(1 + x) / log(1 + 10000)`
- **Veri Kaynakları:** Google Scholar, Web of Science, Scopus
- **Hesaplama:** Tüm platformlardaki atıfların toplamı
- **Uç Durumlar:**
  - 0 atıf → 0.0
  - 10,000+ atıf → 1.0
  - Negatif değer → hata
- **Etkileşimler:**
  - I_112 (h-indeksi) ile pozitif korelasyon
  - I_121 (disiplinlerarası atıf) ile orta korelasyon
  - I_322 (çürütülme) ile negatif korelasyon

#### I_112: h-indeksi Etkisi
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.25
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Makalenin yazarların h-indeksine katkısı
- **Ölçek:**
  - 1: Çok düşük katkı (h-indeksi değişmedi)
  - 2: Düşük katkı (h-indeksi +1)
  - 3: Orta katkı (h-indeksi +2-3)
  - 4: Yüksek katkı (h-indeksi +4-5)
  - 5: Çok yüksek katkı (h-indeksi +6 veya üzeri)
- **Etkileşimler:**
  - I_111 (atıf sayısı) ile güçlü pozitif korelasyon
  - I_131 (uzun vadeli atıf) ile orta korelasyon

#### I_113: Prestijli Dergi/Konferans Faktörü
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.25
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Yayın yerinin prestiji ve impakt faktörü
- **Ölçek:**
  - 1: Düşük prestij (IF < 1)
  - 2: Orta-düşük prestij (IF 1-3)
  - 3: Orta prestij (IF 3-6)
  - 4: Yüksek prestij (IF 6-10)
  - 5: Çok yüksek prestij (IF > 10 veya Nature/Science)
- **Etkileşimler:**
  - I_111 (atıf sayısı) ile orta pozitif korelasyon
  - I_211 (medya görünürlüğü) ile zayıf pozitif korelasyon

#### I_114: Ödül ve Tanınma
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.20
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Makaleye verilen ödüller ve özel tanınmalar
- **Ölçek:**
  - 1: Ödül yok
  - 2: Küçük ödül (konferans best paper)
  - 3: Orta ödül (dergi editör seçimi)
  - 4: Büyük ödül (ulusal bilim ödülü)
  - 5: Prestijli ödül (Nobel, Turing, Fields Medal'e katkı)
- **Etkileşimler:**
  - I_113 (prestijli dergi) ile orta pozitif korelasyon
  - I_211 (medya görünürlüğü) ile güçlü pozitif korelasyon

### 3.2 D1.2: Disiplinlerarası Etki (4 gösterge)

#### I_121: Disiplinlerarası Atıflar
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Farklı disiplinlerden gelen atıfların oranı
- **Ölçek:**
  - 1: Tek disiplin (< 10% farklı disiplin)
  - 2: Az disiplinlerarası (10-25%)
  - 3: Orta disiplinlerarası (25-50%)
  - 4: Yüksek disiplinlerarası (50-75%)
  - 5: Çok yüksek disiplinlerarası (> 75%)
- **Hesaplama:** Atıf yapan dergilerin/konferansların disiplin dağılımı
- **Etkileşimler:**
  - I_122 (yeni alan) ile güçlü pozitif korelasyon
  - I_231 (teknoloji transferi) ile orta pozitif korelasyon

#### I_122: Yeni Araştırma Alanı Oluşturma
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Makalenin yeni bir araştırma alanı başlatıp başlatmadığı
- **Ölçek:**
  - 1: Yeni alan yok
  - 2: Küçük alt-alan (< 10 takip çalışması)
  - 3: Orta alt-alan (10-50 takip çalışması)
  - 4: Büyük alan (50-200 takip çalışması)
  - 5: Yeni disiplin (> 200 takip çalışması, yeni konferans/dergi)
- **Etkileşimler:**
  - I_121 (disiplinlerarası atıf) ile güçlü pozitif korelasyon
  - I_131 (uzun vadeli atıf) ile orta pozitif korelasyon

#### I_123: Metodolojik Yenilik
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.25
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Yeni metot, teknik veya yaklaşım geliştirme
- **Ölçek:**
  - 1: Yenilik yok (mevcut metotları kullanma)
  - 2: Küçük iyileştirme
  - 3: Orta yenilik (yeni varyant)
  - 4: Büyük yenilik (yeni metot)
  - 5: Paradigma değişikliği (alan standart metodu)
- **Etkileşimler:**
  - I_122 (yeni alan) ile orta pozitif korelasyon
  - I_231 (teknoloji transferi) ile güçlü pozitif korelasyon

#### I_124: Teorik Katkı
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.15
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Teorik çerçeve, model veya kavramsal katkı
- **Ölçek:**
  - 1: Teorik katkı yok (ampirik çalışma)
  - 2: Küçük teorik ekleme
  - 3: Orta teorik katkı (yeni hipotez)
  - 4: Büyük teorik katkı (yeni teori)
  - 5: Temel teori (alan paradigması)
- **Etkileşimler:**
  - I_122 (yeni alan) ile orta pozitif korelasyon
  - I_131 (uzun vadeli atıf) ile güçlü pozitif korelasyon

### 3.3 D1.3: Uzun Vadeli Akademik Etki (3 gösterge)

#### I_131: Uzun Vadeli Atıf Trendi
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.40
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Atıfların zamanla artıp artmadığı
- **Ölçek:**
  - 1: Azalan trend (atıflar düşüyor)
  - 2: Sabit düşük (yılda < 5 atıf)
  - 3: Sabit orta (yılda 5-20 atıf)
  - 4: Artan trend (atıflar artıyor)
  - 5: Hızlı artan (exponential büyüme)
- **Hesaplama:** Son 5 yılın atıf trendini regresyon analizi ile
- **Etkileşimler:**
  - I_111 (atıf sayısı) ile orta pozitif korelasyon
  - I_322 (çürütülme) ile güçlü negatif korelasyon

#### I_132: Ders Kitaplarında Yer Alma
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.30
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Lisans/lisansüstü ders kitaplarında referans gösterilme
- **Ölçek:**
  - 0: Ders kitabında yok
  - 1: En az bir ders kitabında var
- **Etkileşimler:**
  - I_124 (teorik katkı) ile güçlü pozitif korelasyon
  - I_131 (uzun vadeli atıf) ile orta pozitif korelasyon

#### I_133: Replikasyon ve Doğrulama
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Bağımsız araştırmacılar tarafından replike edilme
- **Ölçek:**
  - 1: Replikasyon yok
  - 2: 1-2 başarısız replikasyon
  - 3: 1-2 başarılı replikasyon
  - 4: 3-5 başarılı replikasyon
  - 5: > 5 başarılı replikasyon (alan standardı)
- **Etkileşimler:**
  - I_322 (çürütülme) ile güçlü negatif korelasyon
  - I_411 (etik onay) ile orta pozitif korelasyon

### 3.4 D2.1: Medya ve Kamuoyu Etkisi (3 gösterge)

#### I_211: Medya Görünürlüğü
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.35
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Ana akım medyada yer alma
- **Ölçek:**
  - 1: Medya yok
  - 2: Küçük medya (blog, yerel haber)
  - 3: Orta medya (ulusal haber, 1-5 haber)
  - 4: Büyük medya (uluslararası haber, 5-20 haber)
  - 5: Viral medya (> 20 haber, TV, viral sosyal medya)
- **Veri Kaynakları:** Altmetric, PlumX, Google News
- **Etkileşimler:**
  - I_114 (ödül) ile güçlü pozitif korelasyon
  - I_212 (politika etkisi) ile orta pozitif korelasyon
  - I_311 (negatif sosyal etki) ile potansiyel pozitif korelasyon (paradoks)

#### I_212: Sosyal Medya Etkisi
- **Tip:** Nicel (sayı)
- **Normalizasyon:** Logaritmik
- **Ağırlık:** 0.30
- **Formül:** `N(x) = log(1 + x) / log(1 + 10000)`
- **Tanım:** Twitter, Reddit, Facebook vb. paylaşım/tartışma sayısı
- **Hesaplama:** Altmetric skorundan veya manuel sayımdan
- **Uç Durumlar:**
  - 0 paylaşım → 0.0
  - 10,000+ paylaşım → 1.0
- **Etkileşimler:**
  - I_211 (medya görünürlüğü) ile güçlü pozitif korelasyon
  - I_323 (yanlış bilgi) ile potansiyel pozitif korelasyon (viral yanlış bilgi)

#### I_213: Halk Bilinçlendirme
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.35
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Halkın bilgi ve davranış değişikliğine katkı
- **Ölçek:**
  - 1: Bilinçlendirme yok
  - 2: Küçük bilinçlendirme (< 1000 kişi)
  - 3: Orta bilinçlendirme (1000-10000 kişi)
  - 4: Büyük bilinçlendirme (10000-100000 kişi)
  - 5: Kitlesel bilinçlendirme (> 100000 kişi, davranış değişikliği)
- **Etkileşimler:**
  - I_211 (medya görünürlüğü) ile güçlü pozitif korelasyon
  - I_221 (politika değişikliği) ile orta pozitif korelasyon

### 3.5 D2.2: Politika ve Karar Alma Etkisi (4 gösterge)

#### I_221: Politika Değişikliği
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Kamu politikası, yasa veya düzenleme değişikliğine katkı
- **Ölçek:**
  - 1: Politika etkisi yok
  - 2: Küçük etki (yerel politika tartışması)
  - 3: Orta etki (ulusal politika tartışması)
  - 4: Büyük etki (yasa/düzenleme değişikliği)
  - 5: Çok büyük etki (uluslararası anlaşma/protokol)
- **Etkileşimler:**
  - I_213 (halk bilinçlendirme) ile orta pozitif korelasyon
  - I_222 (klinik kılavuz) ile güçlü pozitif korelasyon (sağlık alanında)

#### I_222: Klinik Kılavuz/Standart Entegrasyonu
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.25
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Klinik kılavuz, endüstri standardı veya best practice'e dahil edilme
- **Ölçek:**
  - 0: Kılavuzda yok
  - 1: En az bir kılavuzda var
- **Etkileşimler:**
  - I_221 (politika değişikliği) ile güçlü pozitif korelasyon
  - I_231 (teknoloji transferi) ile orta pozitif korelasyon

#### I_223: Karar Destek Sistemlerinde Kullanım
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.25
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Karar destek araçları, yazılımlar veya algoritmalarda kullanım
- **Ölçek:**
  - 1: Kullanım yok
  - 2: Küçük kullanım (1-2 araç)
  - 3: Orta kullanım (3-5 araç)
  - 4: Yaygın kullanım (5-20 araç)
  - 5: Endüstri standardı (> 20 araç, FDA onaylı vb.)
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile güçlü pozitif korelasyon
  - I_232 (patent) ile orta pozitif korelasyon

#### I_224: Uluslararası İşbirliği ve Anlaşmalar
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.20
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Uluslararası anlaşma, protokol veya işbirliğine katkı
- **Ölçek:**
  - 1: İşbirliği yok
  - 2: İkili işbirliği (2 ülke)
  - 3: Bölgesel işbirliği (3-10 ülke)
  - 4: Küresel işbirliği (> 10 ülke)
  - 5: BM/WHO protokolü (evrensel anlaşma)
- **Etkileşimler:**
  - I_221 (politika değişikliği) ile güçlü pozitif korelasyon
  - I_312 (çevresel zarar) ile negatif korelasyon (çevre anlaşmaları için)

### 3.6 D2.3: Ekonomik ve Teknolojik Etki (4 gösterge)

#### I_231: Teknoloji Transferi ve Ticarileştirme
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Araştırmanın ticari ürün/hizmete dönüşmesi
- **Ölçek:**
  - 1: Ticarileştirme yok
  - 2: Prototip aşaması
  - 3: Pilot uygulama (< 10 müşteri)
  - 4: Ticari ürün (10-1000 müşteri)
  - 5: Kitlesel ürün (> 1000 müşteri, piyasa lideri)
- **Etkileşimler:**
  - I_232 (patent) ile güçlü pozitif korelasyon
  - I_233 (startup) ile güçlü pozitif korelasyon
  - I_123 (metodolojik yenilik) ile orta pozitif korelasyon

#### I_232: Patent ve Fikri Mülkiyet
- **Tip:** Nicel (sayı)
- **Normalizasyon:** Logaritmik
- **Ağırlık:** 0.25
- **Formül:** `N(x) = log(1 + x) / log(1 + 20)`
- **Tanım:** Makaleye dayalı patent sayısı
- **Uç Durumlar:**
  - 0 patent → 0.0
  - 20+ patent → 1.0
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile güçlü pozitif korelasyon
  - I_233 (startup) ile orta pozitif korelasyon

#### I_233: Startup ve Girişim Oluşturma
- **Tip:** Nicel (sayı)
- **Normalizasyon:** Logaritmik
- **Ağırlık:** 0.25
- **Formül:** `N(x) = log(1 + x) / log(1 + 10)`
- **Tanım:** Makaleye dayalı kurulan startup sayısı
- **Uç Durumlar:**
  - 0 startup → 0.0
  - 10+ startup → 1.0
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile güçlü pozitif korelasyon
  - I_234 (ekonomik değer) ile güçlü pozitif korelasyon

#### I_234: Ekonomik Değer Yaratma
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.20
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Doğrudan ekonomik değer (gelir, maliyet tasarrufu, istihdam)
- **Ölçek:**
  - 1: Ekonomik değer yok
  - 2: Küçük değer (< $100K)
  - 3: Orta değer ($100K - $1M)
  - 4: Büyük değer ($1M - $10M)
  - 5: Çok büyük değer (> $10M)
- **Etkileşimler:**
  - I_233 (startup) ile güçlü pozitif korelasyon
  - I_231 (teknoloji transferi) ile orta pozitif korelasyon

### 3.7 D3.1: Sosyal ve Çevresel Zarar (3 gösterge)

**NOT:** Bu alt boyuttaki yüksek skorlar, HIS'i **düşürür** (negatif katkı).

#### I_311: Negatif Sosyal Etki
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.40
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Sosyal eşitsizlik, ayrımcılık, toplumsal zarara katkı
- **Ölçek:**
  - 1: Sosyal zarar yok
  - 2: Küçük risk (potansiyel zarar)
  - 3: Orta zarar (belgelenmiş küçük zarar)
  - 4: Büyük zarar (yaygın zarar)
  - 5: Kitlesel zarar (toplumsal kriz)
- **Örnekler:**
  - Ayrımcılık yapan algoritmalar
  - Yanlış sağlık tavsiyeleri
  - Manipülatif teknolojiler
- **Etkileşimler:**
  - I_211 (medya görünürlüğü) ile paradoksal pozitif korelasyon
  - I_411 (etik onay) ile güçlü negatif korelasyon

#### I_312: Çevresel Zarar
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Çevresel tahribat, kirlilik, ekosistem zararı
- **Ölçek:**
  - 1: Çevresel zarar yok
  - 2: Küçük risk (potansiyel zarar)
  - 3: Orta zarar (yerel çevre zararı)
  - 4: Büyük zarar (bölgesel çevre zararı)
  - 5: Kitlesel zarar (küresel çevre zararı)
- **Örnekler:**
  - Yüksek karbon ayak izi teknolojiler
  - Zararlı kimyasallar
  - Ekosistem tahribatı
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile potansiyel pozitif korelasyon
  - I_224 (uluslararası işbirliği) ile negatif korelasyon (çevre anlaşmaları)

#### I_313: Güvenlik ve Mahremiyet Riskleri
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Güvenlik açıkları, mahremiyet ihlalleri, siber riskler
- **Ölçek:**
  - 1: Risk yok
  - 2: Küçük risk (teorik zafiyet)
  - 3: Orta risk (belgelenmiş zafiyet)
  - 4: Büyük risk (aktif saldırı)
  - 5: Kritik risk (kitlesel veri ihlali)
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile potansiyel pozitif korelasyon
  - I_421 (veri paylaşımı) ile paradoksal ilişki

### 3.8 D3.2: Bilimsel Güvenilirlik Sorunları (3 gösterge)

#### I_321: Metodolojik Hatalar
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.35
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** İstatistiksel hatalar, tasarım sorunları, analiz hataları
- **Ölçek:**
  - 1: Hata yok
  - 2: Küçük hata (tartışmalı analiz)
  - 3: Orta hata (belgelenmiş hata)
  - 4: Büyük hata (sonuçları etkileyen hata)
  - 5: Kritik hata (sonuçlar geçersiz)
- **Etkileşimler:**
  - I_322 (çürütülme) ile güçlü pozitif korelasyon
  - I_133 (replikasyon) ile güçlü negatif korelasyon

#### I_322: Çürütülme ve Geri Çekilme
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.40
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Makale geri çekildi mi veya önemli bulguları çürütüldü mü?
- **Ölçek:**
  - 0: Çürütülme/geri çekilme yok
  - 1: Çürütülme veya geri çekilme var
- **Etkileşimler:**
  - I_111 (atıf sayısı) ile paradoksal pozitif korelasyon (ünlü çürütülmeler)
  - I_321 (metodolojik hata) ile güçlü pozitif korelasyon
  - I_411 (etik onay) ile güçlü negatif korelasyon

#### I_323: Yanlış Bilgi Yayılımı
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.25
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Makalenin yanlış yorumlanması veya yanlış bilgi kaynağı olması
- **Ölçek:**
  - 1: Yanlış bilgi yok
  - 2: Küçük yanlış yorum
  - 3: Orta yanlış bilgi (medyada yanlış aktarım)
  - 4: Büyük yanlış bilgi (yaygın yanlış inanç)
  - 5: Kitlesel yanlış bilgi (toplumsal zarar)
- **Örnekler:**
  - Aşı karşıtlığı
  - İklim değişikliği inkarı
  - Sahte tıbbi tedaviler
- **Etkileşimler:**
  - I_212 (sosyal medya) ile güçlü pozitif korelasyon
  - I_211 (medya görünürlüğü) ile orta pozitif korelasyon

### 3.9 D3.3: Yanlış Kullanım ve Manipülasyon (3 gösterge)

#### I_331: Kötü Amaçlı Kullanım
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.40
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Araştırmanın kötü amaçlı kullanımı (silah, gözetim, manipülasyon)
- **Ölçek:**
  - 1: Kötü kullanım yok
  - 2: Küçük risk (potansiyel kötü kullanım)
  - 3: Orta kullanım (belgelenmiş kötü kullanım)
  - 4: Yaygın kötü kullanım
  - 5: Kitlesel kötü kullanım (siber saldırı, kitlesel gözetim)
- **Örnekler:**
  - Deepfake teknolojisi
  - Gözetim algoritmaları
  - Siber saldırı araçları
- **Etkileşimler:**
  - I_231 (teknoloji transferi) ile potansiyel pozitif korelasyon
  - I_313 (güvenlik riski) ile güçlü pozitif korelasyon

#### I_332: Ticari Manipülasyon
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Ticari çıkar için sonuçların manipüle edilmesi
- **Ölçek:**
  - 1: Manipülasyon yok
  - 2: Küçük çıkar çatışması (açıklanmış)
  - 3: Orta manipülasyon (sponsor etkisi)
  - 4: Büyük manipülasyon (sonuçlar çarpıtıldı)
  - 5: Sistematik manipülasyon (endüstri destekli sahte bilim)
- **Örnekler:**
  - Tütün endüstrisi araştırmaları
  - Ilaç şirketi sponsorlu çalışmalar
  - Fosil yakıt endüstrisi iklim araştırmaları
- **Etkileşimler:**
  - I_234 (ekonomik değer) ile paradoksal ilişki
  - I_412 (çıkar çatışması) ile güçlü pozitif korelasyon

#### I_333: Siyasi Propaganda
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Siyasi amaçlarla araştırmanın kullanılması veya çarpıtılması
- **Ölçek:**
  - 1: Propaganda yok
  - 2: Küçük siyasi referans
  - 3: Orta propaganda (siyasi aktörler tarafından kullanım)
  - 4: Yaygın propaganda (sistematik kullanım)
  - 5: Devlet propaganda (otoriter rejim aracı)
- **Etkileşimler:**
  - I_221 (politika değişikliği) ile paradoksal ilişki
  - I_211 (medya görünürlüğü) ile orta pozitif korelasyon

### 3.10 D4.1: Etik Standartlar (3 gösterge)

#### I_411: Etik Onay ve Uyum
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.40
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Etik kurul onayı ve etik standartlara uyum
- **Ölçek:**
  - 0: Etik onay yok (gerekli olmasına rağmen)
  - 1: Etik onay var veya gerekli değil
- **Etkileşimler:**
  - I_322 (çürütülme) ile güçlü negatif korelasyon
  - I_311 (negatif sosyal etki) ile güçlü negatif korelasyon
  - **Kapı Bekçisi Rolü:** I_411 = 0 ise, HIS maksimum 50'ye sınırlanır

#### I_412: Çıkar Çatışması Beyanı
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.30
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Çıkar çatışması açıkça beyan edildi mi?
- **Ölçek:**
  - 0: Çıkar çatışması beyan edilmedi
  - 1: Çıkar çatışması beyan edildi (var veya yok)
- **Etkileşimler:**
  - I_332 (ticari manipülasyon) ile güçlü negatif korelasyon
  - I_234 (ekonomik değer) ile zayıf negatif korelasyon

#### I_413: İnsan/Hayvan Hakları Uyumu
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** İnsan ve hayvan haklarına saygı
- **Ölçek:**
  - 1: Ciddi ihlal (Helsinki Deklarasyonu ihlali)
  - 2: Orta ihlal (tartışmalı uygulamalar)
  - 3: Minimum uyum (yasal gereklilikler)
  - 4: İyi uyum (best practices)
  - 5: Örnek uyum (altın standart)
- **Etkileşimler:**
  - I_411 (etik onay) ile güçlü pozitif korelasyon
  - I_311 (negatif sosyal etki) ile güçlü negatif korelasyon

### 3.11 D4.2: Şeffaflık ve Açık Bilim (3 gösterge)

#### I_421: Veri ve Kod Paylaşımı
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.40
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Veri, kod ve materyallerin açık paylaşımı
- **Ölçek:**
  - 1: Hiçbir şey paylaşılmadı
  - 2: Talep üzerine paylaşım
  - 3: Kısmi paylaşım (veri veya kod)
  - 4: Tam paylaşım (veri + kod)
  - 5: Altın standart (veri + kod + materyal + dokümantasyon)
- **Etkileşimler:**
  - I_133 (replikasyon) ile güçlü pozitif korelasyon
  - I_422 (açık erişim) ile orta pozitif korelasyon

#### I_422: Açık Erişim Yayın
- **Tip:** İkili (0 veya 1)
- **Normalizasyon:** İkili
- **Ağırlık:** 0.30
- **Formül:** `N(x) = x` (0 veya 1)
- **Tanım:** Makale açık erişimli mi?
- **Ölçek:**
  - 0: Kapalı erişim (paywall)
  - 1: Açık erişim (herkes okuyabilir)
- **Etkileşimler:**
  - I_111 (atıf sayısı) ile zayıf pozitif korelasyon
  - I_213 (halk bilinçlendirme) ile orta pozitif korelasyon

#### I_423: Preregistration ve Şeffaflık
- **Tip:** Nitel (1-5 Likert)
- **Normalizasyon:** Lineer
- **Ağırlık:** 0.30
- **Formül:** `N(x) = (x - 1) / 4`
- **Tanım:** Çalışma öncesi kayıt, şeffaf raporlama
- **Ölçek:**
  - 1: Preregistration yok
  - 2: Retrospektif kayıt
  - 3: Preregistration (temel)
  - 4: Detaylı preregistration
  - 5: Registered Report (altın standart)
- **Etkileşimler:**
  - I_321 (metodolojik hata) ile güçlü negatif korelasyon
  - I_133 (replikasyon) ile orta pozitif korelasyon

---

## 4. NORMALİZASYON FONKSİYONLARI

### 4.1 Logaritmik Normalizasyon

**Kullanım:** Geniş aralıklı nicel veriler (atıf, sosyal medya, patent vb.)

**Formül:**
```
N_log(x, x_max) = log(1 + x) / log(1 + x_max)
```

**Parametreler:**
- `x`: Ham değer
- `x_max`: Maksimum referans değer (1.0 normalize değerine karşılık gelir)

**Özellikler:**
- Küçük değerlerdeki artışlar büyük etki yapar
- Büyük değerlerdeki artışlar küçük etki yapar
- 0 değeri → 0.0
- x_max değeri → 1.0

**Uygulanan Göstergeler:**
- I_111: Atıf sayısı (x_max = 10,000)
- I_212: Sosyal medya (x_max = 10,000)
- I_232: Patent (x_max = 20)
- I_233: Startup (x_max = 10)

**Örnek:**
```
I_111 = 100 atıf
N(100) = log(1 + 100) / log(1 + 10000)
       = log(101) / log(10001)
       = 4.615 / 9.210
       = 0.501
```

### 4.2 Lineer Normalizasyon

**Kullanım:** Likert ölçekli nitel veriler (1-5 arası)

**Formül:**
```
N_lin(x) = (x - 1) / 4
```

**Özellikler:**
- 1 → 0.0
- 2 → 0.25
- 3 → 0.50
- 4 → 0.75
- 5 → 1.0

**Uygulanan Göstergeler:** Tüm Likert ölçekli göstergeler (23 adet)

**Örnek:**
```
I_112 = 4 (yüksek h-indeksi etkisi)
N(4) = (4 - 1) / 4 = 0.75
```

### 4.3 İkili Normalizasyon

**Kullanım:** Evet/Hayır, Var/Yok türü göstergeler

**Formül:**
```
N_bin(x) = x  (x ∈ {0, 1})
```

**Özellikler:**
- 0 → 0.0
- 1 → 1.0

**Uygulanan Göstergeler:**
- I_132: Ders kitabında yer alma
- I_222: Klinik kılavuz
- I_322: Çürütülme
- I_411: Etik onay
- I_412: Çıkar çatışması beyanı
- I_422: Açık erişim

**Örnek:**
```
I_411 = 1 (etik onay var)
N(1) = 1.0
```

### 4.4 Hibrit Normalizasyon

**Kullanım:** Özel durumlar (şu an kullanılmıyor, gelecek için rezerve)

**Formül:**
```
N_hyb(x) = α × N_log(x) + (1 - α) × N_lin(x)
```

**Parametreler:**
- `α`: Logaritmik ağırlık (0-1 arası)

---

## 5. AĞIRLIKLANDIRMA SİSTEMİ

### 5.1 Üç Seviyeli Ağırlıklandırma

**Seviye 1:** Gösterge ağırlıkları (w_ijk)
- Her göstergenin alt boyut içindeki ağırlığı
- Toplamı 1.0

**Seviye 2:** Alt boyut ağırlıkları (w_ij)
- Her alt boyutun ana boyut içindeki ağırlığı
- Toplamı 1.0

**Seviye 3:** Ana boyut ağırlıkları (W_i)
- Her ana boyutun HIS içindeki ağırlığı
- Toplamı 1.0 (D3 negatif olduğu için dikkat!)

### 5.2 Ağırlık Seçim Kriterleri

1. **Bilimsel Konsensüs:** Literatürde kabul görmüş önem sıralaması
2. **Pratik Etki:** Gerçek dünya sonuçlarına katkı
3. **Ölçülebilirlik:** Güvenilir veri toplama imkanı
4. **Denge:** Hiçbir gösterge tek başına dominant olmamalı

### 5.3 Ağırlık Tabloları

#### Ana Boyut Ağırlıkları (Seviye 3)

| Boyut | Ağırlık (W) | Gerekçe |
|-------|-------------|---------|
| D1 | 0.30 | Akademik etki temel, ama tek başına yeterli değil |
| D2 | 0.35 | Toplumsal etki en önemli (gerçek dünya) |
| D3 | -0.15 | Negatif etkiler cezalandırılmalı |
| D4 | 0.20 | Etik temel, ama diğerlerinden daha az ağırlıklı |

**Toplam:** 0.30 + 0.35 - 0.15 + 0.20 = 0.70 (normalize edilecek)

**Normalize Edilmiş Ağırlıklar:**
```
W_D1 = 0.30 / 0.70 = 0.429
W_D2 = 0.35 / 0.70 = 0.500
W_D3 = -0.15 / 0.70 = -0.214
W_D4 = 0.20 / 0.70 = 0.286
```

#### Alt Boyut Ağırlıkları (Seviye 2)

**D1: Akademik Etki**
- D1.1 (Atıf ve Tanınma): 0.40
- D1.2 (Disiplinlerarası Etki): 0.30
- D1.3 (Uzun Vadeli Etki): 0.30

**D2: Toplumsal Etki**
- D2.1 (Medya): 0.25
- D2.2 (Politika): 0.35
- D2.3 (Ekonomik): 0.40

**D3: Negatif Etki**
- D3.1 (Sosyal/Çevresel Zarar): 0.40
- D3.2 (Bilimsel Sorunlar): 0.35
- D3.3 (Yanlış Kullanım): 0.25

**D4: Etik**
- D4.1 (Etik Standartlar): 0.50
- D4.2 (Şeffaflık): 0.50

#### Gösterge Ağırlıkları (Seviye 1)

Her alt boyut için gösterge ağırlıkları yukarıdaki bölümlerde detaylı olarak verilmiştir.

---

## 6. ALT BOYUT HESAPLAMALARI

### 6.1 Genel Formül

```
S_ij = Σ (w_ijk × N_ijk)
```

Burada:
- `S_ij`: i. ana boyutun j. alt boyutunun skoru
- `w_ijk`: k. göstergenin ağırlığı
- `N_ijk`: k. göstergenin normalize edilmiş değeri

### 6.2 Örnek Hesaplama: D1.1 (Atıf ve Tanınma)

**Göstergeler ve Değerler:**
- I_111 = 500 atıf → N = 0.690
- I_112 = 4 (Likert) → N = 0.750
- I_113 = 3 (Likert) → N = 0.500
- I_114 = 2 (Likert) → N = 0.250

**Ağırlıklar:**
- w_111 = 0.30
- w_112 = 0.25
- w_113 = 0.25
- w_114 = 0.20

**Hesaplama:**
```
S_11 = (0.30 × 0.690) + (0.25 × 0.750) + (0.25 × 0.500) + (0.20 × 0.250)
     = 0.207 + 0.188 + 0.125 + 0.050
     = 0.570
```

### 6.3 Tüm Alt Boyutlar için Formüller

**D1.1:** `S_11 = 0.30×N_111 + 0.25×N_112 + 0.25×N_113 + 0.20×N_114`

**D1.2:** `S_12 = 0.30×N_121 + 0.30×N_122 + 0.25×N_123 + 0.15×N_124`

**D1.3:** `S_13 = 0.40×N_131 + 0.30×N_132 + 0.30×N_133`

**D2.1:** `S_21 = 0.35×N_211 + 0.30×N_212 + 0.35×N_213`

**D2.2:** `S_22 = 0.30×N_221 + 0.25×N_222 + 0.25×N_223 + 0.20×N_224`

**D2.3:** `S_23 = 0.30×N_231 + 0.25×N_232 + 0.25×N_233 + 0.20×N_234`

**D3.1:** `S_31 = 0.40×N_311 + 0.30×N_312 + 0.30×N_313`

**D3.2:** `S_32 = 0.35×N_321 + 0.40×N_322 + 0.25×N_323`

**D3.3:** `S_33 = 0.40×N_331 + 0.30×N_332 + 0.30×N_333`

**D4.1:** `S_41 = 0.40×N_411 + 0.30×N_412 + 0.30×N_413`

**D4.2:** `S_42 = 0.40×N_421 + 0.30×N_422 + 0.30×N_423`

---

## 7. ANA BOYUT HESAPLAMALARI

### 7.1 Genel Formül

```
D_i = Σ (w_ij × S_ij)
```

Burada:
- `D_i`: i. ana boyutun skoru
- `w_ij`: j. alt boyutun ağırlığı
- `S_ij`: j. alt boyutun skoru

### 7.2 Formüller

**D1 (Akademik Etki):**
```
D1 = 0.40 × S_11 + 0.30 × S_12 + 0.30 × S_13
```

**D2 (Toplumsal Etki):**
```
D2 = 0.25 × S_21 + 0.35 × S_22 + 0.40 × S_23
```

**D3 (Negatif Etki):**
```
D3 = 0.40 × S_31 + 0.35 × S_32 + 0.25 × S_33
```

**D4 (Etik):**
```
D4 = 0.50 × S_41 + 0.50 × S_42
```

### 7.3 Örnek Hesaplama

**Alt Boyut Skorları:**
- S_11 = 0.570
- S_12 = 0.650
- S_13 = 0.500

**Hesaplama:**
```
D1 = 0.40 × 0.570 + 0.30 × 0.650 + 0.30 × 0.500
   = 0.228 + 0.195 + 0.150
   = 0.573
```

---

## 8. BÜTÜNSEL ETKİ SKORU (HIS) HESAPLAMA

### 8.1 Temel Formül

```
HIS_raw = W_D1 × D1 + W_D2 × D2 + W_D3 × D3 + W_D4 × D4
```

**Normalize Edilmiş Ağırlıklarla:**
```
HIS_raw = 0.429 × D1 + 0.500 × D2 - 0.214 × D3 + 0.286 × D4
```

### 8.2 Etik Kapı Bekçisi Mekanizması

```
IF I_411 = 0 (etik onay yok) THEN
    HIS = min(HIS_raw × 100, 50)
ELSE
    HIS = HIS_raw × 100
END IF
```

**Gerekçe:** Etik onay olmayan çalışmalar, ne kadar etkili olursa olsun, maksimum 50 puan alabilir.

### 8.3 Hassasiyet Katsayıları (Opsiyonel)

**Etik Hassasiyet (k_E):**
```
HIS_adjusted = HIS × (1 + k_E × D4)
```

**Negatif Etki Hassasiyeti (k_N):**
```
HIS_adjusted = HIS × (1 - k_N × D3)
```

**Varsayılan Değerler:**
- k_E = 0.1 (etik yüksek olursa %10 bonus)
- k_N = 0.2 (negatif etki yüksek olursa %20 ceza)

### 8.4 Tam Hesaplama Örneği

**Ana Boyut Skorları:**
- D1 = 0.573
- D2 = 0.620
- D3 = 0.250
- D4 = 0.800

**HIS Hesaplama:**
```
HIS_raw = 0.429 × 0.573 + 0.500 × 0.620 - 0.214 × 0.250 + 0.286 × 0.800
        = 0.246 + 0.310 - 0.054 + 0.229
        = 0.731
```

**Etik Kontrolü:**
```
I_411 = 1 (etik onay var)
HIS = 0.731 × 100 = 73.1
```

**Hassasiyet Ayarlaması (opsiyonel):**
```
HIS_adjusted = 73.1 × (1 + 0.1 × 0.800) × (1 - 0.2 × 0.250)
             = 73.1 × 1.08 × 0.95
             = 74.9
```

---

## 9. PARAMETRELER ARASI ETKİLEŞİMLER

### 9.1 Pozitif Korelasyonlar

**Güçlü Pozitif (r > 0.7):**
- I_111 (atıf) ↔ I_112 (h-indeksi)
- I_121 (disiplinlerarası) ↔ I_122 (yeni alan)
- I_211 (medya) ↔ I_114 (ödül)
- I_231 (teknoloji transferi) ↔ I_232 (patent)
- I_231 (teknoloji transferi) ↔ I_233 (startup)
- I_321 (metodolojik hata) ↔ I_322 (çürütülme)
- I_411 (etik onay) ↔ I_413 (insan hakları)
- I_421 (veri paylaşımı) ↔ I_133 (replikasyon)

**Orta Pozitif (0.4 < r < 0.7):**
- I_111 (atıf) ↔ I_113 (prestijli dergi)
- I_122 (yeni alan) ↔ I_131 (uzun vadeli atıf)
- I_211 (medya) ↔ I_212 (sosyal medya)
- I_221 (politika) ↔ I_222 (klinik kılavuz)

### 9.2 Negatif Korelasyonlar

**Güçlü Negatif (r < -0.7):**
- I_322 (çürütülme) ↔ I_411 (etik onay)
- I_322 (çürütülme) ↔ I_133 (replikasyon)
- I_311 (negatif sosyal etki) ↔ I_411 (etik onay)
- I_321 (metodolojik hata) ↔ I_133 (replikasyon)

**Orta Negatif (-0.7 < r < -0.4):**
- I_111 (atıf) ↔ I_322 (çürütülme) [paradoks: ünlü çürütülmeler]
- I_332 (ticari manipülasyon) ↔ I_412 (çıkar çatışması beyanı)

### 9.3 Paradoksal İlişkiler

**1. Yüksek Atıf + Çürütülme:**
- Bazı çürütülmüş makaleler çok atıf alır (örn: aşı-otizm çalışması)
- Sistem bunu D3 (negatif etki) ile dengeler

**2. Yüksek Medya + Negatif Sosyal Etki:**
- Zararlı araştırmalar viral olabilir
- D3 skoru HIS'i düşürür

**3. Yüksek Ekonomik Değer + Ticari Manipülasyon:**
- Ticari başarı, manipülasyon riskini artırabilir
- D3.3 (yanlış kullanım) bunu yakalar

### 9.4 Etkileşim Matrisi (Özet)

| Gösterge | Güçlü Pozitif | Güçlü Negatif | Paradoksal |
|----------|---------------|---------------|------------|
| I_111 | I_112, I_121 | I_322 | I_322 (ünlü çürütülme) |
| I_211 | I_114, I_212 | - | I_311 (viral zarar) |
| I_231 | I_232, I_233 | - | I_332 (ticari manipülasyon) |
| I_322 | I_321 | I_411, I_133 | I_111 (ünlü çürütülme) |
| I_411 | I_413, I_421 | I_322, I_311 | - |

---

## 10. UÇ DURUMLAR VE ÖZEL SENARYOLAR

### 10.1 Sıfır Atıf Makalesi

**Senaryo:** Yeni yayınlanmış makale, henüz atıf almamış

**Etki:**
- I_111 = 0 → N = 0.0
- D1.1 düşük olur
- Ancak D2, D3, D4 yüksek olabilir
- HIS orta-düşük (20-40 arası)

**Örnek:**
- I_111 = 0, I_112 = 3, I_113 = 4, I_114 = 1
- D1.1 = 0.30×0 + 0.25×0.5 + 0.25×0.75 + 0.20×0 = 0.313
- Düşük akademik etki, ama diğer boyutlar yüksek olabilir

### 10.2 Viral Ama Zararlı Makale

**Senaryo:** Yüksek atıf ve medya, ama yanlış bilgi yayıyor

**Etki:**
- I_111 = 5000 → N = 0.908
- I_211 = 5 → N = 1.0
- I_323 = 5 → N = 1.0 (yanlış bilgi)
- D1 ve D2 yüksek, D3 çok yüksek
- HIS orta (D3'ün negatif katkısı nedeniyle)

**Örnek:**
- D1 = 0.80, D2 = 0.85, D3 = 0.90, D4 = 0.40
- HIS = 0.429×0.80 + 0.500×0.85 - 0.214×0.90 + 0.286×0.40
- HIS = 0.343 + 0.425 - 0.193 + 0.114 = 0.689
- HIS = 68.9 (orta-yüksek, ama D3 nedeniyle düşürüldü)

### 10.3 Etik Onaysız Çalışma

**Senaryo:** Yüksek etki, ama etik onay yok

**Etki:**
- I_411 = 0
- HIS maksimum 50'ye sınırlanır

**Örnek:**
- D1 = 0.90, D2 = 0.85, D3 = 0.20, D4 = 0.30
- HIS_raw = 0.429×0.90 + 0.500×0.85 - 0.214×0.20 + 0.286×0.30
- HIS_raw = 0.386 + 0.425 - 0.043 + 0.086 = 0.854
- HIS_raw × 100 = 85.4
- **Ancak I_411 = 0 → HIS = min(85.4, 50) = 50**

### 10.4 Sessiz Başarı

**Senaryo:** Düşük atıf, ama yüksek pratik etki

**Etki:**
- I_111 = 20 → N = 0.329
- I_231 = 5 → N = 1.0 (teknoloji transferi)
- I_221 = 5 → N = 1.0 (politika değişikliği)
- D1 düşük, D2 çok yüksek
- HIS orta-yüksek (D2'nin yüksek ağırlığı sayesinde)

**Örnek:**
- D1 = 0.35, D2 = 0.90, D3 = 0.15, D4 = 0.70
- HIS = 0.429×0.35 + 0.500×0.90 - 0.214×0.15 + 0.286×0.70
- HIS = 0.150 + 0.450 - 0.032 + 0.200 = 0.768
- HIS = 76.8 (yüksek!)

### 10.5 Çürütülmüş Ama Ünlü Makale

**Senaryo:** Çok atıf almış, ama sonra çürütülmüş

**Etki:**
- I_111 = 8000 → N = 0.976
- I_322 = 1 (çürütülme)
- D1 yüksek, D3.2 yüksek
- HIS orta (D3'ün negatif katkısı)

**Örnek:**
- D1 = 0.85, D2 = 0.60, D3 = 0.70, D4 = 0.30
- HIS = 0.429×0.85 + 0.500×0.60 - 0.214×0.70 + 0.286×0.30
- HIS = 0.365 + 0.300 - 0.150 + 0.086 = 0.601
- HIS = 60.1 (orta, D3 nedeniyle düşürüldü)

### 10.6 Tüm Veriler Eksik

**Senaryo:** Kullanıcı çoğu göstergeyi doldurmadı

**Etki:**
- Eksik göstergeler için varsayılan değerler kullanılır
- Varsayılan: Likert → 1, Nicel → 0, İkili → 0
- HIS çok düşük olur (10-20 arası)

**Öneri:** Minimum %70 veri doluluk oranı gerekli

---

## 11. HASSASİYET ANALİZİ

### 11.1 Ağırlık Hassasiyeti

**Soru:** Ana boyut ağırlıkları %10 değişirse, HIS ne kadar değişir?

**Analiz:**
```
ΔW_D1 = +0.03 (0.30 → 0.33)
ΔW_D2 = -0.03 (0.35 → 0.32)

ΔHIS = ΔW_D1 × D1 + ΔW_D2 × D2
     = 0.03 × 0.60 - 0.03 × 0.70
     = 0.018 - 0.021
     = -0.003

ΔHIS% = -0.3%
```

**Sonuç:** Ağırlıklara karşı **düşük hassasiyet** (robust sistem)

### 11.2 Gösterge Hassasiyeti

**En Etkili Göstergeler (HIS'e en çok katkı):**

1. **I_231 (Teknoloji Transferi):**
   - Ağırlık zinciri: 0.30 (D2.3) × 0.40 (D2) × 0.500 (HIS) = 0.060
   - 1 birim artış → HIS +6.0 puan

2. **I_221 (Politika Değişikliği):**
   - Ağırlık zinciri: 0.30 (D2.2) × 0.35 (D2) × 0.500 (HIS) = 0.053
   - 1 birim artış → HIS +5.3 puan

3. **I_111 (Atıf Sayısı):**
   - Ağırlık zinciri: 0.30 (D1.1) × 0.40 (D1) × 0.429 (HIS) = 0.051
   - Logaritmik normalizasyon nedeniyle etki azalır

**En Az Etkili Göstergeler:**

1. **I_124 (Teorik Katkı):**
   - Ağırlık zinciri: 0.15 (D1.2) × 0.30 (D1) × 0.429 (HIS) = 0.019
   - 1 birim artış → HIS +1.9 puan

2. **I_114 (Ödül):**
   - Ağırlık zinciri: 0.20 (D1.1) × 0.40 (D1) × 0.429 (HIS) = 0.034
   - 1 birim artış → HIS +3.4 puan

### 11.3 Negatif Etki Hassasiyeti

**Soru:** D3 (negatif etki) ne kadar etkili?

**Analiz:**
```
D3 = 0.0 → HIS = 0.429×D1 + 0.500×D2 + 0.286×D4
D3 = 1.0 → HIS = 0.429×D1 + 0.500×D2 - 0.214×1.0 + 0.286×D4

ΔH IS = -0.214 × 1.0 = -21.4 puan
```

**Sonuç:** Maksimum negatif etki, HIS'i **21.4 puan** düşürür (güçlü cezalandırma)

### 11.4 Etik Kapı Bekçisi Hassasiyeti

**Soru:** Etik onay ne kadar kritik?

**Analiz:**
```
I_411 = 1 → HIS = normal hesaplama
I_411 = 0 → HIS = min(HIS, 50)

Örnek: HIS_raw = 85
I_411 = 1 → HIS = 85
I_411 = 0 → HIS = 50

ΔHIS = -35 puan (-41%)
```

**Sonuç:** Etik onay **kritik öneme** sahip (maksimum 50 puan sınırı)

---

## 12. EKSİK VERİLER VE VARSAYILAN DEĞERLER

### 12.1 Eksik Veri Stratejisi

**Yaklaşım:** Muhafazakar varsayılan değerler

**Varsayılan Değerler:**
- **Likert (1-5):** 1 (en düşük)
- **Nicel (sayı):** 0
- **İkili (0/1):** 0 (hayır)

**Gerekçe:**
- Eksik veri, "bilmiyoruz" anlamına gelir
- Muhafazakar yaklaşım, abartıyı önler
- Kullanıcıyı veri toplamaya teşvik eder

### 12.2 Veri Kalitesi Göstergeleri

**Doluluk Oranı:**
```
Doluluk = (Doldurulmuş Gösterge Sayısı) / 33 × 100%
```

**Kalite Seviyeleri:**
- **Mükemmel:** > 90% (30+ gösterge)
- **İyi:** 70-90% (23-29 gösterge)
- **Orta:** 50-70% (17-22 gösterge)
- **Zayıf:** < 50% (< 17 gösterge)

**Öneri:** Minimum %70 doluluk için uyarı göster

### 12.3 Eksik Veri İmpütasyonu (Gelecek Özellik)

**Basit İmpütasyon:**
- Benzer makalelerin ortalaması
- Disiplin bazlı ortalamalar

**Gelişmiş İmpütasyon:**
- Makine öğrenmesi modelleri
- Benzerlik tabanlı tahmin

**Not:** Şu an için uygulanmıyor, gelecek versiyonlarda eklenebilir

---

## 13. GELİŞMİŞ ÖZELLİKLER

### 13.1 Zaman Serisi Analizi

**Amaç:** Makalenin etkisinin zamanla nasıl değiştiğini izlemek

**Yaklaşım:**
- Her yıl HIS'i yeniden hesapla
- Trend analizi (artıyor mu, azalıyor mu?)
- Erken uyarı sistemi (negatif etki artıyorsa)

**Formül:**
```
HIS_trend = (HIS_t - HIS_t-1) / HIS_t-1 × 100%
```

### 13.2 Disiplin Bazlı Normalizasyon

**Amaç:** Farklı disiplinlerin farklı atıf normlarını dikkate almak

**Yaklaşım:**
- Her disiplin için ayrı x_max değerleri
- Örnek: Tıp için x_max = 5000, Matematik için x_max = 500

**Formül:**
```
N_log(x, x_max_discipline) = log(1 + x) / log(1 + x_max_discipline)
```

### 13.3 Karşılaştırmalı Analiz

**Amaç:** Birden fazla makaleyi karşılaştırmak

**Özellikler:**
- Yan yana HIS skorları
- Radar chart (4 ana boyut)
- Gösterge bazlı karşılaştırma

**Görselleştirme:**
- Bar chart: HIS skorları
- Radar chart: D1, D2, D3, D4
- Heatmap: 33 gösterge

### 13.4 Senaryo Analizi

**Amaç:** "Ya ... olsaydı?" sorularını yanıtlamak

**Örnekler:**
- "Ya 1000 atıf daha alsaydı?"
- "Ya etik onay olsaydı?"
- "Ya negatif etki olmasaydı?"

**Hesaplama:**
```
HIS_scenario = f(modified_indicators)
ΔHIS = HIS_scenario - HIS_actual
```

### 13.5 Belirsizlik Analizi

**Amaç:** HIS skorunun güven aralığını hesaplamak

**Yaklaşım:**
- Monte Carlo simülasyonu
- Gösterge değerlerine ±%10 gürültü ekle
- 1000 simülasyon çalıştır
- %95 güven aralığı hesapla

**Formül:**
```
HIS_95%_CI = [HIS_mean - 1.96×σ, HIS_mean + 1.96×σ]
```

### 13.6 Makine Öğrenmesi Entegrasyonu

**Amaç:** Gösterge değerlerini otomatik tahmin etmek

**Veri Kaynakları:**
- Makale metni (NLP)
- Atıf veritabanları (API)
- Sosyal medya (Altmetric)
- Haber arşivleri (Google News)

**Modeller:**
- I_111 (atıf): Google Scholar API
- I_211 (medya): Haber arama + sayım
- I_212 (sosyal medya): Altmetric API
- I_321 (metodolojik hata): NLP + makale metni

### 13.7 Dinamik Ağırlıklandırma

**Amaç:** Kullanıcının önceliklerine göre ağırlıkları ayarlamak

**Profiller:**
- **Akademik Odaklı:** W_D1 = 0.50, W_D2 = 0.25
- **Toplumsal Odaklı:** W_D1 = 0.20, W_D2 = 0.50
- **Etik Odaklı:** W_D4 = 0.40, W_D3 = -0.25
- **Dengeli:** Varsayılan ağırlıklar

**Kullanım:**
```
HIS_custom = Σ (W_i_custom × D_i)
```

### 13.8 Kolektif Değerlendirme

**Amaç:** Birden fazla değerlendiricinin skorlarını birleştirmek

**Yaklaşım:**
- Her değerlendirici bağımsız değerlendirme yapar
- Skorlar birleştirilir (ortalama, medyan veya konsensüs)
- Değerlendiriciler arası güvenilirlik (ICC) hesaplanır

**Formül:**
```
HIS_collective = median(HIS_1, HIS_2, ..., HIS_n)
```

---

## SONUÇ VE ÖNERİLER

### Sistemin Güçlü Yönleri

1. **Çok Boyutlu:** Sadece atıf değil, 4 ana boyut
2. **Dengeli:** Pozitif ve negatif etkiler birlikte
3. **Şeffaf:** Tüm formüller açık
4. **Esneklik:** Ağırlıklar ayarlanabilir
5. **Kapsamlı:** 33 gösterge, tüm yönleri kapsar

### Sistemin Sınırlılıkları

1. **Veri Toplama:** 33 gösterge çok fazla olabilir
2. **Subjektivite:** Likert ölçekleri öznel
3. **Zaman:** Bazı etkiler yıllar sonra ortaya çıkar
4. **Disiplin Farklılıkları:** Tek model tüm disiplinlere uygun olmayabilir

### Gelecek Geliştirmeler

1. **Otomatik Veri Toplama:** API'ler ve web scraping
2. **Makine Öğrenmesi:** Gösterge tahmini
3. **Disiplin Özelleştirmesi:** Her disiplin için ayrı model
4. **Zaman Serisi:** Etkinin zamanla değişimi
5. **Belirsizlik Analizi:** Güven aralıkları

### Kullanım Önerileri

1. **Minimum Veri:** En az %70 gösterge doldurun
2. **Düzenli Güncelleme:** Yılda bir kez yeniden değerlendirin
3. **Karşılaştırma:** Benzer makalelerle karşılaştırın
4. **Senaryo Analizi:** "Ya ... olsaydı?" sorularını sorun
5. **Etik Öncelik:** Etik onay mutlaka olmalı

---

## EK: HIZLI REFERANS TABLOSU

### Tüm Göstergeler Özet Tablosu

| Kod | Gösterge | Tip | Norm. | Ağırlık | x_max |
|-----|----------|-----|-------|---------|-------|
| I_111 | Atıf Sayısı | Nicel | Log | 0.30 | 10000 |
| I_112 | h-indeksi Etkisi | Likert | Lin | 0.25 | - |
| I_113 | Prestijli Dergi | Likert | Lin | 0.25 | - |
| I_114 | Ödül | Likert | Lin | 0.20 | - |
| I_121 | Disiplinlerarası Atıf | Likert | Lin | 0.30 | - |
| I_122 | Yeni Alan | Likert | Lin | 0.30 | - |
| I_123 | Metodolojik Yenilik | Likert | Lin | 0.25 | - |
| I_124 | Teorik Katkı | Likert | Lin | 0.15 | - |
| I_131 | Uzun Vadeli Atıf | Likert | Lin | 0.40 | - |
| I_132 | Ders Kitabı | İkili | Bin | 0.30 | - |
| I_133 | Replikasyon | Likert | Lin | 0.30 | - |
| I_211 | Medya Görünürlüğü | Likert | Lin | 0.35 | - |
| I_212 | Sosyal Medya | Nicel | Log | 0.30 | 10000 |
| I_213 | Halk Bilinçlendirme | Likert | Lin | 0.35 | - |
| I_221 | Politika Değişikliği | Likert | Lin | 0.30 | - |
| I_222 | Klinik Kılavuz | İkili | Bin | 0.25 | - |
| I_223 | Karar Destek | Likert | Lin | 0.25 | - |
| I_224 | Uluslararası İşbirliği | Likert | Lin | 0.20 | - |
| I_231 | Teknoloji Transferi | Likert | Lin | 0.30 | - |
| I_232 | Patent | Nicel | Log | 0.25 | 20 |
| I_233 | Startup | Nicel | Log | 0.25 | 10 |
| I_234 | Ekonomik Değer | Likert | Lin | 0.20 | - |
| I_311 | Negatif Sosyal Etki | Likert | Lin | 0.40 | - |
| I_312 | Çevresel Zarar | Likert | Lin | 0.30 | - |
| I_313 | Güvenlik Riski | Likert | Lin | 0.30 | - |
| I_321 | Metodolojik Hata | Likert | Lin | 0.35 | - |
| I_322 | Çürütülme | İkili | Bin | 0.40 | - |
| I_323 | Yanlış Bilgi | Likert | Lin | 0.25 | - |
| I_331 | Kötü Kullanım | Likert | Lin | 0.40 | - |
| I_332 | Ticari Manipülasyon | Likert | Lin | 0.30 | - |
| I_333 | Siyasi Propaganda | Likert | Lin | 0.30 | - |
| I_411 | Etik Onay | İkili | Bin | 0.40 | - |
| I_412 | Çıkar Çatışması | İkili | Bin | 0.30 | - |
| I_413 | İnsan Hakları | Likert | Lin | 0.30 | - |
| I_421 | Veri Paylaşımı | Likert | Lin | 0.40 | - |
| I_422 | Açık Erişim | İkili | Bin | 0.30 | - |
| I_423 | Preregistration | Likert | Lin | 0.30 | - |

---

**Doküman Sonu**

Bu doküman, Akademik Makale Etki Değerlendirmesi sisteminin tam teknik spesifikasyonudur. Tüm parametreler, formüller, ağırlıklandırmalar, etkileşimler ve uç durumlar detaylı olarak açıklanmıştır.
