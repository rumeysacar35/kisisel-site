// ===== Projelerim sayfasının verileri =====
// Yeni proje eklemek için listeye bir { ... } bloğu daha ekle.
// durum: 'Yayında', 'Tamamlandı' ya da 'Yapımda'
// ekran: 'web' (tarayıcı çerçevesi) ya da 'telefon' (telefon çerçeveleri)

const projeler = [
  {
    ad: 'CinePath',
    tur: 'Web sitesi',
    durum: 'Yayında',
    rozet: 'TÜBİTAK 2209-A',
    renk: '#FFE9EE',
    ekran: 'web',
    adres: 'cinepathtr.com',
    gorseller: ['img/cinepath.png'],
    ozet: '[Film ve dizilerin çekildiği yerleri keşfettiren platform: 1–2 cümle.]',
    rol: '[Bu projede tam olarak ne yaptın? 2 cümle.]',
    ogrendim: '[Seni en çok zorlayan şey ve nasıl çözdün? 2 cümle.]',
    teknolojiler: ['[TEKNOLOJİ]', '[TEKNOLOJİ]', 'Ekip projesi'],
    canli: { etiket: 'Siteyi aç', link: 'https://cinepathtr.com' },
    kod: 'https://github.com/rumeysacar35'
  },
  {
    ad: 'Kamera Arkası Rotaları',
    tur: 'Mobil uygulama',
    durum: 'Tamamlandı',
    rozet: '',
    renk: '#E3EEF5',
    ekran: 'telefon',
    gorseller: [],
    ozet: '[Okul bitirme projem: 1–2 cümle.]',
    rol: '[Bu projede tam olarak ne yaptın? 2 cümle.]',
    ogrendim: '[Seni en çok zorlayan şey ve nasıl çözdün? 2 cümle.]',
    teknolojiler: ['Flutter', 'Dart', '[TEKNOLOJİ]'],
    canli: null,
    kod: 'https://github.com/rumeysacar35'
  },
  {
    ad: 'Yadigar',
    tur: 'Mobil uygulama',
    durum: 'Yapımda',
    rozet: 'Kültür günlüğü',
    renk: '#FBEFD4',
    ekran: 'telefon',
    gorseller: [],
    ozet: '[Okuduğun kitapları, izlediğin film ve dizileri kaydedip paylaşım kartına dönüştüren uygulama: 1–2 cümle.]',
    rol: '[Bu projede tam olarak ne yapıyorsun? 2 cümle.]',
    ogrendim: '[Şu ana kadar ne öğrendin? 2 cümle.]',
    teknolojiler: ['[TEKNOLOJİ]', '[TEKNOLOJİ]'],
    canli: null,
    kod: 'https://github.com/rumeysacar35'
  },
  {
    ad: 'Retro Chatbot',
    tur: 'Web uygulaması',
    durum: 'Tamamlandı',
    rozet: "Kendini 90'larda sanan bot",
    renk: '#E8F1E0',
    ekran: 'web',
    adres: '[DEMO ADRESİ]',
    gorseller: [],
    ozet: '[Yapay zekâyla sohbet eden ama hâlâ 1990\'lardaymış gibi davranan bir chatbot: 1–2 cümle.]',
    rol: '[Bu projede tam olarak ne yaptın? 2 cümle.]',
    ogrendim: '[Seni en çok zorlayan şey ve nasıl çözdün? 2 cümle.]',
    teknolojiler: ['Python', 'FastAPI', 'Gemini API', 'HTML/CSS/JS'],
    canli: null,
    kod: 'https://github.com/rumeysacar35'
  }
];