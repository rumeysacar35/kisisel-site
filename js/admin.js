// ===================================================
// YÖNETİM PANELİ
// Her tablonun formu aşağıdaki ayarlardan otomatik oluşur.
// Yeni bir alan eklemek için ilgili tablonun "alanlar" listesine bir satır eklemen yeter.
// ===================================================

const DURUM_ADLARI = {
  okuyor: 'Şu an okuyorum', okudum: 'Okudum', okuyacagim: 'Okuyacağım',
  izliyor: 'Şu an izliyorum', izledim: 'İzledim'
};

const TABLOLAR = {
  kitaplar: {
    tekil: 'Kitap',
    siralama: ['created_at', false],
    baslik: k => k.ad,
    alt: k => [DURUM_ADLARI[k.durum], k.yazar].filter(Boolean).join(' · '),
    alanlar: [
      { ad: 'ad', etiket: 'Kitap adı', tip: 'text', zorunlu: true },
      { ad: 'yazar', etiket: 'Yazar', tip: 'text' },
      { ad: 'durum', etiket: 'Durum', tip: 'select', varsayilan: 'okudum',
        secenekler: [['okuyor', 'Şu an okuyorum'], ['okudum', 'Okudum'], ['okuyacagim', 'Okuyacağım']] },
      { ad: 'puan', etiket: 'Puan (0–5 kalp)', tip: 'number', min: 0, max: 5 },
      { ad: 'ilerleme', etiket: 'İlerleme (%)', tip: 'number', min: 0, max: 100, ipucu: 'Sadece "şu an okuyorum" için' },
      { ad: 'notu', etiket: 'Notun', tip: 'textarea' },
      { ad: 'renk', etiket: 'Kapak rengi', tip: 'color', varsayilan: '#7FA3B8' }
    ]
  },

  izlenenler: {
    tekil: 'Dizi / Film',
    siralama: ['created_at', false],
    baslik: i => i.ad,
    alt: i => [i.tur === 'dizi' ? 'Dizi' : 'Film', DURUM_ADLARI[i.durum]].join(' · '),
    alanlar: [
      { ad: 'ad', etiket: 'Adı', tip: 'text', zorunlu: true },
      { ad: 'tur', etiket: 'Tür', tip: 'select', varsayilan: 'dizi', secenekler: [['dizi', 'Dizi'], ['film', 'Film']] },
      { ad: 'durum', etiket: 'Durum', tip: 'select', varsayilan: 'izledim',
        secenekler: [['izliyor', 'Şu an izliyorum'], ['izledim', 'İzledim']] },
      { ad: 'nerede', etiket: 'Nerede kaldın?', tip: 'text', ipucu: 'Örn. Sezon 1 · Bölüm 4' },
      { ad: 'platform', etiket: 'Platform', tip: 'text' },
      { ad: 'yil', etiket: 'Yıl', tip: 'text' },
      { ad: 'kategori', etiket: 'Kategori', tip: 'text', ipucu: 'Örn. Drama, Bilim kurgu' },
      { ad: 'puan', etiket: 'Puan (0–5 kalp)', tip: 'number', min: 0, max: 5 },
      { ad: 'notu', etiket: 'Notun', tip: 'textarea' },
      { ad: 'gorsel_url', etiket: 'Afiş görseli', tip: 'text', yukle: true, ipucu: 'Boş bırakırsan renkli piksel afiş görünür' },,
      { ad: 'renk', etiket: 'Afiş rengi', tip: 'color', varsayilan: '#EDB7B9' }
    ]
  },

  fotograflar: {
    tekil: 'Fotoğraf',
    siralama: ['sira', true],
    baslik: f => f.yer || 'Fotoğraf',
    alt: f => [f.tarih, `sıra: ${f.sira}`].filter(Boolean).join(' · '),
    alanlar: [
      { ad: 'gorsel_url', etiket: 'Fotoğraf', tip: 'text', zorunlu: true, yukle: true },
      { ad: 'yer', etiket: 'Yer', tip: 'text' },
      { ad: 'tarih', etiket: 'Tarih', tip: 'text', ipucu: 'Örn. Ekim 2026' },
      { ad: 'hikaye', etiket: 'Bu karenin hikâyesi', tip: 'textarea' },
      { ad: 'sira', etiket: 'Sıra', tip: 'number', varsayilan: 0, ipucu: 'Küçük sayı önce görünür' }
    ]
  },

  projeler: {
    tekil: 'Proje',
    siralama: ['sira', true],
    baslik: p => p.ad,
    alt: p => [p.durum, p.tur].filter(Boolean).join(' · '),
    alanlar: [
      { ad: 'ad', etiket: 'Proje adı', tip: 'text', zorunlu: true },
      { ad: 'tur', etiket: 'Tür', tip: 'text', ipucu: 'Örn. Mobil uygulama, Web sitesi' },
      { ad: 'durum', etiket: 'Durum', tip: 'select', varsayilan: 'Yapımda',
        secenekler: [['Yayında', 'Yayında'], ['Tamamlandı', 'Tamamlandı'], ['Yapımda', 'Yapımda']] },
      { ad: 'rozet', etiket: 'Rozet', tip: 'text', ipucu: 'Örn. TÜBİTAK 2209-A' },
      { ad: 'ekran', etiket: 'Görsel çerçevesi', tip: 'select', varsayilan: 'web',
        secenekler: [['web', 'Web (tarayıcı)'], ['telefon', 'Mobil (3 telefon)']] },
      { ad: 'adres', etiket: 'Tarayıcıda görünen adres', tip: 'text' },
      { ad: 'ozet', etiket: 'Özet', tip: 'textarea' },
      { ad: 'rol', etiket: 'Benim rolüm', tip: 'textarea' },
      { ad: 'ogrendim', etiket: 'Ne öğrendim', tip: 'textarea' },
      { ad: 'teknolojiler', etiket: 'Kullandıklarım', tip: 'liste', ipucu: 'Her satıra bir tane' },
      { ad: 'gorseller', etiket: 'Ekran görüntüleri', tip: 'liste', yukle: true, ipucu: 'Her satıra bir görsel (mobil için en fazla 3). Yüklediklerin alta eklenir.' },,
      { ad: 'canli_etiket', etiket: 'Canlı buton yazısı', tip: 'text', ipucu: 'Örn. Siteyi aç' },
      { ad: 'canli_link', etiket: 'Canlı link', tip: 'text' },
      { ad: 'kod_link', etiket: 'GitHub linki', tip: 'text' },
      { ad: 'renk', etiket: 'Arka plan rengi', tip: 'color', varsayilan: '#FFE9EE' },
      { ad: 'sira', etiket: 'Sıra', tip: 'number', varsayilan: 0, ipucu: 'Küçük sayı önce görünür' }
    ]
  }
};

// ===== Sayfa elemanları =====
const girisEkrani = document.getElementById('giris');
const panelEkrani = document.getElementById('panel');
const cikisButon = document.getElementById('cikis');
const kayitFormu = document.getElementById('kayit-formu');
const formKolon = document.getElementById('form-kolon');
const kayitListesi = document.getElementById('kayit-listesi');
const durumMesaji = document.getElementById('durum-mesaji');

let aktifTablo = 'kitaplar';
let duzenlenenId = null;     // null ise "yeni kayıt", sayı ise "düzenleme"
let sonKayitlar = [];

function bildir(metin) {
  durumMesaji.textContent = metin;
  if (metin) setTimeout(() => { if (durumMesaji.textContent === metin) durumMesaji.textContent = ''; }, 4000);
}

// ===== Giriş / çıkış =====
document.getElementById('giris-formu').addEventListener('submit', async olay => {
  olay.preventDefault();
  const form = olay.target;
  const hata = document.getElementById('giris-hata');
  hata.textContent = '';

  const { error } = await db.auth.signInWithPassword({
    email: form.eposta.value.trim(),
    password: form.sifre.value
  });
  if (error) hata.textContent = 'Giriş başarısız: e-posta ya da şifre yanlış.';
});

cikisButon.addEventListener('click', () => db.auth.signOut());

// Oturum durumu her değiştiğinde (sayfa açılışı dahil) ekranı ayarla
db.auth.onAuthStateChange((_olay, oturum) => {
  const girdi = Boolean(oturum);
  girisEkrani.hidden = girdi;
  panelEkrani.hidden = !girdi;
  cikisButon.hidden = !girdi;
  // Supabase, bu fonksiyonun içinde doğrudan veritabanı çağrısı yapılmamasını öneriyor;
  // o yüzden sekmeyi bir sonraki "tur"da açıyoruz.
  if (girdi) setTimeout(() => sekmeAc(aktifTablo), 0);
});

// ===== Sekmeler =====
document.querySelectorAll('#panel-sekmeleri button').forEach(buton => {
  buton.addEventListener('click', () => sekmeAc(buton.dataset.tablo));
});

function sekmeAc(tablo) {
  aktifTablo = tablo;
  document.querySelectorAll('#panel-sekmeleri button').forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.tablo === tablo);
  });

  if (tablo === 'mesajlar') {
    formKolon.hidden = true;
    mesajlariCiz();
  } else {
    formKolon.hidden = false;
    formuCiz(tablo);
    listeyiCiz(tablo);
  }
}

function alanHtml(alan, deger) {
  const id = `alan-${alan.ad}`;
  const zorunlu = alan.zorunlu ? 'required' : '';
  let girdi;

  if (alan.tip === 'select') {
    girdi = `<select id="${id}" name="${alan.ad}">
      ${alan.secenekler.map(([v, etiket]) =>
        `<option value="${v}" ${v === deger ? 'selected' : ''}>${etiket}</option>`).join('')}
    </select>`;
  } else if (alan.tip === 'textarea') {
    girdi = `<textarea id="${id}" name="${alan.ad}" rows="3">${kacir(deger)}</textarea>`;
  } else if (alan.tip === 'liste') {
    girdi = `<textarea id="${id}" name="${alan.ad}" rows="3">${kacir((deger || []).join('\n'))}</textarea>`;
  } else {
    const sinir = alan.min !== undefined ? `min="${alan.min}" max="${alan.max}"` : '';
    girdi = `<input id="${id}" name="${alan.ad}" type="${alan.tip}" value="${kacir(deger ?? '')}" ${sinir} ${zorunlu}>`;
  }

  // Yükleme butonu ve küçük önizleme
  const yuklemeButonu = alan.yukle ? `
    <label class="ikincil yukle-buton">
      ⤒ Bilgisayardan yükle
      <input class="gizli-girdi" type="file" accept="image/*" data-hedef="${alan.ad}" ${alan.tip === 'liste' ? 'multiple' : ''}>
    </label>` : '';
  const onizleme = alan.yukle && alan.tip !== 'liste'
    ? `<img class="onizleme" id="onizleme-${alan.ad}" src="${kacir(deger || '')}" alt="" ${deger ? '' : 'hidden'}>`
    : '';

  return `
    <div class="alan">
      <label for="${id}">${alan.etiket}${alan.zorunlu ? ' *' : ''}</label>
      ${girdi}
      ${yuklemeButonu}
      ${onizleme}
      ${alan.ipucu ? `<small>${alan.ipucu}</small>` : ''}
    </div>`;
}

  

function formuCiz(tablo, kayit = null) {
  const ayar = TABLOLAR[tablo];
  duzenlenenId = kayit ? kayit.id : null;

  document.getElementById('form-baslik').textContent =
    kayit ? `${ayar.tekil.toUpperCase()} DÜZENLE` : `YENİ ${ayar.tekil.toUpperCase()}`;

  kayitFormu.innerHTML =
    ayar.alanlar.map(a => alanHtml(a, kayit ? kayit[a.ad] : a.varsayilan)).join('') + `
    <div class="form-butonlar">
      <button class="gonder" type="submit">${kayit ? 'Kaydet' : 'Ekle'} ›</button>
      ${kayit ? '<button class="ikincil" type="button" id="vazgec">Vazgeç</button>' : ''}
    </div>`;

  const vazgec = document.getElementById('vazgec');
  if (vazgec) vazgec.addEventListener('click', () => formuCiz(tablo));
}

// Formdaki değerleri veritabanının beklediği tiplere çevirir
function formVerisi(tablo) {
  const veri = {};
  TABLOLAR[tablo].alanlar.forEach(alan => {
    const ham = kayitFormu.elements[alan.ad].value.trim();
    if (alan.tip === 'number') {
      veri[alan.ad] = ham === '' ? null : Number(ham);
    } else if (alan.tip === 'liste') {
      veri[alan.ad] = ham.split('\n').map(s => s.trim()).filter(Boolean);
    } else {
      veri[alan.ad] = ham === '' ? null : ham;
    }
  });
  return veri;
}

kayitFormu.addEventListener('submit', async olay => {
  olay.preventDefault();
  const veri = formVerisi(aktifTablo);

  const { error } = duzenlenenId
    ? await db.from(aktifTablo).update(veri).eq('id', duzenlenenId)
    : await db.from(aktifTablo).insert(veri);

  if (error) {
    console.error(error);
    bildir(`Kaydedilemedi: ${error.message}`);
    return;
  }
  bildir(duzenlenenId ? 'Değişiklikler kaydedildi ✓' : 'Eklendi ✓');
  formuCiz(aktifTablo);
  listeyiCiz(aktifTablo);
});

// ===== Görsel yükleme =====

// Görseli tarayıcıda küçültüp WebP'ye çevirir
async function kucult(dosya, enUzunKenar = 1600) {
  const resim = await createImageBitmap(dosya);
  const oran = Math.min(1, enUzunKenar / Math.max(resim.width, resim.height));
  const tuval = document.createElement('canvas');
  tuval.width = Math.round(resim.width * oran);
  tuval.height = Math.round(resim.height * oran);
  tuval.getContext('2d').drawImage(resim, 0, 0, tuval.width, tuval.height);
  return new Promise(coz => tuval.toBlob(coz, 'image/webp', 0.82));
}

// Depoya yükler, herkese açık adresini döndürür
async function gorselYukle(dosya) {
  const kucuk = await kucult(dosya);
  const yol = `${aktifTablo}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await db.storage.from('gorseller').upload(yol, kucuk, { contentType: 'image/webp' });
  if (error) throw error;

  return db.storage.from('gorseller').getPublicUrl(yol).data.publicUrl;
}

// Formdaki herhangi bir dosya seçicide değişiklik olunca
kayitFormu.addEventListener('change', async olay => {
  const secici = olay.target;
  if (secici.type !== 'file' || !secici.files.length) return;

  const alanAdi = secici.dataset.hedef;
  const alan = TABLOLAR[aktifTablo].alanlar.find(a => a.ad === alanAdi);
  const hedef = kayitFormu.elements[alanAdi];
  const kaydetButonu = kayitFormu.querySelector('button[type="submit"]');
  kaydetButonu.disabled = true;   // yükleme bitmeden kaydedilmesin

  for (const dosya of secici.files) {
    try {
      bildir(`Yükleniyor: ${dosya.name}…`);
      const adres = await gorselYukle(dosya);
      if (alan.tip === 'liste') {
        hedef.value = [hedef.value.trim(), adres].filter(Boolean).join('\n');
      } else {
        hedef.value = adres;
        const onizleme = document.getElementById(`onizleme-${alanAdi}`);
        onizleme.src = adres;
        onizleme.hidden = false;
      }
    } catch (hata) {
      console.error(hata);
      bildir(`"${dosya.name}" yüklenemedi: ${hata.message || 'bu dosya türü desteklenmiyor olabilir'}`);
    }
  }

  secici.value = '';
  kaydetButonu.disabled = false;
  bildir('Görsel hazır ✓ Kaydetmeyi unutma.');
});

// ===== Liste =====
async function listeyiCiz(tablo) {
  const ayar = TABLOLAR[tablo];
  kayitListesi.innerHTML = '<li class="bos">Yükleniyor…</li>';

  const kayitlar = await getir(tablo, ...ayar.siralama);
  if (!kayitlar) {
    kayitListesi.innerHTML = '<li class="bos">Kayıtlar yüklenemedi.</li>';
    return;
  }
  sonKayitlar = kayitlar;
  if (!kayitlar.length) {
    kayitListesi.innerHTML = '<li class="bos">Henüz kayıt yok. Soldaki formdan ilkini ekle.</li>';
    return;
  }

  kayitListesi.innerHTML = kayitlar.map(k => `
    <li class="kayit">
      <div>
        <b>${kacir(ayar.baslik(k))}</b>
        <small>${kacir(ayar.alt(k))}</small>
      </div>
      <div class="kayit-butonlar">
        <button data-islem="duzenle" data-id="${k.id}">Düzenle</button>
        <button data-islem="sil" data-id="${k.id}">Sil</button>
      </div>
    </li>`).join('');
}

async function mesajlariCiz() {
  kayitListesi.innerHTML = '<li class="bos">Yükleniyor…</li>';
  const mesajlar = await getir('mesajlar');
  if (!mesajlar) {
    kayitListesi.innerHTML = '<li class="bos">Mesajlar yüklenemedi.</li>';
    return;
  }
  if (!mesajlar.length) {
    kayitListesi.innerHTML = '<li class="bos">Henüz mesaj yok.</li>';
    return;
  }

  kayitListesi.innerHTML = mesajlar.map(m => `
    <li class="kayit mesaj ${m.okundu ? '' : 'yeni'}">
      <div>
        <b>${kacir(m.ad)}</b>
        <small>
          <a href="mailto:${kacir(m.eposta)}">${kacir(m.eposta)}</a>
          · ${new Date(m.created_at).toLocaleString('tr-TR')}
        </small>
      </div>
      <p>${kacir(m.mesaj)}</p>
      <div class="kayit-butonlar">
        ${m.okundu ? '' : `<button data-islem="okundu" data-id="${m.id}">Okundu</button>`}
        <button data-islem="sil" data-id="${m.id}">Sil</button>
      </div>
    </li>`).join('');
}

// Listedeki bütün butonlar için tek dinleyici (event delegation)
kayitListesi.addEventListener('click', async olay => {
  const buton = olay.target.closest('button');
  if (!buton) return;
  const id = Number(buton.dataset.id);
  const islem = buton.dataset.islem;

  if (islem === 'duzenle') {
    formuCiz(aktifTablo, sonKayitlar.find(k => k.id === id));
    formKolon.scrollIntoView({ behavior: 'smooth' });
  }

  if (islem === 'sil') {
    if (!confirm('Silmek istediğine emin misin? Bu geri alınamaz.')) return;
    const { error } = await db.from(aktifTablo).delete().eq('id', id);
    if (error) return bildir(`Silinemedi: ${error.message}`);
    bildir('Silindi ✓');
    sekmeAc(aktifTablo);
  }

  if (islem === 'okundu') {
    const { error } = await db.from('mesajlar').update({ okundu: true }).eq('id', id);
    if (error) return bildir(`Güncellenemedi: ${error.message}`);
    mesajlariCiz();
  }
});