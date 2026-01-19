/**
 * İnteraktif Demo İçeriği
 * 
 * Bu dosya, ana sayfadaki interaktif demo/tutorial içeriğini tanımlar.
 * Sistem güncellendiğinde, bu dosyayı güncelleyerek demo içeriğini değiştirebilirsiniz.
 */

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  visual?: {
    type: 'image' | 'animation' | 'code' | 'chart';
    content: string;
    caption?: string;
  };
  actions?: {
    label: string;
    description: string;
  }[];
  tips?: string[];
  duration?: number; // tahmini okuma süresi (saniye)
}

export interface DemoData {
  title: string;
  subtitle: string;
  totalDuration: number; // dakika
  steps: DemoStep[];
}

export const DEMO_CONTENT: DemoData = {
  title: "",
  subtitle: "",
  totalDuration: 5,
  steps: [
    {
      id: 1,
      title: "Değerlendirme Modu Seçimi",
      description: "İlk adımda, değerlendirme modunu seçiyorsunuz. Hızlı Mod (37 gösterge, 4 boyut) veya Kapsamlı Mod (193 gösterge, 16 boyut, zincirleme etkiler) arasından birini seçin.",
      /* visual: {
        type: 'chart',
        content: '📊 Mod Seçimi\n\n🔹 Hızlı Mod\n  • 37 gösterge\n  • 4 ana boyut\n  • 15-30 dakika\n  • Temel akademik etki\n\n🔹 Kapsamlı Mod\n  • 193 gösterge\n  • 16 ana boyut\n  • 45-60 dakika\n  • Zincirleme etkiler\n  • AI otomatik doldurma',
        caption: 'İki mod arasından seçim yapın'
      }, */
      actions: [
        {
          label: "Hızlı Mod",
          description: "Temel akademik etki değerlendirmesi - Yeni başlayanlar için"
        },
        {
          label: "Kapsamlı Mod",
          description: "Tam gerçek dünya etki analizi - Detaylı raporlar için"
        }
      ],
      tips: [
        "İlk kez kullanıyorsanız Hızlı Mod'u seçin",
        "Detaylı araştırma raporu için Kapsamlı Mod'u tercih edin",
        "Kapsamlı Mod'da AI otomatik doldurma zorunludur"
      ],
      duration: 20
    },
    {
      id: 2,
      title: "Makale Bilgilerini Girme",
      description: "Değerlendirmek istediğiniz makalenin temel bilgilerini giriyorsunuz. PDF yükleyerek bu süreci otomatikleştirebilirsiniz.",
      /* visual: {
        type: 'image',
        content: '/demo/step2-paper-info.png',
        caption: 'Makale bilgileri formu'
      }, */
      actions: [
        {
          label: "Manuel Giriş",
          description: "Başlık, yazarlar, DOI, yıl, dergi ve özet bilgilerini elle girin"
        },
        {
          label: "PDF Yükleme",
          description: "Makale PDF'ini yükleyin, sistem otomatik olarak bilgileri çıkarır"
        }
      ],
      tips: [
        "DOI girişi, otomatik veri çekme için önemlidir",
        "PDF yükleme, manuel girişten daha hızlıdır",
        "Özet bilgisi, AI destekli değerlendirme için kullanılır"
      ],
      duration: 30
    },
    {
      id: 3,
      title: "Göstergeleri Doldurma",
      description: "Seçtiğiniz moda göre göstergeleri dolduruyorsunuz. Hızlı Mod'da 37 gösterge, Kapsamlı Mod'da 193 gösterge bulunur. Her gösterge için 0-100 arası puan veriyorsunuz.",
      /* visual: {
        type: 'chart',
        content: '📝 Gösterge Doldurma\n\nD1: Akademik Etki (11)\nD2: Toplumsal Etki (11)\nD3: Negatif Etki (9)\nD4: Etik (6)\n\n[Kapsamlı Mod]\nD5: Ekonomik (15)\nD6: Sağlık (12)\nD7: Çevresel (14)\nD8: Politik (10)\n...ve 8 boyut daha',
        caption: 'Boyutlar ve gösterge sayıları'
      }, */
      actions: [
        {
          label: "Manuel Değerlendirme",
          description: "Her gösterge için 0-100 arası puan verin"
        },
        {
          label: "AI Destekli Doldurma",
          description: "AI, makale içeriğine göre otomatik puan önerir"
        }
      ],
      tips: [
        "Her gösterge için detaylı açıklama ve örnekler vardır",
        "Emin olmadığınız göstergelerde AI desteğini kullanın",
        "Kapsamlı Mod'da AI otomatik doldurma zorunludur"
      ],
      duration: 40
    },
    {
      id: 4,
      title: "Otomatik Hesaplama",
      description: "Sistem, girdiğiniz puanları kullanarak boyut skorlarını ve Holistic Impact Score (HIS) hesaplar. Kapsamlı Mod'da zincirleme etkiler ve çarpan katsayıları da hesaplanır.",
      /* visual: {
        type: 'chart',
        content: '🧮 Hesaplama Süreci\n\n1️⃣ Gösterge puanları → Boyut skorları\n2️⃣ Boyut skorları → HIS\n3️⃣ [Kapsamlı] Zincirleme etkiler\n4️⃣ [Kapsamlı] Çarpan katsayıları\n5️⃣ [Kapsamlı] Ağ etkileri\n\nSonuç: 0-100 arası final skor',
        caption: 'Otomatik hesaplama adımları'
      }, */
      actions: [
        {
          label: "Ağırlıklandırma",
          description: "Her boyutun ağırlığını özelleştirebilirsiniz (opsiyonel)"
        },
        {
          label: "Zincirleme Etki Analizi",
          description: "Kapsamlı Mod'da 5 seviyeli zincirleme etki hesaplanır"
        }
      ],
      tips: [
        "Varsayılan ağırlıklar dengeli bir değerlendirme sağlar",
        "Özel ağırlıklar, disipline özgü değerlendirme için kullanılabilir",
        "Zincirleme etkiler, makalenin uzun vadeli etkisini gösterir"
      ],
      duration: 25
    },
    {
      id: 5,
      title: "Detaylı Rapor Görüntüleme",
      description: "Değerlendirme tamamlandıktan sonra, detaylı raporu görüntüleyebilirsiniz. Rapor, tüm boyut skorlarını, gösterge detaylarını ve zincirleme etki analizini içerir.",
      /* visual: {
        type: 'chart',
        content: '📊 Rapor İçeriği\n\n• Genel Skor (HIS)\n• Boyut Skorları (Radar Chart)\n• Gösterge Detayları\n• Güçlü/Zayıf Yönler\n• [Kapsamlı] Zincirleme Etkiler\n• [Kapsamlı] Çarpan Katsayıları\n• [Kapsamlı] Ağ Etkileri\n• Öneriler',
        caption: 'Detaylı rapor bileşenleri'
      }, */
      actions: [
        {
          label: "PDF Export",
          description: "Raporu PDF olarak indirin"
        },
        {
          label: "Excel Export",
          description: "Gösterge verilerini Excel'e aktarın"
        },
        {
          label: "Paylaş",
          description: "Rapor linkini paylaşın"
        }
      ],
      tips: [
        "Radar chart, boyutlar arası dengeyi gösterir",
        "Zincirleme etki diyagramı, uzun vadeli etkiyi görselleştirir",
        "Öneriler bölümü, iyileştirme alanlarını gösterir"
      ],
      duration: 35
    },
    {
      id: 6,
      title: "Karşılaştırma ve İzleme",
      description: "Birden fazla makaleyi karşılaştırabilir ve zaman içinde etkilerini izleyebilirsiniz. Dashboard, tüm değerlendirmelerinizi bir arada gösterir.",
      /* visual: {
        type: 'chart',
        content: '📈 Dashboard\n\n• Tüm Değerlendirmeler\n• Karşılaştırma Grafikleri\n• Zaman Serisi Analizi\n• Ortalama Skorlar\n• Trend Analizi\n• Filtreleme ve Arama',
        caption: 'Karşılaştırma ve izleme özellikleri'
      }, */
      actions: [
        {
          label: "Makale Karşılaştırma",
          description: "2-5 makaleyi yan yana karşılaştırın"
        },
        {
          label: "Trend Analizi",
          description: "Zaman içinde etki değişimini görün"
        }
      ],
      tips: [
        "Karşılaştırma, hangi makalenin daha etkili olduğunu gösterir",
        "Trend analizi, etkinin zaman içinde nasıl değiştiğini gösterir",
        "Filtreleme ile belirli boyutlara odaklanabilirsiniz"
      ],
      duration: 30
    },
    {
      id: 7,
      title: "Zincirleme Etki Analizi (Kapsamlı Mod)",
      description: "Kapsamlı Mod'da, makalenin birincil, ikincil, üçüncül, dördüncül ve beşincil etkilerini analiz edebilirsiniz. Her seviye, önceki seviyeden türeyen etkileri gösterir.",
      /* visual: {
        type: 'chart',
        content: '🔗 Zincirleme Etkiler\n\n1️⃣ Birincil: Doğrudan etki\n2️⃣ İkincil: Birincil → İkincil\n3️⃣ Üçüncül: İkincil → Üçüncül\n4️⃣ Dördüncül: Üçüncül → Dördüncül\n5️⃣ Beşincil: Dördüncül → Beşincil\n\nÖrnek:\nİlaç → Üretim → İstihdam → GSYİH → Eğitim',
        caption: '5 seviyeli zincirleme etki modeli'
      }, */
      actions: [
        {
          label: "Etki Haritası",
          description: "Zincirleme etkileri görsel olarak görün"
        },
        {
          label: "Çarpan Analizi",
          description: "Ekonomik, sosyal, bilimsel çarpanları inceleyin"
        }
      ],
      tips: [
        "Zincirleme etkiler, makalenin uzun vadeli değerini gösterir",
        "Çarpan katsayıları, her $1 yatırımın kaç $ değer yarattığını gösterir",
        "Ağ etkileri, platform ve işbirliği etkilerini ölçer"
      ],
      duration: 40
    },
    {
      id: 8,
      title: "Çarpan Katsayıları (Kapsamlı Mod)",
      description: "Kapsamlı Mod'da, ekonomik, sosyal, bilimsel ve çevresel çarpan katsayıları hesaplanır. Bu katsayılar, makalenin doğrudan etkisinin kaç kat büyüdüğünü gösterir.",
      /* visual: {
        type: 'chart',
        content: '✖️ Çarpan Katsayıları\n\n💰 Ekonomik: 1.5x - 5.0x\n  Her $1 yatırım → $2-5 değer\n\n👥 Sosyal: 2.0x - 10.0x\n  1 doğrudan → 2-10 dolaylı faydalanan\n\n🔬 Bilimsel: 10x - 1000x\n  1 öncü → 10-1000 takip makalesi\n\n🌍 Çevresel: 1.5x - 4.0x',
        caption: 'Çarpan katsayıısı aralıkları'
      }, */
      actions: [
        {
          label: "Çarpan Detayları",
          description: "Her çarpan türünün hesaplama detaylarını görün"
        },
        {
          label: "Karşılaştırma",
          description: "Makaleler arası çarpan katsayılarını karşılaştırın"
        }
      ],
      tips: [
        "Yüksek çarpan, makalenin geniş etki yarattığını gösterir",
        "Bilimsel çarpan, atıf ağı analiziyle hesaplanır",
        "Ekonomik çarpan, GSYİH ve istihdam verilerine dayanır"
      ],
      duration: 35
    },
    {
      id: 9,
      title: "Ağ Etkileri ve Geri Besleme (Kapsamlı Mod)",
      description: "Kapsamlı Mod'da, ağ etkileri (platform, işbirliği) ve geri besleme döngüleri (pozitif, negatif, gecikmeli) analiz edilir. Bu analizler, makalenin ekosistem etkisini gösterir.",
      /* visual: {
        type: 'chart',
        content: '🌐 Ağ Etkileri\n\n📡 Doğrudan Ağ Etkisi\n  Kullanıcı sayısı ↑ → Değer ↑²\n\n🔗 Dolaylı Ağ Etkisi\n  Tamamlayıcı ürün/hizmet sayısı\n\n♻️ Geri Besleme Döngüleri\n  + Pozitif (kendini güçlendiren)\n  - Negatif (dengeleyici)\n  ⏱ Gecikmeli (zaman gecikmeli)',
        caption: 'Ağ etkileri ve geri besleme döngüleri'
      }, */
      actions: [
        {
          label: "Ağ Haritası",
          description: "İşbirliği ağını görselleştirin"
        },
        {
          label: "Döngü Analizi",
          description: "Geri besleme döngülerini inceleyin"
        }
      ],
      tips: [
        "Ağ etkileri, platform ve işbirliği değerini gösterir",
        "Pozitif geri besleme, büyüme potansiyelini gösterir",
        "Negatif geri besleme, denge ve sürdürülebilirliği gösterir"
      ],
      duration: 35
    },
    {
      id: 10,
      title: "Final Rapor ve Öneriler",
      description: "Tüm analizler tamamlandıktan sonra, kapsamlı final raporu görüntüleyebilirsiniz. Rapor, tüm boyutları, zincirleme etkileri, çarpan katsayılarını ve iyileştirme önerilerini içerir.",
      /* visual: {
        type: 'chart',
        content: '📑 Final Rapor\n\n✅ Genel Skor (HIS)\n✅ 16 Boyut Analizi\n✅ 193 Gösterge Detayı\n✅ Zincirleme Etkiler (5 seviye)\n✅ Çarpan Katsayıları (4 tür)\n✅ Ağ Etkileri\n✅ Geri Besleme Döngüleri\n✅ Güçlü/Zayıf Yönler\n✅ İyileştirme Önerileri',
        caption: 'Kapsamlı final rapor içeriği'
      }, */
      actions: [
        {
          label: "Rapor İndir",
          description: "PDF veya Excel formatında indirin"
        },
        {
          label: "Paylaş",
          description: "Rapor linkini paylaşın"
        },
        {
          label: "Yeni Değerlendirme",
          description: "Başka bir makale değerlendirin"
        }
      ],
      tips: [
        "Final rapor, tüm analizleri tek bir dokümanda toplar",
        "İyileştirme önerileri, makalenin etkisini artırmak için rehberlik sağlar",
        "Paylaşım linki, raporunuzu başkalarıyla paylaşmanızı sağlar"
      ],
      duration: 40
    },
    {
      id: 11,
      title: "Demo Tamamlandı! 🎉",
      description: "Artık kendi makalenizi değerlendirmeye başlayabilirsiniz.",
      duration: 0
    }
  ]
};
