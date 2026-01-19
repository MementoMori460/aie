# AKADEMİK MAKALE ETKİ DEĞERLENDİRMESİ
## ADIM ADIM HESAPLAMA KILAVUZU

**Versiyon:** 2.0  
**Tarih:** 2026-01-06  
**Hedef Kitle:** Operatör, Araştırmacı, Değerlendirici

---

## İÇİNDEKİLER

1. [Genel Bakış ve Hesaplama Akışı](#1-genel-bakış-ve-hesaplama-akışı)
2. [Adım 1: Veri Toplama](#2-adım-1-veri-toplama)
3. [Adım 2: Normalizasyon](#3-adım-2-normalizasyon)
4. [Adım 3: Alt Boyut Hesaplama](#4-adım-3-alt-boyut-hesaplama)
5. [Adım 4: Ana Boyut Hesaplama](#5-adım-4-ana-boyut-hesaplama)
6. [Adım 5: HIS Hesaplama](#6-adım-5-his-hesaplama)
7. [Tam Örnek: Baştan Sona Hesaplama](#7-tam-örnek-baştan-sona-hesaplama)
8. [Hata Kontrolü ve Doğrulama](#8-hata-kontrolü-ve-doğrulama)
9. [Sık Sorulan Sorular](#9-sık-sorulan-sorular)

---

## 1. GENEL BAKIŞ VE HESAPLAMA AKIŞI

### 1.1 Hesaplama Sırası

```
┌─────────────────────────────────────────────────────────────┐
│ ADIM 1: VERİ TOPLAMA                                        │
│ ─────────────────────────────────────────────────────────── │
│ • 33 gösterge için ham veri topla                           │
│ • Veri kaynakları: Google Scholar, Altmetric, manuel gözlem │
│ • Süre: 30-60 dakika                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ADIM 2: NORMALİZASYON                                       │
│ ─────────────────────────────────────────────────────────── │
│ • Her göstergeyi 0-1 arasına normalize et                   │
│ • 4 normalizasyon fonksiyonu: Log, Lin, Bin, Hyb           │
│ • Süre: Otomatik (< 1 saniye)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ADIM 3: ALT BOYUT HESAPLAMA                                 │
│ ─────────────────────────────────────────────────────────── │
│ • 11 alt boyut skoru hesapla                                │
│ • Ağırlıklı toplam: S_ij = Σ(w_ijk × N_ijk)               │
│ • Süre: Otomatik (< 1 saniye)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ADIM 4: ANA BOYUT HESAPLAMA                                 │
│ ─────────────────────────────────────────────────────────── │
│ • 4 ana boyut skoru hesapla                                 │
│ • Ağırlıklı toplam: D_i = Σ(w_ij × S_ij)                  │
│ • Süre: Otomatik (< 1 saniye)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ADIM 5: HIS HESAPLAMA                                       │
│ ─────────────────────────────────────────────────────────── │
│ • Bütünsel Etki Skoru (HIS) hesapla                        │
│ • HIS = Σ(W_i × D_i) × 100                                 │
│ • Etik kapı bekçisi kontrolü                               │
│ • Süre: Otomatik (< 1 saniye)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ HIS SKORU     │
                    │ (0-100 arası) │
                    └───────────────┘
```

### 1.2 Gerekli Araçlar ve Kaynaklar

**Veri Kaynakları:**
1. **Google Scholar** - Atıf sayısı, h-indeksi
2. **Web of Science / Scopus** - Disiplinlerarası atıflar
3. **Altmetric** - Sosyal medya, medya görünürlüğü
4. **Patent Veritabanları** - USPTO, EPO, WIPO
5. **Politika Dokümanları** - Hükümet raporları, kılavuzlar
6. **Makale Metni** - Etik onay, metodoloji
7. **Manuel Gözlem** - Negatif etkiler, yanlış kullanım

**Hesaplama Araçları:**
- Excel / Google Sheets (manuel hesaplama)
- Python (otomatik hesaplama)
- Web uygulaması (tam otomatik)

### 1.3 Zaman Tahmini

| Adım | Manuel | Yarı-Otomatik | Tam Otomatik |
|------|--------|---------------|--------------|
| Veri Toplama | 30-60 dk | 15-30 dk | 5-10 dk (PDF yükleme) |
| Normalizasyon | 10-15 dk | < 1 sn | < 1 sn |
| Alt Boyut | 5-10 dk | < 1 sn | < 1 sn |
| Ana Boyut | 2-5 dk | < 1 sn | < 1 sn |
| HIS | 1-2 dk | < 1 sn | < 1 sn |
| **TOPLAM** | **48-92 dk** | **15-30 dk** | **5-10 dk** |

---

## 2. ADIM 1: VERİ TOPLAMA

### 2.1 Veri Toplama Şablonu

Her gösterge için aşağıdaki bilgileri toplayın:

```
┌──────────────────────────────────────────────────────────────┐
│ GÖSTERGE: I_111 - Toplam Atıf Sayısı                        │
├──────────────────────────────────────────────────────────────┤
│ TİP: Nicel (sayı)                                            │
│ VERİ KAYNAĞI: Google Scholar, Web of Science, Scopus        │
│ NASIL TOPLANIR:                                              │
│   1. Google Scholar'da makaleyi ara                          │
│   2. "Cited by" sayısını not et                              │
│   3. Web of Science'ta kontrol et                            │
│   4. En yüksek değeri kullan                                 │
│ NE ZAMAN: Değerlendirme anında (güncel veri)                 │
│ ÖRNEK DEĞER: 523                                             │
│ VARSAYILAN (eksikse): 0                                      │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 33 Gösterge İçin Veri Toplama Rehberi

#### **D1.1: Atıf ve Tanınma**

**I_111: Toplam Atıf Sayısı**
- **Nereden:** Google Scholar, Web of Science, Scopus
- **Nasıl:** 
  1. Google Scholar'da makale başlığını ara
  2. "Cited by XXX" sayısını not et
  3. Web of Science'ta da kontrol et (farklıysa en yüksek değeri al)
- **Ne Zaman:** Değerlendirme anında (güncel)
- **Örnek:** 523 atıf
- **Varsayılan:** 0

**I_112: h-indeksi Etkisi**
- **Nereden:** Yazarın Google Scholar profili
- **Nasıl:**
  1. Yazarın h-indeksini değerlendirme öncesi not et
  2. Bu makale olmadan h-indeksini tahmin et
  3. Farkı hesapla
  4. Likert ölçeğine çevir:
     - 0 fark → 1
     - +1 fark → 2
     - +2-3 fark → 3
     - +4-5 fark → 4
     - +6+ fark → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Yazar h-indeksi 25, bu makale olmasaydı 23 → fark 2 → Likert 3
- **Varsayılan:** 1

**I_113: Prestijli Dergi/Konferans Faktörü**
- **Nereden:** Journal Citation Reports, SCImago
- **Nasıl:**
  1. Derginin Impact Factor'ünü bul
  2. Likert ölçeğine çevir:
     - IF < 1 → 1
     - IF 1-3 → 2
     - IF 3-6 → 3
     - IF 6-10 → 4
     - IF > 10 veya Nature/Science → 5
- **Ne Zaman:** Makale yayınlandığında (sabit değer)
- **Örnek:** Nature Medicine (IF = 87.2) → Likert 5
- **Varsayılan:** 1

**I_114: Ödül ve Tanınma**
- **Nereden:** Makale sayfası, haber araması, ödül veritabanları
- **Nasıl:**
  1. Makale sayfasında ödül/tanınma var mı kontrol et
  2. Google'da "makale başlığı + award" ara
  3. Likert ölçeğine çevir:
     - Ödül yok → 1
     - Konferans best paper → 2
     - Dergi editör seçimi → 3
     - Ulusal bilim ödülü → 4
     - Nobel/Turing'e katkı → 5
- **Ne Zaman:** Değerlendirme anında (güncel)
- **Örnek:** Ödül yok → Likert 1
- **Varsayılan:** 1

#### **D1.2: Disiplinlerarası Etki**

**I_121: Disiplinlerarası Atıflar**
- **Nereden:** Web of Science, Scopus (atıf yapan dergilerin kategorileri)
- **Nasıl:**
  1. Web of Science'ta makaleyi aç
  2. "Citing Articles" → "Research Areas" bölümüne bak
  3. Farklı disiplin oranını hesapla
  4. Likert ölçeğine çevir:
     - < 10% farklı disiplin → 1
     - 10-25% → 2
     - 25-50% → 3
     - 50-75% → 4
     - > 75% → 5
- **Ne Zaman:** Değerlendirme anında (güncel)
- **Örnek:** 200 atıftan 80'i farklı disiplin → 40% → Likert 3
- **Varsayılan:** 1

**I_122: Yeni Araştırma Alanı Oluşturma**
- **Nereden:** Google Scholar (atıf yapan makalelerin konuları), literatür taraması
- **Nasıl:**
  1. Atıf yapan makalelerin başlıklarını/özetlerini incele
  2. Kaç tanesi bu makalenin açtığı yeni alana ait?
  3. Yeni konferans/dergi/workshop oluştu mu?
  4. Likert ölçeğine çevir:
     - Yeni alan yok → 1
     - < 10 takip çalışması → 2
     - 10-50 takip çalışması → 3
     - 50-200 takip çalışması → 4
     - > 200 + yeni konferans/dergi → 5
- **Ne Zaman:** Değerlendirme anında (güncel)
- **Örnek:** 15 takip çalışması → Likert 3
- **Varsayılan:** 1

**I_123: Metodolojik Yenilik**
- **Nereden:** Makale metni (Method bölümü), atıf yapan makaleler
- **Nasıl:**
  1. Makale yeni bir metot sunuyor mu?
  2. Bu metot başkaları tarafından kullanılıyor mu?
  3. Likert ölçeğine çevir:
     - Yenilik yok → 1
     - Küçük iyileştirme → 2
     - Yeni varyant → 3
     - Yeni metot → 4
     - Alan standardı → 5
- **Ne Zaman:** Makale yayınlandığında + değerlendirme anında
- **Örnek:** Yeni bir algoritma, 20+ makale kullanmış → Likert 4
- **Varsayılan:** 1

**I_124: Teorik Katkı**
- **Nereden:** Makale metni (Theory/Discussion bölümü)
- **Nasıl:**
  1. Makale teorik bir katkı sunuyor mu?
  2. Likert ölçeğine çevir:
     - Teorik katkı yok → 1
     - Küçük ekleme → 2
     - Yeni hipotez → 3
     - Yeni teori → 4
     - Temel teori (paradigma) → 5
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Ampirik çalışma, teorik katkı yok → Likert 1
- **Varsayılan:** 1

#### **D1.3: Uzun Vadeli Akademik Etki**

**I_131: Uzun Vadeli Atıf Trendi**
- **Nereden:** Google Scholar, Web of Science (yıllık atıf grafiği)
- **Nasıl:**
  1. Son 5 yılın yıllık atıf sayılarını not et
  2. Trend analizi yap (artıyor mu, azalıyor mu?)
  3. Likert ölçeğine çevir:
     - Azalan trend → 1
     - Sabit düşük (< 5/yıl) → 2
     - Sabit orta (5-20/yıl) → 3
     - Artan trend → 4
     - Exponential büyüme → 5
- **Ne Zaman:** Değerlendirme anında (en az 3 yıllık veri gerekli)
- **Örnek:** 2020: 10, 2021: 15, 2022: 25, 2023: 40, 2024: 60 → Artan → Likert 4
- **Varsayılan:** 2

**I_132: Ders Kitaplarında Yer Alma**
- **Nereden:** Google Books, ders kitabı araması, manuel kontrol
- **Nasıl:**
  1. Google Books'ta makale başlığını ara
  2. Ders kitaplarında referans gösterilmiş mi?
  3. İkili değer:
     - Yok → 0
     - Var → 1
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Bir ders kitabında referans var → 1
- **Varsayılan:** 0

**I_133: Replikasyon ve Doğrulama**
- **Nereden:** Google Scholar (atıf yapan makalelerin başlıkları/özetleri)
- **Nasıl:**
  1. Atıf yapan makalelerde "replication", "validation", "reproduction" anahtar kelimelerini ara
  2. Başarılı replikasyon sayısını say
  3. Likert ölçeğine çevir:
     - Replikasyon yok → 1
     - 1-2 başarısız → 2
     - 1-2 başarılı → 3
     - 3-5 başarılı → 4
     - > 5 başarılı → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 3 başarılı replikasyon → Likert 4
- **Varsayılan:** 1

#### **D2.1: Medya ve Kamuoyu Etkisi**

**I_211: Medya Görünürlüğü**
- **Nereden:** Altmetric, Google News, haber araması
- **Nasıl:**
  1. Altmetric skoruna bak (varsa)
  2. Google News'ta makale başlığını ara
  3. Haber sayısını say
  4. Likert ölçeğine çevir:
     - Medya yok → 1
     - Blog/yerel haber → 2
     - Ulusal haber (1-5) → 3
     - Uluslararası haber (5-20) → 4
     - Viral (> 20, TV) → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 8 ulusal haber → Likert 3
- **Varsayılan:** 1

**I_212: Sosyal Medya Etkisi**
- **Nereden:** Altmetric, Twitter/X arama, Reddit arama
- **Nasıl:**
  1. Altmetric skorundan sosyal medya sayısını al
  2. Twitter'da makale DOI/başlığını ara
  3. Toplam paylaşım/tartışma sayısını not et
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 1,234 tweet → 1234
- **Varsayılan:** 0

**I_213: Halk Bilinçlendirme**
- **Nereden:** Manuel gözlem, anket, haber analizi
- **Nasıl:**
  1. Makale halkın bilgi/davranışını değiştirdi mi?
  2. Kaç kişiye ulaştı? (tahmin)
  3. Likert ölçeğine çevir:
     - Bilinçlendirme yok → 1
     - < 1000 kişi → 2
     - 1000-10000 kişi → 3
     - 10000-100000 kişi → 4
     - > 100000 kişi + davranış değişikliği → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Medyada yer aldı, ~50000 kişiye ulaştı → Likert 4
- **Varsayılan:** 1

#### **D2.2: Politika ve Karar Alma Etkisi**

**I_221: Politika Değişikliği**
- **Nereden:** Hükümet raporları, yasa metinleri, politika dokümanları
- **Nasıl:**
  1. Makale bir politika dokümanında referans gösterildi mi?
  2. Yasa/düzenleme değişikliğine katkı sağladı mı?
  3. Likert ölçeğine çevir:
     - Politika etkisi yok → 1
     - Yerel politika tartışması → 2
     - Ulusal politika tartışması → 3
     - Yasa/düzenleme değişikliği → 4
     - Uluslararası anlaşma/protokol → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Bir ulusal raporda referans gösterildi → Likert 3
- **Varsayılan:** 1

**I_222: Klinik Kılavuz/Standart Entegrasyonu**
- **Nereden:** Klinik kılavuz dokümanları, endüstri standartları
- **Nasıl:**
  1. Makale bir klinik kılavuzda referans gösterildi mi?
  2. Endüstri standardına dahil edildi mi?
  3. İkili değer:
     - Yok → 0
     - Var → 1
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** WHO kılavuzunda referans var → 1
- **Varsayılan:** 0

**I_223: Karar Destek Sistemlerinde Kullanım**
- **Nereden:** Yazılım dokümanları, API referansları, ürün açıklamaları
- **Nasıl:**
  1. Makaleye dayalı karar destek aracı var mı?
  2. Kaç araç/yazılımda kullanılıyor?
  3. Likert ölçeğine çevir:
     - Kullanım yok → 1
     - 1-2 araç → 2
     - 3-5 araç → 3
     - 5-20 araç → 4
     - > 20 araç, FDA onaylı → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 2 karar destek yazılımında kullanılıyor → Likert 2
- **Varsayılan:** 1

**I_224: Uluslararası İşbirliği ve Anlaşmalar**
- **Nereden:** Uluslararası anlaşma metinleri, BM/WHO dokümanları
- **Nasıl:**
  1. Makale uluslararası bir anlaşmada referans gösterildi mi?
  2. Kaç ülke dahil?
  3. Likert ölçeğine çevir:
     - İşbirliği yok → 1
     - İkili (2 ülke) → 2
     - Bölgesel (3-10 ülke) → 3
     - Küresel (> 10 ülke) → 4
     - BM/WHO protokolü → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** İşbirliği yok → Likert 1
- **Varsayılan:** 1

#### **D2.3: Ekonomik ve Teknolojik Etki**

**I_231: Teknoloji Transferi ve Ticarileştirme**
- **Nereden:** Şirket web siteleri, ürün dokümanları, haber araması
- **Nasıl:**
  1. Makaleye dayalı ticari ürün var mı?
  2. Kaç müşteri/kullanıcı?
  3. Likert ölçeğine çevir:
     - Ticarileştirme yok → 1
     - Prototip → 2
     - Pilot (< 10 müşteri) → 3
     - Ticari ürün (10-1000 müşteri) → 4
     - Kitlesel ürün (> 1000 müşteri) → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Ticarileştirme yok → Likert 1
- **Varsayılan:** 1

**I_232: Patent ve Fikri Mülkiyet**
- **Nereden:** Google Patents, USPTO, EPO, WIPO
- **Nasıl:**
  1. Makale başlığı/yazarlarla patent ara
  2. Makaleye dayalı patent sayısını say
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 2 patent → 2
- **Varsayılan:** 0

**I_233: Startup ve Girişim Oluşturma**
- **Nereden:** Crunchbase, AngelList, haber araması, üniversite TTO
- **Nasıl:**
  1. Makaleye dayalı kurulan startup var mı?
  2. Startup sayısını say
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** 1 startup → 1
- **Varsayılan:** 0

**I_234: Ekonomik Değer Yaratma**
- **Nereden:** Şirket raporları, haber araması, tahmin
- **Nasıl:**
  1. Makaleye dayalı ekonomik değer var mı? (gelir, tasarruf, istihdam)
  2. Tahmini değer?
  3. Likert ölçeğine çevir:
     - Ekonomik değer yok → 1
     - < $100K → 2
     - $100K - $1M → 3
     - $1M - $10M → 4
     - > $10M → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Ekonomik değer yok → Likert 1
- **Varsayılan:** 1

#### **D3.1: Sosyal ve Çevresel Zarar**

**I_311: Negatif Sosyal Etki**
- **Nereden:** Haber araması, eleştiri makaleleri, sosyal medya
- **Nasıl:**
  1. Makale sosyal zarara yol açtı mı? (eşitsizlik, ayrımcılık)
  2. Likert ölçeğine çevir:
     - Sosyal zarar yok → 1
     - Küçük risk → 2
     - Orta zarar → 3
     - Büyük zarar → 4
     - Kitlesel zarar → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Sosyal zarar yok → Likert 1
- **Varsayılan:** 1

**I_312: Çevresel Zarar**
- **Nereden:** Çevre raporları, haber araması, eleştiri makaleleri
- **Nasıl:**
  1. Makale çevresel zarara yol açtı mı?
  2. Likert ölçeğine çevir:
     - Çevresel zarar yok → 1
     - Küçük risk → 2
     - Yerel zarar → 3
     - Bölgesel zarar → 4
     - Küresel zarar → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Çevresel zarar yok → Likert 1
- **Varsayılan:** 1

**I_313: Güvenlik ve Mahremiyet Riskleri**
- **Nereden:** Güvenlik raporları, CVE veritabanı, haber araması
- **Nasıl:**
  1. Makale güvenlik/mahremiyet riskine yol açtı mı?
  2. Likert ölçeğine çevir:
     - Risk yok → 1
     - Teorik zafiyet → 2
     - Belgelenmiş zafiyet → 3
     - Aktif saldırı → 4
     - Kitlesel veri ihlali → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Risk yok → Likert 1
- **Varsayılan:** 1

#### **D3.2: Bilimsel Güvenilirlik Sorunları**

**I_321: Metodolojik Hatalar**
- **Nereden:** Makale metni, eleştiri makaleleri, retraction watch
- **Nasıl:**
  1. Makale metodolojik hata içeriyor mu?
  2. Likert ölçeğine çevir:
     - Hata yok → 1
     - Tartışmalı analiz → 2
     - Belgelenmiş hata → 3
     - Sonuçları etkileyen hata → 4
     - Sonuçlar geçersiz → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Hata yok → Likert 1
- **Varsayılan:** 1

**I_322: Çürütülme ve Geri Çekilme**
- **Nereden:** Retraction Watch, dergi web sitesi
- **Nasıl:**
  1. Makale geri çekildi mi?
  2. Önemli bulguları çürütüldü mü?
  3. İkili değer:
     - Hayır → 0
     - Evet → 1
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Geri çekilme yok → 0
- **Varsayılan:** 0

**I_323: Yanlış Bilgi Yayılımı**
- **Nereden:** Fact-checking siteleri, haber araması, sosyal medya
- **Nasıl:**
  1. Makale yanlış yorumlandı mı?
  2. Yanlış bilgi kaynağı oldu mu?
  3. Likert ölçeğine çevir:
     - Yanlış bilgi yok → 1
     - Küçük yanlış yorum → 2
     - Medyada yanlış aktarım → 3
     - Yaygın yanlış inanç → 4
     - Kitlesel yanlış bilgi → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Yanlış bilgi yok → Likert 1
- **Varsayılan:** 1

#### **D3.3: Yanlış Kullanım ve Manipülasyon**

**I_331: Kötü Amaçlı Kullanım**
- **Nereden:** Haber araması, güvenlik raporları, etik tartışmalar
- **Nasıl:**
  1. Makale kötü amaçlı kullanıldı mı? (silah, gözetim, manipülasyon)
  2. Likert ölçeğine çevir:
     - Kötü kullanım yok → 1
     - Potansiyel risk → 2
     - Belgelenmiş kötü kullanım → 3
     - Yaygın kötü kullanım → 4
     - Kitlesel kötü kullanım → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Kötü kullanım yok → Likert 1
- **Varsayılan:** 1

**I_332: Ticari Manipülasyon**
- **Nereden:** Makale metni (çıkar çatışması), eleştiri makaleleri, haber
- **Nasıl:**
  1. Ticari çıkar için sonuçlar manipüle edildi mi?
  2. Likert ölçeğine çevir:
     - Manipülasyon yok → 1
     - Açıklanmış çıkar çatışması → 2
     - Sponsor etkisi → 3
     - Sonuçlar çarpıtıldı → 4
     - Sistematik manipülasyon → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Manipülasyon yok → Likert 1
- **Varsayılan:** 1

**I_333: Siyasi Propaganda**
- **Nereden:** Haber araması, siyasi dokümanlar, eleştiri makaleleri
- **Nasıl:**
  1. Makale siyasi propaganda için kullanıldı mı?
  2. Likert ölçeğine çevir:
     - Propaganda yok → 1
     - Küçük siyasi referans → 2
     - Siyasi aktörler tarafından kullanım → 3
     - Sistematik kullanım → 4
     - Devlet propaganda → 5
- **Ne Zaman:** Değerlendirme anında
- **Örnek:** Propaganda yok → Likert 1
- **Varsayılan:** 1

#### **D4.1: Etik Standartlar**

**I_411: Etik Onay ve Uyum**
- **Nereden:** Makale metni (Ethics Statement)
- **Nasıl:**
  1. Makale etik onay gerektiriyor mu? (insan/hayvan deneyi)
  2. Etik onay var mı?
  3. İkili değer:
     - Etik onay yok (gerekli olmasına rağmen) → 0
     - Etik onay var veya gerekli değil → 1
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Etik onay var → 1
- **Varsayılan:** 1 (çoğu makale etik onay gerektirmez)

**I_412: Çıkar Çatışması Beyanı**
- **Nereden:** Makale metni (Conflict of Interest Statement)
- **Nasıl:**
  1. Makale çıkar çatışması beyanı içeriyor mu?
  2. İkili değer:
     - Beyan yok → 0
     - Beyan var (var veya yok) → 1
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Beyan var ("No conflicts") → 1
- **Varsayılan:** 0

**I_413: İnsan/Hayvan Hakları Uyumu**
- **Nereden:** Makale metni (Methods, Ethics)
- **Nasıl:**
  1. Makale insan/hayvan deneyi içeriyor mu?
  2. Helsinki Deklarasyonu'na uygun mu?
  3. Likert ölçeğine çevir:
     - Ciddi ihlal → 1
     - Orta ihlal → 2
     - Minimum uyum → 3
     - İyi uyum → 4
     - Örnek uyum → 5
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** İnsan deneyi yok, N/A → Likert 3 (varsayılan)
- **Varsayılan:** 3

#### **D4.2: Şeffaflık ve Açık Bilim**

**I_421: Veri ve Kod Paylaşımı**
- **Nereden:** Makale metni (Data Availability Statement), GitHub, Zenodo
- **Nasıl:**
  1. Veri paylaşıldı mı?
  2. Kod paylaşıldı mı?
  3. Likert ölçeğine çevir:
     - Hiçbir şey paylaşılmadı → 1
     - Talep üzerine → 2
     - Kısmi paylaşım (veri veya kod) → 3
     - Tam paylaşım (veri + kod) → 4
     - Altın standart (veri + kod + materyal + dok) → 5
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Veri GitHub'da paylaşılmış → Likert 3
- **Varsayılan:** 1

**I_422: Açık Erişim Yayın**
- **Nereden:** Makale web sitesi
- **Nasıl:**
  1. Makale açık erişimli mi? (herkes okuyabilir mi?)
  2. İkili değer:
     - Kapalı erişim (paywall) → 0
     - Açık erişim → 1
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Açık erişim → 1
- **Varsayılan:** 0

**I_423: Preregistration ve Şeffaflık**
- **Nereden:** Preregistration platformları (OSF, ClinicalTrials.gov)
- **Nasıl:**
  1. Çalışma önceden kaydedildi mi?
  2. Likert ölçeğine çevir:
     - Preregistration yok → 1
     - Retrospektif kayıt → 2
     - Preregistration (temel) → 3
     - Detaylı preregistration → 4
     - Registered Report → 5
- **Ne Zaman:** Makale yayınlandığında
- **Örnek:** Preregistration yok → Likert 1
- **Varsayılan:** 1

### 2.3 Veri Toplama Kontrol Listesi

```
☐ D1.1: Atıf ve Tanınma (4 gösterge)
  ☐ I_111: Atıf sayısı
  ☐ I_112: h-indeksi etkisi
  ☐ I_113: Prestijli dergi
  ☐ I_114: Ödül

☐ D1.2: Disiplinlerarası Etki (4 gösterge)
  ☐ I_121: Disiplinlerarası atıf
  ☐ I_122: Yeni alan
  ☐ I_123: Metodolojik yenilik
  ☐ I_124: Teorik katkı

☐ D1.3: Uzun Vadeli Etki (3 gösterge)
  ☐ I_131: Uzun vadeli atıf trendi
  ☐ I_132: Ders kitabı
  ☐ I_133: Replikasyon

☐ D2.1: Medya Etkisi (3 gösterge)
  ☐ I_211: Medya görünürlüğü
  ☐ I_212: Sosyal medya
  ☐ I_213: Halk bilinçlendirme

☐ D2.2: Politika Etkisi (4 gösterge)
  ☐ I_221: Politika değişikliği
  ☐ I_222: Klinik kılavuz
  ☐ I_223: Karar destek
  ☐ I_224: Uluslararası işbirliği

☐ D2.3: Ekonomik Etki (4 gösterge)
  ☐ I_231: Teknoloji transferi
  ☐ I_232: Patent
  ☐ I_233: Startup
  ☐ I_234: Ekonomik değer

☐ D3.1: Sosyal/Çevresel Zarar (3 gösterge)
  ☐ I_311: Negatif sosyal etki
  ☐ I_312: Çevresel zarar
  ☐ I_313: Güvenlik riski

☐ D3.2: Bilimsel Sorunlar (3 gösterge)
  ☐ I_321: Metodolojik hata
  ☐ I_322: Çürütülme
  ☐ I_323: Yanlış bilgi

☐ D3.3: Yanlış Kullanım (3 gösterge)
  ☐ I_331: Kötü kullanım
  ☐ I_332: Ticari manipülasyon
  ☐ I_333: Siyasi propaganda

☐ D4.1: Etik Standartlar (3 gösterge)
  ☐ I_411: Etik onay
  ☐ I_412: Çıkar çatışması
  ☐ I_413: İnsan hakları

☐ D4.2: Şeffaflık (3 gösterge)
  ☐ I_421: Veri paylaşımı
  ☐ I_422: Açık erişim
  ☐ I_423: Preregistration

TOPLAM: 33 gösterge
```

---

## 3. ADIM 2: NORMALİZASYON

### 3.1 Normalizasyon Nedir ve Neden Gerekli?

**Amaç:** Farklı ölçeklerdeki göstergeleri 0-1 arasına getirmek

**Neden:**
- I_111 (atıf) 0-10000 arasında
- I_112 (Likert) 1-5 arasında
- I_411 (ikili) 0-1 arasında

Bu değerleri doğrudan toplayamayız! Önce hepsini 0-1 arasına normalize etmeliyiz.

### 3.2 Normalizasyon Fonksiyonları

#### **Fonksiyon 1: Logaritmik Normalizasyon**

**Kullanım:** Geniş aralıklı nicel veriler

**Formül:**
```
N_log(x, x_max) = log(1 + x) / log(1 + x_max)
```

**Parametreler:**
- `x`: Ham değer (kullanıcıdan alınan)
- `x_max`: Maksimum referans değer (sabit, önceden tanımlı)

**Nerede Kullanılır:**
- I_111: Atıf sayısı (x_max = 10,000)
- I_212: Sosyal medya (x_max = 10,000)
- I_232: Patent (x_max = 20)
- I_233: Startup (x_max = 10)

**Hesaplama Adımları:**

```
ADIM 1: Ham değeri al
  x = 523 (atıf sayısı)

ADIM 2: x_max değerini belirle
  x_max = 10,000 (I_111 için sabit)

ADIM 3: log(1 + x) hesapla
  log(1 + 523) = log(524) = 6.261 (doğal logaritma)

ADIM 4: log(1 + x_max) hesapla
  log(1 + 10000) = log(10001) = 9.210

ADIM 5: Böl
  N = 6.261 / 9.210 = 0.680

SONUÇ: N_111 = 0.680
```

**Excel Formülü:**
```
=LN(1 + A1) / LN(1 + 10000)
```
(A1 hücresinde ham değer var)

**Python Kodu:**
```python
import math

def normalize_log(x, x_max):
    return math.log(1 + x) / math.log(1 + x_max)

# Örnek
x = 523
x_max = 10000
N = normalize_log(x, x_max)
print(f"N = {N:.3f}")  # 0.680
```

#### **Fonksiyon 2: Lineer Normalizasyon**

**Kullanım:** Likert ölçekli (1-5) nitel veriler

**Formül:**
```
N_lin(x) = (x - 1) / 4
```

**Parametreler:**
- `x`: Likert değeri (1, 2, 3, 4 veya 5)

**Nerede Kullanılır:** Tüm Likert ölçekli göstergeler (23 adet)

**Hesaplama Adımları:**

```
ADIM 1: Likert değerini al
  x = 4

ADIM 2: 1 çıkar
  x - 1 = 4 - 1 = 3

ADIM 3: 4'e böl
  N = 3 / 4 = 0.75

SONUÇ: N = 0.75
```

**Dönüşüm Tablosu:**
| Likert | Hesaplama | Normalize |
|--------|-----------|-----------|
| 1 | (1-1)/4 | 0.00 |
| 2 | (2-1)/4 | 0.25 |
| 3 | (3-1)/4 | 0.50 |
| 4 | (4-1)/4 | 0.75 |
| 5 | (5-1)/4 | 1.00 |

**Excel Formülü:**
```
=(A1 - 1) / 4
```

**Python Kodu:**
```python
def normalize_linear(x):
    return (x - 1) / 4

# Örnek
x = 4
N = normalize_linear(x)
print(f"N = {N:.2f}")  # 0.75
```

#### **Fonksiyon 3: İkili Normalizasyon**

**Kullanım:** Evet/Hayır, Var/Yok türü göstergeler

**Formül:**
```
N_bin(x) = x  (x ∈ {0, 1})
```

**Parametreler:**
- `x`: İkili değer (0 veya 1)

**Nerede Kullanılır:**
- I_132: Ders kitabı
- I_222: Klinik kılavuz
- I_322: Çürütülme
- I_411: Etik onay
- I_412: Çıkar çatışması
- I_422: Açık erişim

**Hesaplama Adımları:**

```
ADIM 1: İkili değeri al
  x = 1 (evet)

ADIM 2: Olduğu gibi kullan
  N = x = 1

SONUÇ: N = 1.00
```

**Dönüşüm Tablosu:**
| İkili | Normalize |
|-------|-----------|
| 0 (Hayır) | 0.00 |
| 1 (Evet) | 1.00 |

**Excel Formülü:**
```
=A1
```

**Python Kodu:**
```python
def normalize_binary(x):
    return x

# Örnek
x = 1
N = normalize_binary(x)
print(f"N = {N:.2f}")  # 1.00
```

### 3.3 Tüm 33 Gösterge İçin Normalizasyon Tablosu

| Kod | Gösterge | Tip | Norm. Fonk. | x_max | Örnek Ham | Örnek Normalize |
|-----|----------|-----|-------------|-------|-----------|-----------------|
| I_111 | Atıf | Nicel | Log | 10000 | 523 | 0.680 |
| I_112 | h-indeksi | Likert | Lin | - | 4 | 0.750 |
| I_113 | Dergi | Likert | Lin | - | 3 | 0.500 |
| I_114 | Ödül | Likert | Lin | - | 1 | 0.000 |
| I_121 | Disiplinlerarası | Likert | Lin | - | 3 | 0.500 |
| I_122 | Yeni alan | Likert | Lin | - | 3 | 0.500 |
| I_123 | Metod. yenilik | Likert | Lin | - | 4 | 0.750 |
| I_124 | Teorik katkı | Likert | Lin | - | 1 | 0.000 |
| I_131 | Uzun vadeli atıf | Likert | Lin | - | 4 | 0.750 |
| I_132 | Ders kitabı | İkili | Bin | - | 0 | 0.000 |
| I_133 | Replikasyon | Likert | Lin | - | 3 | 0.500 |
| I_211 | Medya | Likert | Lin | - | 3 | 0.500 |
| I_212 | Sosyal medya | Nicel | Log | 10000 | 1234 | 0.758 |
| I_213 | Halk bilinç. | Likert | Lin | - | 4 | 0.750 |
| I_221 | Politika | Likert | Lin | - | 3 | 0.500 |
| I_222 | Klinik kılavuz | İkili | Bin | - | 0 | 0.000 |
| I_223 | Karar destek | Likert | Lin | - | 2 | 0.250 |
| I_224 | Uluslararası | Likert | Lin | - | 1 | 0.000 |
| I_231 | Tek. transferi | Likert | Lin | - | 1 | 0.000 |
| I_232 | Patent | Nicel | Log | 20 | 2 | 0.368 |
| I_233 | Startup | Nicel | Log | 10 | 1 | 0.288 |
| I_234 | Ekonomik değer | Likert | Lin | - | 1 | 0.000 |
| I_311 | Neg. sosyal | Likert | Lin | - | 1 | 0.000 |
| I_312 | Çevresel zarar | Likert | Lin | - | 1 | 0.000 |
| I_313 | Güvenlik riski | Likert | Lin | - | 1 | 0.000 |
| I_321 | Metod. hata | Likert | Lin | - | 1 | 0.000 |
| I_322 | Çürütülme | İkili | Bin | - | 0 | 0.000 |
| I_323 | Yanlış bilgi | Likert | Lin | - | 1 | 0.000 |
| I_331 | Kötü kullanım | Likert | Lin | - | 1 | 0.000 |
| I_332 | Ticari manip. | Likert | Lin | - | 1 | 0.000 |
| I_333 | Siyasi prop. | Likert | Lin | - | 1 | 0.000 |
| I_411 | Etik onay | İkili | Bin | - | 1 | 1.000 |
| I_412 | Çıkar çatışması | İkili | Bin | - | 1 | 1.000 |
| I_413 | İnsan hakları | Likert | Lin | - | 3 | 0.500 |
| I_421 | Veri paylaşımı | Likert | Lin | - | 3 | 0.500 |
| I_422 | Açık erişim | İkili | Bin | - | 1 | 1.000 |
| I_423 | Preregistration | Likert | Lin | - | 1 | 0.000 |

---

## 4. ADIM 3: ALT BOYUT HESAPLAMA

### 4.1 Alt Boyut Nedir?

**Tanım:** Birkaç göstergenin ağırlıklı toplamı

**Formül:**
```
S_ij = Σ (w_ijk × N_ijk)
```

**Parametreler:**
- `S_ij`: i. ana boyutun j. alt boyutunun skoru
- `w_ijk`: k. göstergenin ağırlığı (sabit, önceden tanımlı)
- `N_ijk`: k. göstergenin normalize edilmiş değeri (Adım 2'den)

### 4.2 Alt Boyut Hesaplama Şablonu

```
┌──────────────────────────────────────────────────────────────┐
│ ALT BOYUT: D1.1 - Atıf ve Tanınma                            │
├──────────────────────────────────────────────────────────────┤
│ GÖSTERGELER:                                                 │
│   I_111: Atıf sayısı                                         │
│   I_112: h-indeksi etkisi                                    │
│   I_113: Prestijli dergi                                     │
│   I_114: Ödül                                                │
├──────────────────────────────────────────────────────────────┤
│ AĞIRLIKLAR (w):                                              │
│   w_111 = 0.30                                               │
│   w_112 = 0.25                                               │
│   w_113 = 0.25                                               │
│   w_114 = 0.20                                               │
│   TOPLAM = 1.00 ✓                                            │
├──────────────────────────────────────────────────────────────┤
│ NORMALIZE DEĞERLER (N):                                      │
│   N_111 = 0.680 (Adım 2'den)                                 │
│   N_112 = 0.750                                              │
│   N_113 = 0.500                                              │
│   N_114 = 0.000                                              │
├──────────────────────────────────────────────────────────────┤
│ HESAPLAMA:                                                   │
│   S_11 = w_111×N_111 + w_112×N_112 + w_113×N_113 + w_114×N_114│
│        = 0.30×0.680 + 0.25×0.750 + 0.25×0.500 + 0.20×0.000  │
│        = 0.204 + 0.188 + 0.125 + 0.000                       │
│        = 0.517                                               │
├──────────────────────────────────────────────────────────────┤
│ SONUÇ: S_11 = 0.517                                          │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Tüm 11 Alt Boyut İçin Hesaplama

#### **D1.1: Atıf ve Tanınma**

**Formül:**
```
S_11 = 0.30×N_111 + 0.25×N_112 + 0.25×N_113 + 0.20×N_114
```

**Hesaplama:**
```
Adım 1: Normalize değerleri al
  N_111 = 0.680
  N_112 = 0.750
  N_113 = 0.500
  N_114 = 0.000

Adım 2: Ağırlıklarla çarp
  0.30 × 0.680 = 0.204
  0.25 × 0.750 = 0.188
  0.25 × 0.500 = 0.125
  0.20 × 0.000 = 0.000

Adım 3: Topla
  S_11 = 0.204 + 0.188 + 0.125 + 0.000 = 0.517
```

**Excel Formülü:**
```
=0.30*N111 + 0.25*N112 + 0.25*N113 + 0.20*N114
```

**Python Kodu:**
```python
def calc_S11(N_111, N_112, N_113, N_114):
    return 0.30*N_111 + 0.25*N_112 + 0.25*N_113 + 0.20*N_114

S_11 = calc_S11(0.680, 0.750, 0.500, 0.000)
print(f"S_11 = {S_11:.3f}")  # 0.517
```

#### **D1.2: Disiplinlerarası Etki**

**Formül:**
```
S_12 = 0.30×N_121 + 0.30×N_122 + 0.25×N_123 + 0.15×N_124
```

**Hesaplama:**
```
N_121 = 0.500, N_122 = 0.500, N_123 = 0.750, N_124 = 0.000

S_12 = 0.30×0.500 + 0.30×0.500 + 0.25×0.750 + 0.15×0.000
     = 0.150 + 0.150 + 0.188 + 0.000
     = 0.488
```

#### **D1.3: Uzun Vadeli Akademik Etki**

**Formül:**
```
S_13 = 0.40×N_131 + 0.30×N_132 + 0.30×N_133
```

**Hesaplama:**
```
N_131 = 0.750, N_132 = 0.000, N_133 = 0.500

S_13 = 0.40×0.750 + 0.30×0.000 + 0.30×0.500
     = 0.300 + 0.000 + 0.150
     = 0.450
```

#### **D2.1: Medya ve Kamuoyu Etkisi**

**Formül:**
```
S_21 = 0.35×N_211 + 0.30×N_212 + 0.35×N_213
```

**Hesaplama:**
```
N_211 = 0.500, N_212 = 0.758, N_213 = 0.750

S_21 = 0.35×0.500 + 0.30×0.758 + 0.35×0.750
     = 0.175 + 0.227 + 0.263
     = 0.665
```

#### **D2.2: Politika ve Karar Alma Etkisi**

**Formül:**
```
S_22 = 0.30×N_221 + 0.25×N_222 + 0.25×N_223 + 0.20×N_224
```

**Hesaplama:**
```
N_221 = 0.500, N_222 = 0.000, N_223 = 0.250, N_224 = 0.000

S_22 = 0.30×0.500 + 0.25×0.000 + 0.25×0.250 + 0.20×0.000
     = 0.150 + 0.000 + 0.063 + 0.000
     = 0.213
```

#### **D2.3: Ekonomik ve Teknolojik Etki**

**Formül:**
```
S_23 = 0.30×N_231 + 0.25×N_232 + 0.25×N_233 + 0.20×N_234
```

**Hesaplama:**
```
N_231 = 0.000, N_232 = 0.368, N_233 = 0.288, N_234 = 0.000

S_23 = 0.30×0.000 + 0.25×0.368 + 0.25×0.288 + 0.20×0.000
     = 0.000 + 0.092 + 0.072 + 0.000
     = 0.164
```

#### **D3.1: Sosyal ve Çevresel Zarar**

**Formül:**
```
S_31 = 0.40×N_311 + 0.30×N_312 + 0.30×N_313
```

**Hesaplama:**
```
N_311 = 0.000, N_312 = 0.000, N_313 = 0.000

S_31 = 0.40×0.000 + 0.30×0.000 + 0.30×0.000
     = 0.000
```

#### **D3.2: Bilimsel Güvenilirlik Sorunları**

**Formül:**
```
S_32 = 0.35×N_321 + 0.40×N_322 + 0.25×N_323
```

**Hesaplama:**
```
N_321 = 0.000, N_322 = 0.000, N_323 = 0.000

S_32 = 0.35×0.000 + 0.40×0.000 + 0.25×0.000
     = 0.000
```

#### **D3.3: Yanlış Kullanım ve Manipülasyon**

**Formül:**
```
S_33 = 0.40×N_331 + 0.30×N_332 + 0.30×N_333
```

**Hesaplama:**
```
N_331 = 0.000, N_332 = 0.000, N_333 = 0.000

S_33 = 0.40×0.000 + 0.30×0.000 + 0.30×0.000
     = 0.000
```

#### **D4.1: Etik Standartlar**

**Formül:**
```
S_41 = 0.40×N_411 + 0.30×N_412 + 0.30×N_413
```

**Hesaplama:**
```
N_411 = 1.000, N_412 = 1.000, N_413 = 0.500

S_41 = 0.40×1.000 + 0.30×1.000 + 0.30×0.500
     = 0.400 + 0.300 + 0.150
     = 0.850
```

#### **D4.2: Şeffaflık ve Açık Bilim**

**Formül:**
```
S_42 = 0.40×N_421 + 0.30×N_422 + 0.30×N_423
```

**Hesaplama:**
```
N_421 = 0.500, N_422 = 1.000, N_423 = 0.000

S_42 = 0.40×0.500 + 0.30×1.000 + 0.30×0.000
     = 0.200 + 0.300 + 0.000
     = 0.500
```

### 4.4 Alt Boyut Sonuçları Özet Tablosu

| Alt Boyut | Kod | Hesaplama | Sonuç |
|-----------|-----|-----------|-------|
| Atıf ve Tanınma | S_11 | 0.30×0.680 + 0.25×0.750 + 0.25×0.500 + 0.20×0.000 | 0.517 |
| Disiplinlerarası Etki | S_12 | 0.30×0.500 + 0.30×0.500 + 0.25×0.750 + 0.15×0.000 | 0.488 |
| Uzun Vadeli Etki | S_13 | 0.40×0.750 + 0.30×0.000 + 0.30×0.500 | 0.450 |
| Medya Etkisi | S_21 | 0.35×0.500 + 0.30×0.758 + 0.35×0.750 | 0.665 |
| Politika Etkisi | S_22 | 0.30×0.500 + 0.25×0.000 + 0.25×0.250 + 0.20×0.000 | 0.213 |
| Ekonomik Etki | S_23 | 0.30×0.000 + 0.25×0.368 + 0.25×0.288 + 0.20×0.000 | 0.164 |
| Sosyal/Çevresel Zarar | S_31 | 0.40×0.000 + 0.30×0.000 + 0.30×0.000 | 0.000 |
| Bilimsel Sorunlar | S_32 | 0.35×0.000 + 0.40×0.000 + 0.25×0.000 | 0.000 |
| Yanlış Kullanım | S_33 | 0.40×0.000 + 0.30×0.000 + 0.30×0.000 | 0.000 |
| Etik Standartlar | S_41 | 0.40×1.000 + 0.30×1.000 + 0.30×0.500 | 0.850 |
| Şeffaflık | S_42 | 0.40×0.500 + 0.30×1.000 + 0.30×0.000 | 0.500 |

---

## 5. ADIM 4: ANA BOYUT HESAPLAMA

### 5.1 Ana Boyut Nedir?

**Tanım:** Birkaç alt boyutun ağırlıklı toplamı

**Formül:**
```
D_i = Σ (w_ij × S_ij)
```

**Parametreler:**
- `D_i`: i. ana boyutun skoru
- `w_ij`: j. alt boyutun ağırlığı (sabit, önceden tanımlı)
- `S_ij`: j. alt boyutun skoru (Adım 3'ten)

### 5.2 Ana Boyut Hesaplama Şablonu

```
┌──────────────────────────────────────────────────────────────┐
│ ANA BOYUT: D1 - Akademik Etki                                │
├──────────────────────────────────────────────────────────────┤
│ ALT BOYUTLAR:                                                │
│   S_11: Atıf ve Tanınma                                      │
│   S_12: Disiplinlerarası Etki                                │
│   S_13: Uzun Vadeli Etki                                     │
├──────────────────────────────────────────────────────────────┤
│ AĞIRLIKLAR (w):                                              │
│   w_11 = 0.40                                                │
│   w_12 = 0.30                                                │
│   w_13 = 0.30                                                │
│   TOPLAM = 1.00 ✓                                            │
├──────────────────────────────────────────────────────────────┤
│ ALT BOYUT SKORLARI (S):                                      │
│   S_11 = 0.517 (Adım 3'ten)                                  │
│   S_12 = 0.488                                               │
│   S_13 = 0.450                                               │
├──────────────────────────────────────────────────────────────┤
│ HESAPLAMA:                                                   │
│   D1 = w_11×S_11 + w_12×S_12 + w_13×S_13                    │
│      = 0.40×0.517 + 0.30×0.488 + 0.30×0.450                  │
│      = 0.207 + 0.146 + 0.135                                 │
│      = 0.488                                                 │
├──────────────────────────────────────────────────────────────┤
│ SONUÇ: D1 = 0.488                                            │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Dört Ana Boyut İçin Hesaplama

#### **D1: Akademik Etki**

**Formül:**
```
D1 = 0.40×S_11 + 0.30×S_12 + 0.30×S_13
```

**Hesaplama:**
```
Adım 1: Alt boyut skorlarını al
  S_11 = 0.517
  S_12 = 0.488
  S_13 = 0.450

Adım 2: Ağırlıklarla çarp
  0.40 × 0.517 = 0.207
  0.30 × 0.488 = 0.146
  0.30 × 0.450 = 0.135

Adım 3: Topla
  D1 = 0.207 + 0.146 + 0.135 = 0.488
```

**Excel Formülü:**
```
=0.40*S11 + 0.30*S12 + 0.30*S13
```

**Python Kodu:**
```python
def calc_D1(S_11, S_12, S_13):
    return 0.40*S_11 + 0.30*S_12 + 0.30*S_13

D1 = calc_D1(0.517, 0.488, 0.450)
print(f"D1 = {D1:.3f}")  # 0.488
```

#### **D2: Toplumsal ve Pratik Etki**

**Formül:**
```
D2 = 0.25×S_21 + 0.35×S_22 + 0.40×S_23
```

**Hesaplama:**
```
S_21 = 0.665, S_22 = 0.213, S_23 = 0.164

D2 = 0.25×0.665 + 0.35×0.213 + 0.40×0.164
   = 0.166 + 0.075 + 0.066
   = 0.307
```

#### **D3: Negatif Etki ve Risk**

**Formül:**
```
D3 = 0.40×S_31 + 0.35×S_32 + 0.25×S_33
```

**Hesaplama:**
```
S_31 = 0.000, S_32 = 0.000, S_33 = 0.000

D3 = 0.40×0.000 + 0.35×0.000 + 0.25×0.000
   = 0.000
```

#### **D4: Etik ve Sorumluluk**

**Formül:**
```
D4 = 0.50×S_41 + 0.50×S_42
```

**Hesaplama:**
```
S_41 = 0.850, S_42 = 0.500

D4 = 0.50×0.850 + 0.50×0.500
   = 0.425 + 0.250
   = 0.675
```

### 5.4 Ana Boyut Sonuçları Özet Tablosu

| Ana Boyut | Kod | Hesaplama | Sonuç |
|-----------|-----|-----------|-------|
| Akademik Etki | D1 | 0.40×0.517 + 0.30×0.488 + 0.30×0.450 | 0.488 |
| Toplumsal Etki | D2 | 0.25×0.665 + 0.35×0.213 + 0.40×0.164 | 0.307 |
| Negatif Etki | D3 | 0.40×0.000 + 0.35×0.000 + 0.25×0.000 | 0.000 |
| Etik | D4 | 0.50×0.850 + 0.50×0.500 | 0.675 |

---

## 6. ADIM 5: HIS HESAPLAMA

### 6.1 HIS Nedir?

**Tanım:** Bütünsel Etki Skoru (Holistic Impact Score)

**Amaç:** Dört ana boyutu tek bir skora (0-100 arası) indirgemek

**Formül:**
```
HIS_raw = W_D1 × D1 + W_D2 × D2 + W_D3 × D3 + W_D4 × D4
HIS = HIS_raw × 100
```

**Parametreler:**
- `W_D1, W_D2, W_D3, W_D4`: Ana boyut ağırlıkları (sabit, önceden tanımlı)
- `D1, D2, D3, D4`: Ana boyut skorları (Adım 4'ten)

### 6.2 Ana Boyut Ağırlıkları

**Ham Ağırlıklar:**
| Boyut | Ham Ağırlık | Açıklama |
|-------|-------------|----------|
| D1 | 0.30 | Akademik etki |
| D2 | 0.35 | Toplumsal etki |
| D3 | -0.15 | Negatif etki (ceza) |
| D4 | 0.20 | Etik |

**Toplam:** 0.30 + 0.35 - 0.15 + 0.20 = 0.70

**Normalize Edilmiş Ağırlıklar:**
```
W_D1 = 0.30 / 0.70 = 0.429
W_D2 = 0.35 / 0.70 = 0.500
W_D3 = -0.15 / 0.70 = -0.214
W_D4 = 0.20 / 0.70 = 0.286
```

**Toplam:** 0.429 + 0.500 - 0.214 + 0.286 = 1.000 ✓

### 6.3 HIS Hesaplama Adımları

```
┌──────────────────────────────────────────────────────────────┐
│ HIS HESAPLAMA                                                │
├──────────────────────────────────────────────────────────────┤
│ ADIM 1: Ana boyut skorlarını al                              │
│   D1 = 0.488 (Adım 4'ten)                                    │
│   D2 = 0.307                                                 │
│   D3 = 0.000                                                 │
│   D4 = 0.675                                                 │
├──────────────────────────────────────────────────────────────┤
│ ADIM 2: Ağırlıklarla çarp                                    │
│   0.429 × 0.488 = 0.209                                      │
│   0.500 × 0.307 = 0.154                                      │
│  -0.214 × 0.000 = 0.000                                      │
│   0.286 × 0.675 = 0.193                                      │
├──────────────────────────────────────────────────────────────┤
│ ADIM 3: Topla                                                │
│   HIS_raw = 0.209 + 0.154 + 0.000 + 0.193 = 0.556           │
├──────────────────────────────────────────────────────────────┤
│ ADIM 4: 100 ile çarp                                         │
│   HIS = 0.556 × 100 = 55.6                                   │
├──────────────────────────────────────────────────────────────┤
│ ADIM 5: Etik kapı bekçisi kontrolü                           │
│   I_411 (etik onay) = 1 → Kontrol geçti ✓                    │
│   HIS = 55.6 (değişiklik yok)                                │
├──────────────────────────────────────────────────────────────┤
│ SONUÇ: HIS = 55.6 / 100                                      │
└──────────────────────────────────────────────────────────────┘
```

### 6.4 Etik Kapı Bekçisi Mekanizması

**Kural:** Eğer I_411 (etik onay) = 0 ise, HIS maksimum 50 olabilir

**Formül:**
```
IF I_411 = 0 THEN
    HIS = min(HIS_raw × 100, 50)
ELSE
    HIS = HIS_raw × 100
END IF
```

**Örnek 1: Etik onay var**
```
I_411 = 1
HIS_raw = 0.556
HIS = 0.556 × 100 = 55.6
```

**Örnek 2: Etik onay yok**
```
I_411 = 0
HIS_raw = 0.854
HIS_raw × 100 = 85.4
HIS = min(85.4, 50) = 50.0  ← Sınırlandı!
```

### 6.5 Tam HIS Hesaplama Örneği

**Veriler:**
```
D1 = 0.488
D2 = 0.307
D3 = 0.000
D4 = 0.675
I_411 = 1
```

**Hesaplama:**
```
ADIM 1: Ağırlıklı toplam
  HIS_raw = 0.429×0.488 + 0.500×0.307 - 0.214×0.000 + 0.286×0.675
          = 0.209 + 0.154 + 0.000 + 0.193
          = 0.556

ADIM 2: 100 ile çarp
  HIS = 0.556 × 100 = 55.6

ADIM 3: Etik kontrolü
  I_411 = 1 → Kontrol geçti
  HIS = 55.6 (değişiklik yok)

SONUÇ: HIS = 55.6
```

**Excel Formülü:**
```
=IF(I411=0, MIN(0.429*D1 + 0.500*D2 - 0.214*D3 + 0.286*D4, 0.50)*100, (0.429*D1 + 0.500*D2 - 0.214*D3 + 0.286*D4)*100)
```

**Python Kodu:**
```python
def calc_HIS(D1, D2, D3, D4, I_411):
    # Ağırlıklı toplam
    HIS_raw = 0.429*D1 + 0.500*D2 - 0.214*D3 + 0.286*D4
    
    # 100 ile çarp
    HIS = HIS_raw * 100
    
    # Etik kapı bekçisi
    if I_411 == 0:
        HIS = min(HIS, 50)
    
    return HIS

HIS = calc_HIS(0.488, 0.307, 0.000, 0.675, 1)
print(f"HIS = {HIS:.1f}")  # 55.6
```

---

## 7. TAM ÖRNEK: BAŞTAN SONA HESAPLAMA

### 7.1 Örnek Makale Bilgileri

**Makale:** "Machine Learning for Early Cancer Detection"  
**Yazarlar:** Smith, J. et al.  
**Dergi:** Nature Medicine (IF = 87.2)  
**Yıl:** 2020

### 7.2 Adım 1: Veri Toplama (33 Gösterge)

| Kod | Gösterge | Ham Değer | Kaynak |
|-----|----------|-----------|--------|
| I_111 | Atıf sayısı | 523 | Google Scholar |
| I_112 | h-indeksi etkisi | 4 (Likert) | Yazar profili |
| I_113 | Prestijli dergi | 5 (Likert) | Nature Medicine |
| I_114 | Ödül | 1 (Likert) | Ödül yok |
| I_121 | Disiplinlerarası atıf | 3 (Likert) | Web of Science |
| I_122 | Yeni alan | 3 (Likert) | Literatür taraması |
| I_123 | Metodolojik yenilik | 4 (Likert) | Makale metni |
| I_124 | Teorik katkı | 1 (Likert) | Makale metni |
| I_131 | Uzun vadeli atıf | 4 (Likert) | Trend analizi |
| I_132 | Ders kitabı | 0 (İkili) | Google Books |
| I_133 | Replikasyon | 3 (Likert) | Atıf analizi |
| I_211 | Medya görünürlüğü | 3 (Likert) | Altmetric |
| I_212 | Sosyal medya | 1234 | Altmetric |
| I_213 | Halk bilinçlendirme | 4 (Likert) | Medya analizi |
| I_221 | Politika değişikliği | 3 (Likert) | Politika dokümanları |
| I_222 | Klinik kılavuz | 0 (İkili) | Kılavuz araması |
| I_223 | Karar destek | 2 (Likert) | Yazılım araması |
| I_224 | Uluslararası işbirliği | 1 (Likert) | Anlaşma araması |
| I_231 | Teknoloji transferi | 1 (Likert) | Şirket araması |
| I_232 | Patent | 2 | Google Patents |
| I_233 | Startup | 1 | Crunchbase |
| I_234 | Ekonomik değer | 1 (Likert) | Tahmin |
| I_311 | Negatif sosyal etki | 1 (Likert) | Haber araması |
| I_312 | Çevresel zarar | 1 (Likert) | Çevre raporları |
| I_313 | Güvenlik riski | 1 (Likert) | Güvenlik raporları |
| I_321 | Metodolojik hata | 1 (Likert) | Makale metni |
| I_322 | Çürütülme | 0 (İkili) | Retraction Watch |
| I_323 | Yanlış bilgi | 1 (Likert) | Fact-checking |
| I_331 | Kötü kullanım | 1 (Likert) | Haber araması |
| I_332 | Ticari manipülasyon | 1 (Likert) | Makale metni |
| I_333 | Siyasi propaganda | 1 (Likert) | Haber araması |
| I_411 | Etik onay | 1 (İkili) | Makale metni |
| I_412 | Çıkar çatışması | 1 (İkili) | Makale metni |
| I_413 | İnsan hakları | 3 (Likert) | Makale metni |
| I_421 | Veri paylaşımı | 3 (Likert) | GitHub |
| I_422 | Açık erişim | 1 (İkili) | Makale web sitesi |
| I_423 | Preregistration | 1 (Likert) | OSF |

### 7.3 Adım 2: Normalizasyon

| Kod | Ham Değer | Norm. Fonk. | Hesaplama | Normalize |
|-----|-----------|-------------|-----------|-----------|
| I_111 | 523 | Log | log(524)/log(10001) | 0.680 |
| I_112 | 4 | Lin | (4-1)/4 | 0.750 |
| I_113 | 5 | Lin | (5-1)/4 | 1.000 |
| I_114 | 1 | Lin | (1-1)/4 | 0.000 |
| ... | ... | ... | ... | ... |

(Tüm 33 gösterge için normalizasyon tablosu yukarıda verildi)

### 7.4 Adım 3: Alt Boyut Hesaplama

| Alt Boyut | Formül | Hesaplama | Sonuç |
|-----------|--------|-----------|-------|
| S_11 | 0.30×N_111 + ... | 0.30×0.680 + 0.25×0.750 + 0.25×1.000 + 0.20×0.000 | 0.642 |
| S_12 | 0.30×N_121 + ... | 0.30×0.500 + 0.30×0.500 + 0.25×0.750 + 0.15×0.000 | 0.488 |
| S_13 | 0.40×N_131 + ... | 0.40×0.750 + 0.30×0.000 + 0.30×0.500 | 0.450 |
| S_21 | 0.35×N_211 + ... | 0.35×0.500 + 0.30×0.758 + 0.35×0.750 | 0.665 |
| S_22 | 0.30×N_221 + ... | 0.30×0.500 + 0.25×0.000 + 0.25×0.250 + 0.20×0.000 | 0.213 |
| S_23 | 0.30×N_231 + ... | 0.30×0.000 + 0.25×0.368 + 0.25×0.288 + 0.20×0.000 | 0.164 |
| S_31 | 0.40×N_311 + ... | 0.40×0.000 + 0.30×0.000 + 0.30×0.000 | 0.000 |
| S_32 | 0.35×N_321 + ... | 0.35×0.000 + 0.40×0.000 + 0.25×0.000 | 0.000 |
| S_33 | 0.40×N_331 + ... | 0.40×0.000 + 0.30×0.000 + 0.30×0.000 | 0.000 |
| S_41 | 0.40×N_411 + ... | 0.40×1.000 + 0.30×1.000 + 0.30×0.500 | 0.850 |
| S_42 | 0.40×N_421 + ... | 0.40×0.500 + 0.30×1.000 + 0.30×0.000 | 0.500 |

### 7.5 Adım 4: Ana Boyut Hesaplama

| Ana Boyut | Formül | Hesaplama | Sonuç |
|-----------|--------|-----------|-------|
| D1 | 0.40×S_11 + 0.30×S_12 + 0.30×S_13 | 0.40×0.642 + 0.30×0.488 + 0.30×0.450 | 0.538 |
| D2 | 0.25×S_21 + 0.35×S_22 + 0.40×S_23 | 0.25×0.665 + 0.35×0.213 + 0.40×0.164 | 0.307 |
| D3 | 0.40×S_31 + 0.35×S_32 + 0.25×S_33 | 0.40×0.000 + 0.35×0.000 + 0.25×0.000 | 0.000 |
| D4 | 0.50×S_41 + 0.50×S_42 | 0.50×0.850 + 0.50×0.500 | 0.675 |

### 7.6 Adım 5: HIS Hesaplama

```
HIS_raw = 0.429×D1 + 0.500×D2 - 0.214×D3 + 0.286×D4
        = 0.429×0.538 + 0.500×0.307 - 0.214×0.000 + 0.286×0.675
        = 0.231 + 0.154 + 0.000 + 0.193
        = 0.578

HIS = 0.578 × 100 = 57.8

Etik Kontrolü: I_411 = 1 → Geçti
Final HIS = 57.8
```

### 7.7 Sonuç Yorumu

**HIS = 57.8 / 100**

**Yorum:**
- **Orta-Yüksek Etki:** Makale genel olarak iyi bir etkiye sahip
- **Güçlü Yönler:**
  - Akademik etki (D1 = 0.538): Yüksek atıf, prestijli dergi
  - Etik (D4 = 0.675): Etik standartlara uygun
  - Medya etkisi (S_21 = 0.665): İyi medya görünürlüğü
- **Zayıf Yönler:**
  - Toplumsal etki (D2 = 0.307): Düşük politika ve ekonomik etki
  - Teknoloji transferi (S_23 = 0.164): Sınırlı ticarileştirme
- **Negatif Etki:** Yok (D3 = 0.000) - Bu iyi!

---

## 8. HATA KONTROLÜ VE DOĞRULAMA

### 8.1 Kontrol Listesi

```
☐ Veri Toplama
  ☐ 33 göstergenin tamamı dolduruldu mu?
  ☐ Veri kaynakları güvenilir mi?
  ☐ Tarihler güncel mi?

☐ Normalizasyon
  ☐ Tüm normalize değerler 0-1 arasında mı?
  ☐ Logaritmik normalizasyonda x_max doğru mu?
  ☐ Likert değerleri 1-5 arasında mı?
  ☐ İkili değerler 0 veya 1 mi?

☐ Alt Boyut Hesaplama
  ☐ Ağırlıklar toplamı 1.0 mı?
  ☐ Tüm alt boyut skorları 0-1 arasında mı?

☐ Ana Boyut Hesaplama
  ☐ Ağırlıklar toplamı 1.0 mı?
  ☐ Tüm ana boyut skorları 0-1 arasında mı?

☐ HIS Hesaplama
  ☐ HIS 0-100 arasında mı?
  ☐ Etik kapı bekçisi kontrolü yapıldı mı?
  ☐ D3 (negatif etki) negatif katkı yaptı mı?
```

### 8.2 Yaygın Hatalar ve Çözümleri

**Hata 1: HIS > 100**
- **Neden:** Ağırlıklar yanlış toplandı
- **Çözüm:** Ağırlıkların toplamının 1.0 olduğunu kontrol et

**Hata 2: Negatif HIS**
- **Neden:** D3 çok yüksek
- **Çözüm:** D3 değerlerini kontrol et, negatif etki gerçekten bu kadar yüksek mi?

**Hata 3: Normalize değer > 1**
- **Neden:** Logaritmik normalizasyonda x > x_max
- **Çözüm:** x_max değerini artır veya x değerini kontrol et

**Hata 4: HIS = 50 (etik onay var olmasına rağmen)**
- **Neden:** I_411 yanlış girildi (0 yerine 1 olmalı)
- **Çözüm:** I_411 değerini kontrol et

### 8.3 Doğrulama Formülleri

**Ağırlık Toplamı Kontrolü:**
```
Σ w_ijk = 1.0 (her alt boyut için)
Σ w_ij = 1.0 (her ana boyut için)
Σ W_i = 1.0 (HIS için)
```

**Normalize Değer Aralığı:**
```
0 ≤ N_ijk ≤ 1 (her gösterge için)
```

**Alt Boyut Aralığı:**
```
0 ≤ S_ij ≤ 1 (her alt boyut için)
```

**Ana Boyut Aralığı:**
```
0 ≤ D_i ≤ 1 (her ana boyut için)
```

**HIS Aralığı:**
```
0 ≤ HIS ≤ 100
```

---

## 9. SIK SORULAN SORULAR

**S1: Tüm 33 göstergeyi doldurmak zorunda mıyım?**
- **C:** Hayır, ama en az %70'ini (23 gösterge) doldurmanız önerilir. Eksik göstergeler için varsayılan değerler kullanılır.

**S2: Varsayılan değerler nelerdir?**
- **C:** Likert → 1, Nicel → 0, İkili → 0 (en muhafazakar değerler)

**S3: HIS skoru ne kadar yüksek olmalı?**
- **C:** 
  - 0-30: Düşük etki
  - 30-50: Orta-düşük etki
  - 50-70: Orta-yüksek etki
  - 70-90: Yüksek etki
  - 90-100: Çok yüksek etki

**S4: Negatif etki (D3) nasıl çalışır?**
- **C:** D3 yüksek olursa, HIS düşer. D3 = 1.0 ise, HIS'ten -21.4 puan çıkar.

**S5: Etik onay yoksa ne olur?**
- **C:** HIS maksimum 50 olabilir, ne kadar yüksek olursa olsun.

**S6: Ağırlıkları değiştirebilir miyim?**
- **C:** Evet, ama dikkatli olun. Ağırlıkların toplamı 1.0 olmalı.

**S7: Logaritmik normalizasyonda x > x_max olursa ne olur?**
- **C:** Normalize değer > 1.0 olur (hata). x_max değerini artırın veya x değerini kontrol edin.

**S8: Hesaplama ne kadar sürer?**
- **C:** Veri toplama 30-60 dk, hesaplama < 1 sn (otomatik)

**S9: Excel'de hesaplayabilir miyim?**
- **C:** Evet, tüm formüller Excel'de çalışır.

**S10: Python kodu var mı?**
- **C:** Evet, yukarıda her adım için Python kodu verildi.

---

## SONUÇ

Bu kılavuz, Akademik Makale Etki Değerlendirmesi sisteminin tam hesaplama sürecini adım adım açıklamaktadır. Her formül, her parametre, her hesaplama detaylı olarak anlatılmıştır.

**Özet:**
1. **Veri Toplama:** 33 gösterge için ham veri topla
2. **Normalizasyon:** Tüm değerleri 0-1 arasına getir
3. **Alt Boyut:** 11 alt boyut skoru hesapla
4. **Ana Boyut:** 4 ana boyut skoru hesapla
5. **HIS:** Bütünsel Etki Skoru (0-100) hesapla

**Sonraki Adımlar:**
- Web uygulamasını kullanarak otomatik hesaplama
- Excel şablonunu indirerek manuel hesaplama
- Python kodunu kullanarak toplu hesaplama

---

**Doküman Sonu**
