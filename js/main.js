// ===== Yardımcılar: SVG'ye piksel çizmek =====
const SVG_NS = 'http://www.w3.org/2000/svg';

// Bir dikdörtgen (piksel bloğu) çizer
function piksel(hedef, x, y, w, h, renk) {
  const r = document.createElementNS(SVG_NS, 'rect');
  r.setAttribute('x', x);
  r.setAttribute('y', y);
  r.setAttribute('width', w);
  r.setAttribute('height', h);
  r.setAttribute('fill', renk);
  hedef.appendChild(r);
}

// Yazıyla tarif edilen küçük bir resmi (sprite) çizer.
// Her harf paletteki bir renge karşılık gelir, '.' boş demektir.
function sprite(hedef, x, y, satirlar, palet) {
  satirlar.forEach((satir, sy) => {
    [...satir].forEach((harf, sx) => {
      if (palet[harf]) piksel(hedef, x + sx, y + sy, 1, 1, palet[harf]);
    });
  });
}

// Boş bir <g> grubu oluşturur ve verilen yere ekler
function grup(ebeveyn, sinif) {
  const g = document.createElementNS(SVG_NS, 'g');
  if (sinif) g.setAttribute('class', sinif);
  ebeveyn.appendChild(g);
  return g;
}

// ===== Açılış manzarası =====
function manzaraCiz() {
  const svg = document.getElementById('manzara');
  if (!svg) return;

  const gok = grup(svg);
  const bulutlar = grup(svg, 'kayan');
  const yer = grup(svg);

  // Gökyüzü bantları
  piksel(gok, 0, 0, 160, 16, '#6F9BC8');
  piksel(gok, 0, 16, 160, 12, '#84AAD3');
  piksel(gok, 0, 28, 160, 12, '#9BBCDF');
  piksel(gok, 0, 40, 160, 24, '#B5CFE8');

  // Bulutlar (yan yana iki kez çiziyoruz ki kayarken boşluk kalmasın)
  function bulut(x, y, w, acik, govde, golge) {
    piksel(bulutlar, x + Math.round(w * 0.25), y, Math.round(w * 0.3), 2, acik);
    piksel(bulutlar, x + Math.round(w * 0.1), y + 2, Math.round(w * 0.8), 2, acik);
    piksel(bulutlar, x, y + 4, w, 2, govde);
    piksel(bulutlar, x + Math.round(w * 0.05), y + 6, Math.round(w * 0.9), 1, golge);
  }
  for (const kaydir of [0, 160]) {
    [[10, 14, 26], [60, 20, 20], [100, 12, 30], [140, 22, 18]]
      .forEach(([x, y, w]) => bulut(x + kaydir, y, w, '#DCE5EE', '#C3D2E2', '#9FB4CC'));
    [[2, 6, 32], [44, 2, 24], [78, 9, 36], [124, 4, 28]]
      .forEach(([x, y, w]) => bulut(x + kaydir, y, w, '#FBF7EF', '#ECE6DB', '#B8C6D8'));
  }

  // Uzak dağlar
  for (let x = 0; x < 160; x++) {
    const h = Math.round(10 + 6 * Math.sin(x / 11) + 4 * Math.sin(x / 5.3 + 1));
    piksel(yer, x, 54 - h, 1, 10 + h, '#5E7FA0');
    piksel(yer, x, 54 - h, 1, 1, '#7C9BBA');
  }

  // Tepeler
  const tepe = [];
  for (let x = 0; x < 160; x++) {
    tepe[x] = 62 - Math.round(6 + 4 * Math.sin(x / 17 + 2) + 2 * Math.sin(x / 7));
    piksel(yer, x, tepe[x], 1, 100 - tepe[x], '#6E9C6A');
    piksel(yer, x, tepe[x], 1, 1, '#86B27E');
  }

  // Çayır
  for (let x = 0; x < 160; x++) {
    const t = Math.round(68 + 2 * Math.sin(x / 13));
    piksel(yer, x, t, 1, 100 - t, '#8DB86A');
    piksel(yer, x, t, 1, 1, '#A3C882');
  }

  // Sonbahar ağaçları
  const agac = ['..ooo..', '.ooyoo.', 'ooyoooo', 'ooooyoo', '.ooooo.', '..oto..', '...t...', '...t...', '...t...'];
  const kizil = { o: '#C8743A', y: '#E0A04A', t: '#5E4634' };
  const sari  = { o: '#D9A441', y: '#C8743A', t: '#5E4634' };
  [[14, kizil], [28, sari], [56, kizil], [112, sari], [126, kizil], [143, sari]]
    .forEach(([x, renk]) => sprite(yer, x, tepe[x + 3] - 8, agac, renk));

  // Ufka uzanan patika
  const patika = {};
  for (let y = 60; y < 100; y++) {
    const t = (y - 60) / 39;
    const orta = 84 - 6 * t + 10 * Math.sin(t * 3.4) * (0.4 + 0.6 * t);
    const yari = 0.7 + t * 13;
    const sol = Math.round(orta - yari);
    const gen = Math.max(1, Math.round(2 * yari));
    piksel(yer, sol, y, gen, 1, '#CFA874');
    piksel(yer, sol - 1, y, 1, 1, '#A57E4E');
    piksel(yer, sol + gen, y, 1, 1, '#A57E4E');
    patika[y] = { sol: sol - 2, sag: sol + gen + 2 };
  }
  const patikada = (x, y) => patika[y] && x >= patika[y].sol && x <= patika[y].sag;

  // Çimenler ve çiçekler (patikanın üstüne gelmesinler)
  for (let i = 0; i < 70; i++) {
    const x = (i * 29 + 7) % 158, y = 70 + (i * 17) % 26;
    if (patikada(x, y) || patikada(x + 2, y)) continue;
    piksel(yer, x, y, 1, 2, '#4F7E4A');
    piksel(yer, x + 2, y, 1, 2, '#4F7E4A');
    piksel(yer, x + 1, y + 1, 1, 1, '#4F7E4A');
  }
  const cicekRenk = ['#E8A6B4', '#F3D36B', '#A9C6D6', '#FBF7EF'];
  for (let i = 0; i < 50; i++) {
    const x = (i * 41 + 13) % 158, y = 71 + (i * 23) % 25;
    if (patikada(x, y)) continue;
    piksel(yer, x, y, 1, 1, cicekRenk[i % 4]);
    piksel(yer, x, y + 1, 1, 1, '#4F7E4A');
  }

  // Patikanın başında bekleyen beyaz kedi
  sprite(yer, 106, 85, [
    'a.....a..',
    'aa...aa..',
    'apaaaap..',
    'aadadaa..',
    'akaaaka..',
    'aaapaaa..',
    '.alllla..',
    '.aadaaa.a',
    'aadaadaaa',
    'aaaaaaaa.',
    '.ll..ll..'
  ], { a: '#F6F3EC', d: '#D3CCC0', l: '#FFFFFF', p: '#E8A6B4', k: '#2E2620' });
}
// ===== Oda =====

// Tıklanabilir bir eşya oluşturur: link + görünmez tıklama alanı + çizim + etiket
function esya(svg, ayar, ciz) {
  const a = document.createElementNS(SVG_NS, 'a');
  a.setAttribute('href', ayar.href);
  a.setAttribute('class', 'esya');
  a.setAttribute('aria-label', ayar.ad);
  svg.appendChild(a);

  // Görünmez tıklama alanları: pikseller arası boşluklarda da tıklanabilsin
  ayar.alanlar.forEach(([x, y, w, h]) => piksel(a, x, y, w, h, 'transparent'));

  const cizim = grup(a, 'cizim');
  ciz(cizim);

  // Üstüne gelince görünen etiket
  const [ex, ey, ew] = ayar.etiket;
  const etiket = grup(a, 'etiket');
  const kutu = document.createElementNS(SVG_NS, 'rect');
  kutu.setAttribute('x', ex);
  kutu.setAttribute('y', ey);
  kutu.setAttribute('width', ew);
  kutu.setAttribute('height', 8);
  kutu.setAttribute('fill', '#FBF6EC');
  kutu.setAttribute('stroke', '#1F2A44');
  kutu.setAttribute('stroke-width', '0.6');
  etiket.appendChild(kutu);
  const yazi = document.createElementNS(SVG_NS, 'text');
  yazi.setAttribute('x', ex + ew / 2);
  yazi.setAttribute('y', ey + 6.2);
  yazi.setAttribute('text-anchor', 'middle');
  yazi.setAttribute('font-family', 'VT323, monospace');
  yazi.setAttribute('font-size', '7');
  yazi.setAttribute('fill', '#1F2A44');
  yazi.textContent = ayar.ad;
  etiket.appendChild(yazi);
}

function odaCiz() {
  const svg = document.getElementById('oda-svg');
  if (!svg) return;

  // --- Duvar, zemin, pencere çerçevesi ---
  const duvar = grup(svg);
  piksel(duvar, 0, 0, 160, 99, '#7C9A86');
  for (let sira = 0, y = 14; y < 96; y += 12, sira++) {        // çiçekli duvar kâğıdı
    for (let x = sira % 2 ? 12 : 4; x < 160; x += 16) {
      piksel(duvar, x, y - 1, 1, 3, '#D7A0AE');
      piksel(duvar, x - 1, y, 3, 1, '#D7A0AE');
      piksel(duvar, x, y, 1, 1, '#F1E8D8');
    }
  }
  piksel(duvar, 0, 96, 160, 3, '#5E4634');                    // süpürgelik
  piksel(duvar, 0, 99, 160, 41, '#9A6E48');                   // parke
  piksel(duvar, 0, 99, 160, 1, '#7E5838');
  for (let k = 0, y = 105; y < 140; y += 6, k++) {
    piksel(duvar, 0, y, 160, 1, '#87603E');
    for (let x = (k * 23) % 40; x < 160; x += 40) piksel(duvar, x, y - 5, 1, 5, '#87603E');
  }
  piksel(duvar, 54, 8, 52, 46, '#6B4A33');                    // pencere kasası

  // --- Pencere camı: dışarıda bulut ve yağmur ---
  const cam = grup(svg);
  cam.setAttribute('clip-path', 'url(#cam-alani)');
  piksel(cam, 58, 12, 44, 38, '#3A5F86');
  piksel(cam, 58, 36, 44, 14, '#4A6F95');
  const camBulut = grup(cam, 'pencere-bulut');
  for (const o of [0, 44]) {
    [[60, 14, 14], [80, 21, 10], [92, 14, 12]].forEach(([x, y, w]) => {
      piksel(camBulut, x + o + Math.round(w * 0.25), y, Math.round(w * 0.35), 1, '#D9E2EA');
      piksel(camBulut, x + o + Math.round(w * 0.1), y + 1, Math.round(w * 0.8), 1, '#D9E2EA');
      piksel(camBulut, x + o, y + 2, w, 2, '#B4C4D4');
      piksel(camBulut, x + o + 1, y + 4, w - 2, 1, '#9DB0C4');
    });
  }
  const camYagmur = grup(cam, 'pencere-yagmur');
  for (let i = 0; i < 18; i++) {
    const x = 58 + (i * 7 + 3) % 44, y = 12 + (i * 13) % 38;
    piksel(camYagmur, x, y, 1, 3, '#A9C6D6');
    piksel(camYagmur, x, y - 38, 1, 3, '#A9C6D6');
  }

  // --- Sabit eşyalar (tıklanmayanlar) ---
  const sabit = grup(svg);
  piksel(sabit, 79, 12, 2, 38, '#6B4A33');                    // pencere kayıtları
  piksel(sabit, 58, 30, 44, 2, '#6B4A33');
  piksel(sabit, 52, 52, 56, 3, '#8A6243');                    // pervaz
  piksel(sabit, 52, 55, 56, 1, '#6B4A33');
  for (const x of [48, 104]) {                                // pembe perdeler
    piksel(sabit, x, 8, 8, 48, '#E8A6B4');
    piksel(sabit, x + 2, 8, 1, 48, '#D98FA0');
    piksel(sabit, x + 5, 8, 1, 48, '#D98FA0');
    piksel(sabit, x, 34, 8, 2, '#C9A04A');
  }
  piksel(sabit, 47, 7, 66, 1, '#5E4634');                     // korniş
  piksel(sabit, 46, 6, 2, 3, '#5E4634');
  piksel(sabit, 112, 6, 2, 3, '#5E4634');
  piksel(sabit, 84, 47, 4, 5, '#A9C6D6');                     // pervazdaki vazo
  piksel(sabit, 85, 46, 2, 1, '#7FA3B8');
  piksel(sabit, 85, 42, 1, 4, '#6E9C6A');
  piksel(sabit, 86, 41, 1, 5, '#6E9C6A');
  piksel(sabit, 84, 40, 2, 2, '#E8A6B4');
  piksel(sabit, 86, 39, 2, 2, '#D98FA0');
  piksel(sabit, 87, 41, 2, 2, '#F3D36B');
  piksel(sabit, 94, 72, 58, 3, '#B07A4A');                    // masa
  piksel(sabit, 94, 75, 58, 1, '#8A5A34');
  piksel(sabit, 96, 76, 2, 32, '#8A5A34');
  piksel(sabit, 148, 76, 2, 32, '#8A5A34');
  piksel(sabit, 128, 76, 18, 8, '#A06C40');
  piksel(sabit, 136, 79, 2, 2, '#5E4634');
  piksel(sabit, 133, 64, 6, 8, '#F1E8D8');                    // ıhlamur kupası
  piksel(sabit, 134, 64, 4, 1, '#C9A04A');
  piksel(sabit, 139, 66, 2, 1, '#F1E8D8');
  piksel(sabit, 140, 67, 1, 3, '#F1E8D8');
  piksel(sabit, 139, 69, 2, 1, '#F1E8D8');
  piksel(sabit, 135, 67, 2, 2, '#E8A6B4');
  piksel(sabit, 143, 70, 8, 2, '#2F4E8C');                    // masa lambası
  piksel(sabit, 148, 62, 1, 8, '#2F4E8C');
  piksel(sabit, 146, 60, 2, 2, '#2F4E8C');
  piksel(sabit, 144, 58, 2, 2, '#2F4E8C');
  piksel(sabit, 138, 55, 8, 4, '#2F4E8C');
  piksel(sabit, 140, 59, 4, 1, '#F6E3A0');
  piksel(sabit, 48, 84, 22, 14, '#A07650');                   // ahşap sehpa
  piksel(sabit, 48, 84, 22, 1, '#B98D62');
  piksel(sabit, 48, 89, 22, 1, '#8A6243');
  piksel(sabit, 48, 93, 22, 1, '#8A6243');
  piksel(sabit, 49, 98, 2, 2, '#6B4A33');
  piksel(sabit, 67, 98, 2, 2, '#6B4A33');
  piksel(sabit, 9, 117, 22, 1, '#8A6243');                    // yün sepeti
  piksel(sabit, 10, 118, 20, 8, '#B08A58');
  piksel(sabit, 10, 120, 20, 1, '#8A6243');
  piksel(sabit, 10, 123, 20, 1, '#8A6243');
  piksel(sabit, 12, 112, 6, 5, '#E8A6B4');
  piksel(sabit, 13, 114, 4, 1, '#C47E8F');
  piksel(sabit, 19, 111, 6, 6, '#7FA3B8');
  piksel(sabit, 20, 113, 4, 1, '#6488A0');
  piksel(sabit, 25, 113, 5, 4, '#7A9E7E');
  piksel(sabit, 21, 109, 1, 2, '#C9A04A');
  piksel(sabit, 22, 111, 1, 2, '#C9A04A');
  piksel(sabit, 28, 109, 1, 2, '#C9A04A');
  piksel(sabit, 27, 111, 1, 2, '#C9A04A');
  piksel(sabit, 9, 126, 22, 1, '#7E5838');
  for (let y = 110; y < 134; y++) {                           // oval pembe halı
    const dy = (y + 0.5 - 122) / 12;
    const yari = Math.round(38 * Math.sqrt(1 - dy * dy));
    if (yari < 1) continue;
    piksel(sabit, 72 - yari, y, 2 * yari, 1, '#B86F82');
    const ic = yari - 3;
    if (Math.abs(dy) < 0.84 && ic > 2) {
      piksel(sabit, 72 - ic, y, 2 * ic, 1, '#D98FA0');
      if ((y === 121 || y === 122) && ic > 8) piksel(sabit, 72 - ic + 4, y, 2 * ic - 8, 1, '#7FA3B8');
    }
    if (y >= 117 && y <= 127 && y % 2 === 0) {               // püsküller
      piksel(sabit, 72 - yari - 1, y, 1, 1, '#F1E8D8');
      piksel(sabit, 72 + yari, y, 1, 1, '#F1E8D8');
    }
  }
  for (const y of [116, 127]) {
    for (let x = 48; x <= 96; x += 8) {
      piksel(sabit, x, y - 1, 1, 3, '#F1E8D8');
      piksel(sabit, x - 1, y, 3, 1, '#F1E8D8');
    }
  }
  piksel(sabit, 120, 118, 30, 1, '#8FB0CC');                  // kedinin mavi minderi
  piksel(sabit, 118, 119, 34, 1, '#8FB0CC');
  piksel(sabit, 116, 120, 38, 11, '#6F93B5');
  piksel(sabit, 117, 131, 36, 2, '#557A9C');
  piksel(sabit, 120, 133, 30, 1, '#557A9C');
  for (const [x, y] of [[115, 119], [153, 119], [115, 131], [153, 131]]) piksel(sabit, x, y, 2, 2, '#F3D36B');

  // --- Tıklanabilir eşyalar ---

    esya(svg, { href: 'okuduklarim.html', ad: 'Okuduklarım', alanlar: [[4, 16, 44, 64]], etiket: [4, 21, 42] }, g => {
    piksel(g, 6, 30, 40, 70, '#6B4A33');                      // kitaplık gövdesi
    piksel(g, 4, 28, 44, 3, '#8A6243');
    piksel(g, 8, 31, 36, 67, '#4A3528');
    piksel(g, 8, 57, 36, 2, '#8A6243');
    piksel(g, 8, 78, 36, 2, '#8A6243');
    piksel(g, 6, 98, 40, 2, '#5E4634');
    piksel(g, 9, 23, 6, 5, '#C8743A');                        // üstte saksı
    piksel(g, 8, 22, 8, 1, '#A85C2A');
    piksel(g, 9, 19, 2, 3, '#6E9C6A');
    piksel(g, 12, 18, 2, 4, '#82B07A');
    piksel(g, 14, 20, 2, 2, '#6E9C6A');
    piksel(g, 7, 28, 2, 6, '#6E9C6A');
    piksel(g, 6, 32, 2, 4, '#82B07A');
    piksel(g, 28, 25, 14, 3, '#7FA3B8');                      // üstte kitap yığını
    piksel(g, 30, 22, 11, 3, '#C9A04A');
    const renkler = ['#7A9E7E', '#D98FA0', '#7FA3B8', '#C8743A', '#C9A04A', '#7D5A6E', '#E8A6B4', '#A9C6D6'];
    const genislik = [3, 4, 3, 5, 3, 4, 4, 3, 5, 3];
    for (let x = 9, k = 0; x < 42; k++) {                      // üst raftaki kitaplar
      const w = Math.min(genislik[k % genislik.length], 43 - x);
      if (w < 2) break;
      const h = 15 + (k * 5) % 8;
      piksel(g, x, 57 - h, w, h, renkler[k % renkler.length]);
      piksel(g, x, 57 - h, 1, h, '#4A3528');
      piksel(g, x, 57 - h + 3, w, 1, '#FBF6EC');
      piksel(g, x, 53, w, 1, '#FBF6EC');
      x += w;
    }
    piksel(g, 11, 71, 10, 7, '#3B4252');                      // fotoğraf makinesi
    piksel(g, 13, 69, 4, 2, '#3B4252');
    piksel(g, 14, 72, 4, 4, '#A9C6D6');
    piksel(g, 15, 73, 2, 2, '#1F2A44');
    piksel(g, 19, 72, 1, 1, '#F1E8D8');
    piksel(g, 24, 66, 9, 12, '#C8743A');                      // küçük çerçeve
    piksel(g, 25, 67, 7, 10, '#F3EDE2');
    piksel(g, 25, 72, 7, 5, '#8DB86A');
    piksel(g, 29, 68, 2, 2, '#E8A6B4');
    piksel(g, 35, 74, 7, 4, '#D98FA0');                       // küçük saksı
    piksel(g, 36, 71, 5, 3, '#6E9C6A');
    piksel(g, 38, 69, 1, 2, '#82B07A');
  });

  esya(svg, { href: 'fotograflar.html', ad: 'Fotoğraflar', alanlar: [[6, 7, 41, 12]], etiket: [8, 20, 38] }, g => {
    piksel(g, 8, 8, 14, 10, '#6B4A33');
    piksel(g, 9, 9, 12, 8, '#A9C8E4');
    piksel(g, 9, 13, 12, 4, '#8DB86A');
    piksel(g, 17, 10, 2, 2, '#F3D36B');
    piksel(g, 26, 9, 10, 9, '#6B4A33');
    piksel(g, 27, 10, 8, 7, '#F1E8D8');
    piksel(g, 30, 11, 2, 2, '#E8A6B4');
    piksel(g, 31, 13, 1, 3, '#6E9C6A');
    piksel(g, 39, 8, 7, 7, '#C8743A');
    piksel(g, 40, 9, 5, 5, '#FBF6EC');
    piksel(g, 41, 10, 3, 3, '#D98FA0');
  });

 
  esya(svg, { href: 'izlediklerim.html', ad: 'İzlediklerim', alanlar: [[8, 80, 24, 19], [110, 8, 48, 49]], etiket: [112, 1, 44] }, g => {
    piksel(g, 10, 90, 16, 8, '#3B4252');                      // projektör
    piksel(g, 10, 90, 16, 1, '#5A6478');
    piksel(g, 12, 93, 4, 1, '#8C94A3');
    piksel(g, 12, 95, 4, 1, '#8C94A3');
    piksel(g, 26, 91, 3, 5, '#5A6478');
    piksel(g, 29, 92, 1, 3, '#FFF6C8');
    for (const x of [10, 18]) {                               // film makaraları
      piksel(g, x + 1, 82, 6, 1, '#5E5143');
      piksel(g, x, 83, 8, 5, '#5E5143');
      piksel(g, x + 1, 88, 6, 1, '#5E5143');
      piksel(g, x + 3, 85, 2, 1, '#C9A04A');
    }
    piksel(g, 110, 10, 48, 2, '#3B4252');                     // perde
    piksel(g, 112, 12, 44, 38, '#FBF6EC');
    piksel(g, 111, 50, 46, 2, '#3B4252');
    piksel(g, 134, 52, 1, 3, '#3B4252');
    piksel(g, 133, 55, 3, 1, '#C9A04A');
    const film = grup(g, 'titrek');                           // perdede oynayan sahne
    piksel(film, 115, 15, 38, 32, '#F3C9B6');
    piksel(film, 115, 15, 38, 10, '#EDB7B9');
    piksel(film, 136, 22, 6, 6, '#F8E3A4');
    piksel(film, 115, 33, 38, 14, '#A9C4A0');
    piksel(film, 115, 31, 12, 2, '#A9C4A0');
    piksel(film, 139, 30, 14, 3, '#A9C4A0');
    piksel(film, 131, 33, 4, 3, '#E8D3B0');
    piksel(film, 129, 36, 6, 4, '#E8D3B0');
    piksel(film, 127, 40, 8, 7, '#E8D3B0');
    piksel(film, 145, 25, 5, 5, '#E3A57A');
    piksel(film, 147, 30, 1, 3, '#8C7A6E');
    piksel(film, 118, 26, 4, 4, '#E9C27A');
    piksel(film, 119, 30, 1, 3, '#8C7A6E');
    piksel(film, 120, 39, 4, 4, '#F4F1EA');
    piksel(film, 120, 38, 1, 1, '#F4F1EA');
    piksel(film, 123, 38, 1, 1, '#F4F1EA');
    piksel(film, 124, 42, 2, 1, '#F4F1EA');
  });

  esya(svg, { href: 'projelerim.html', ad: 'Projelerim', alanlar: [[106, 53, 27, 20]], etiket: [102, 45, 34] }, g => {
    piksel(g, 108, 54, 22, 16, '#3B4252');                    // laptop
    piksel(g, 109, 55, 20, 14, '#1E3530');
    [[110, 57, 8, '#7FB069'], [112, 59, 10, '#E8A6B4'], [112, 61, 6, '#A9C6D6'],
     [110, 63, 12, '#7FB069'], [112, 65, 7, '#F3D36B'], [110, 67, 4, '#E8A6B4']]
      .forEach(([x, y, w, renk]) => piksel(g, x, y, w, 1, renk));
    piksel(g, 106, 70, 26, 2, '#8C94A3');
  });

  esya(svg, { href: 'hakkimda.html', ad: 'Hakkımda', alanlar: [[94, 63, 13, 10]], etiket: [86, 55, 30] }, g => {
    piksel(g, 95, 67, 11, 2, '#D98FA0');                      // pembe günlük
    piksel(g, 96, 69, 10, 2, '#FBF6EC');
    piksel(g, 95, 69, 1, 3, '#BF7386');
    piksel(g, 95, 71, 11, 1, '#BF7386');
    piksel(g, 103, 69, 1, 4, '#C9A04A');
    piksel(g, 99, 67, 1, 1, '#FBF6EC');
    piksel(g, 101, 67, 1, 1, '#FBF6EC');
    piksel(g, 96, 65, 6, 1, '#F3D36B');                       // kalem
    piksel(g, 102, 65, 1, 1, '#3B4252');
  });

  esya(svg, { href: 'iletisim.html', ad: 'İletişim', alanlar: [[48, 72, 22, 13]], etiket: [44, 64, 30] }, g => {
    piksel(g, 52, 84, 16, 1, '#7E5838');                      // mektup
    piksel(g, 51, 74, 16, 10, '#FBF6EC');
    for (let k = 0; k < 6; k++) {
      piksel(g, 51 + k, 74 + k, 1, 1, '#B9AE9C');
      piksel(g, 66 - k, 74 + k, 1, 1, '#B9AE9C');
    }
    piksel(g, 57, 79, 4, 1, '#E8A6B4');
    piksel(g, 58, 80, 2, 1, '#E8A6B4');
  });

  // --- Işıklar ve buhar ---
  const huzme = grup(svg);                                    // projektör ışığı
  huzme.setAttribute('opacity', '0.16');
  huzme.setAttribute('pointer-events', 'none');
  for (let x = 30; x <= 112; x++) {
    const t = (x - 29) / 83;
    const ust = Math.round(91 + (13 - 91) * t);
    const alt = Math.round(94 + (49 - 94) * t);
    piksel(huzme, x, ust, 1, alt - ust + 1, '#FFF6C8');
  }
  const lambaIsigi = grup(svg);
  lambaIsigi.setAttribute('opacity', '0.3');
  lambaIsigi.setAttribute('pointer-events', 'none');
  for (let k = 0; k < 11; k++) piksel(lambaIsigi, 140 - Math.round(k * 0.7), 60 + k, 4 + Math.round(k * 1.4), 1, '#F6E3A0');
  const buhar = grup(svg, 'buhar');
  for (const [x, y] of [[135, 60], [136, 58], [135, 56], [137, 61], [138, 59], [137, 57]]) piksel(buhar, x, y, 1, 2, '#F1E8D8');

  // --- Beyaz kedi: uyuyan ve uyanık hâli ---
  const kediSatirlari = [
    '..a...a.................',
    '.apa.apa....aaaaaaa.....',
    '.aaaaaaaa.aadaadaadaa...',
    'aadaadaaaaaadaadaadaaaa.',
    'aaaaaaaaaaaaaaaaaaaaaaaa',
    'akkaakkaaaadaadaadaadaaa',
    'aaalpllaaaaaaaaaaaaaaaaa',
    '.allllaaaadaadaadaadaaaa',
    '..llllaaaaaaaaaaaaaaaaa.',
    '...aaaaaaaaaaaaaaaaaaaa.',
    '....ddaadaadaadaadaa....'
  ];
  const uyanikSatirlar = [...kediSatirlari];
  uyanikSatirlar[4] = 'ayyaayyaaaaaaaaaaaaaaaaa';                // açık mavi gözler
  uyanikSatirlar[5] = 'aykaaykaaaadaadaadaadaaa';
  const kediPalet = { a: '#F6F3EC', d: '#D3CCC0', l: '#FFFFFF', p: '#E8A6B4', k: '#2E2620', y: '#7FA3B8' };

  const uyuyan = grup(svg, 'kedi-uyuyan');
  sprite(uyuyan, 123, 110, kediSatirlari, kediPalet);
  const zz = document.createElementNS(SVG_NS, 'text');
  zz.setAttribute('x', 140);
  zz.setAttribute('y', 108);
  zz.setAttribute('class', 'zz');
  zz.setAttribute('font-family', 'VT323, monospace');
  zz.setAttribute('font-size', '8');
  zz.setAttribute('fill', '#FBF6EC');
  zz.textContent = 'z z';
  uyuyan.appendChild(zz);

  const uyanik = grup(svg, 'kedi-uyanik');
  sprite(uyanik, 123, 110, uyanikSatirlar, kediPalet);
  uyanik.style.display = 'none';

  // Kediye tıklayınca uyan / tekrar uyu
  const kediButon = document.getElementById('kedi-buton');
  const balon = document.getElementById('kedi-balon');
  kediButon.addEventListener('click', () => {
    const simdiUyaniyor = uyanik.style.display === 'none';
    uyanik.style.display = simdiUyaniyor ? '' : 'none';
    uyuyan.style.display = simdiUyaniyor ? 'none' : '';
    balon.hidden = !simdiUyaniyor;
    kediButon.setAttribute('aria-label', simdiUyaniyor ? 'Kediyi tekrar uyut' : 'Kediyi uyandır');
  });
}
// ===== Açılış → oda geçişi =====
function odayaGir() {
  document.getElementById('acilis').hidden = true;
  document.getElementById('oda').hidden = false;
  try { sessionStorage.setItem('odada', '1'); } catch (e) {}
}

function acilisiKur() {
  const basla = document.getElementById('basla');
  if (!basla) return;

  basla.addEventListener('click', odayaGir);
  document.getElementById('evet').addEventListener('click', odayaGir);
  document.getElementById('hayir').addEventListener('click', () => {
    document.getElementById('uyari-metni').textContent = 'Ama tekir seni bekliyor... Emin misin?';
  });

  // Bu sekmede daha önce odaya girdiyse açılışı atla
  let odada = false;
  try { odada = sessionStorage.getItem('odada') === '1'; } catch (e) {}
  if (odada) odayaGir();
}
// ===== Filtre sekmeleri (Okuduklarım, İzlediklerim) =====
function filtreleriKur() {
  document.querySelectorAll('[data-filtre-grubu]').forEach(sekmeler => {
    const liste = document.getElementById(sekmeler.dataset.filtreGrubu);
    const butonlar = sekmeler.querySelectorAll('button');

    butonlar.forEach(buton => {
      buton.addEventListener('click', () => {
        // Basılan butonu "seçili" yap, diğerlerini kaldır
        butonlar.forEach(b => b.setAttribute('aria-pressed', b === buton));

        // Kartları göster/gizle
        const filtre = buton.dataset.filtre;
        liste.querySelectorAll('[data-tur]').forEach(kart => {
          kart.hidden = filtre !== 'hepsi' && kart.dataset.tur !== filtre;
        });
      });
    });
  });
}
// ===== Fotoğraf galerisi =====
function galeriKur() {
  const pencere = document.getElementById('buyuk-foto');
  if (!pencere) return;

  const fotolar = [...document.querySelectorAll('.polaroid')];
  const buyukGorsel = pencere.querySelector('.foto');
  let simdiki = 0;

  function goster(sira) {
    // Baştan sona, sondan başa sarsın
    simdiki = (sira + fotolar.length) % fotolar.length;
    const kaynak = fotolar[simdiki];
    const kucukGorsel = kaynak.querySelector('.foto');

    // Küçük fotoğrafın renklerini ve içeriğini büyüğe kopyala
    buyukGorsel.style.cssText = kucukGorsel.style.cssText;
    buyukGorsel.innerHTML = kucukGorsel.innerHTML;
    pencere.querySelector('.buyuk-yazi').textContent = kaynak.querySelector('.foto-yazi').textContent;
    pencere.querySelector('.sayac').textContent = `${simdiki + 1} / ${fotolar.length}`;
    pencere.querySelector('.buyuk-hikaye').textContent = kaynak.dataset.hikaye || '';
  }

  fotolar.forEach((foto, sira) => {
    foto.addEventListener('click', () => {
      goster(sira);
      pencere.showModal();
    });
  });

  pencere.querySelector('.onceki').addEventListener('click', () => goster(simdiki - 1));
  pencere.querySelector('.sonraki').addEventListener('click', () => goster(simdiki + 1));
  pencere.querySelector('.kapat').addEventListener('click', () => pencere.close());

  // Klavye okları ile gezinme
  pencere.addEventListener('keydown', olay => {
    if (olay.key === 'ArrowLeft') goster(simdiki - 1);
    if (olay.key === 'ArrowRight') goster(simdiki + 1);
  });

  // Karanlık arka plana tıklayınca kapat
  pencere.addEventListener('click', olay => {
    if (olay.target === pencere) pencere.close();
  });
}
// ===== İletişim formu =====
function formuKur() {
  const form = document.getElementById('mektup-formu');
  if (!form) return;

  const tamam = document.getElementById('mektup-tamam');
  const hata = document.getElementById('mektup-hata');
  const buton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async olay => {
    olay.preventDefault();
    hata.textContent = '';

    // Tuzak alan doluysa bu bir bot: sessizce "gönderildi" göster ama kaydetme
    if (form.web.value) {
      form.hidden = true;
      tamam.hidden = false;
      return;
    }

    buton.disabled = true;
    buton.textContent = 'Gönderiliyor…';

    const { error } = await db.from('mesajlar').insert({
      ad: form.ad.value.trim(),
      eposta: form.eposta.value.trim(),
      mesaj: form.mesaj.value.trim()
    });

    buton.disabled = false;
    buton.textContent = 'Mektubu gönder ›';

    if (error) {
      console.error(error);
      hata.textContent = 'Mektup şu an gönderilemedi. Bana doğrudan rumeysacar35@gmail.com adresinden yazabilirsin.';
      return;
    }

    form.reset();
    form.hidden = true;
    tamam.hidden = false;
  });

  document.getElementById('yeni-mektup').addEventListener('click', () => {
    tamam.hidden = true;
    form.hidden = false;
  });
}
// ===== Supabase yardımcıları =====

// Veritabanından gelen metni HTML'e güvenle yerleştirmek için özel karakterleri kaçırır
function kacir(metin) {
  return String(metin ?? '').replace(/[&<>"']/g, k => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[k]
  ));
}

function kalpDizisi(puan) {
  const p = Math.max(0, Math.min(5, puan || 0));
  return '♥'.repeat(p) + '♡'.repeat(5 - p);
}

// Bir tablonun bütün satırlarını getirir; hata olursa null döner
async function getir(tablo, siralama = 'created_at', artan = false) {
  if (typeof db === 'undefined') return null;
  const { data, error } = await db.from(tablo).select('*').order(siralama, { ascending: artan });
  if (error) {
    console.error(tablo, error);
    return null;
  }
  return data;
}

// ===== Oda: "Şu an okuyorum / izliyorum" =====
async function odaDurumlariGetir() {
  const kitapKutu = document.getElementById('durum-kitap');
  const diziKutu = document.getElementById('durum-dizi');
  if (!kitapKutu) return;

  const [kitaplar, izlenenler] = await Promise.all([getir('kitaplar'), getir('izlenenler')]);
  const okunan = kitaplar?.find(k => k.durum === 'okuyor');
  const izlenen = izlenenler?.find(i => i.durum === 'izliyor');

  if (okunan) {
    kitapKutu.textContent = `▸ Şu an okuyorum: ${okunan.ad}`;
    kitapKutu.hidden = false;
  }
  if (izlenen) {
    diziKutu.textContent = `▸ İzliyorum: ${izlenen.ad}`;
    diziKutu.hidden = false;
  }
}

// ===== Okuduklarım =====
async function kitaplariGetir() {
  const liste = document.getElementById('kitap-listesi');
  if (!liste) return;

  const kitaplar = await getir('kitaplar');
  if (!kitaplar) {
    liste.innerHTML = '<li class="bos">Kitaplar şu an yüklenemedi.</li>';
    return;
  }

  // Öne çıkan kart: şu an okunan kitap
  const okunan = kitaplar.find(k => k.durum === 'okuyor');
  if (okunan) {
    const kutu = document.getElementById('su-an-okuyorum');
    const yuzde = okunan.ilerleme || 0;
    kutu.querySelector('.kapak').style.setProperty('--kapak', okunan.renk || '#7FA3B8');
    kutu.querySelector('h2').textContent = okunan.ad;
    kutu.querySelector('.yazar').textContent = okunan.yazar || '';
    kutu.querySelector('.ilerleme-dolum').style.width = `${yuzde}%`;
    kutu.querySelector('.ilerleme-yuzde').textContent = `%${yuzde}`;
    kutu.querySelector('.ilerleme-cubuk').setAttribute('aria-valuenow', yuzde);
    kutu.querySelector('.okunan-not').textContent = okunan.notu || '';
    kutu.hidden = false;
  }

  // Diğer kitaplar
  const digerleri = kitaplar.filter(k => k.durum !== 'okuyor');
  if (!digerleri.length) {
    liste.innerHTML = '<li class="bos">Henüz kitap eklenmedi.</li>';
    return;
  }
  liste.innerHTML = digerleri.map(k => `
    <li class="kitap" data-tur="${k.durum}">
      <div class="kapak" style="--kapak: ${kacir(k.renk || '#7FA3B8')}" aria-hidden="true"></div>
      <div class="kitap-bilgi">
        <span class="durum-cip" style="--renk: ${k.durum === 'okudum' ? '#E8F1E0' : '#FBEFD4'}">
          ${k.durum === 'okudum' ? 'Okudum' : 'Okuyacağım'}
        </span>
        <h3>${kacir(k.ad)}</h3>
        <span class="soluk">${kacir(k.yazar)}</span>
        ${k.durum === 'okudum' && k.puan
          ? `<span class="kalpler" aria-label="5 üzerinden ${k.puan} kalp">${kalpDizisi(k.puan)}</span>`
          : ''}
        ${k.notu ? `<p class="not">${kacir(k.notu)}</p>` : ''}
      </div>
    </li>`).join('');
}

// ===== İzlediklerim =====
async function izlenenleriGetir() {
  const liste = document.getElementById('izleme-listesi');
  if (!liste) return;

  const hepsi = await getir('izlenenler');
  if (!hepsi) {
    liste.innerHTML = '<li class="bos">Liste şu an yüklenemedi.</li>';
    return;
  }

  const simdi = hepsi.find(i => i.durum === 'izliyor');
  if (simdi) {
    const kutu = document.getElementById('bu-ara-izliyorum');
    kutu.querySelector('.sahne').innerHTML = simdi.gorsel_url
      ? `<img src="${kacir(simdi.gorsel_url)}" alt="">`
      : '';
    kutu.querySelector('h2').textContent = simdi.ad;
    kutu.querySelector('.nerede').textContent = [simdi.nerede, simdi.platform].filter(Boolean).join(' · ');
    kutu.querySelector('.izlenen-not').textContent = simdi.notu || '';
    kutu.hidden = false;
  }

  const digerleri = hepsi.filter(i => i.durum !== 'izliyor');
  if (!digerleri.length) {
    liste.innerHTML = '<li class="bos">Henüz bir şey eklenmedi.</li>';
    return;
  }
  liste.innerHTML = digerleri.map(i => `
    <li class="afis-kart" data-tur="${i.tur}">
      <div class="afis" style="--gok: ${kacir(i.renk || '#EDB7B9')}; --gunes: #F8E3A4; --zemin: #A9C4A0" aria-hidden="true">
        ${i.gorsel_url ? `<img src="${kacir(i.gorsel_url)}" alt="">` : ''}
        <span class="tur-etiketi">${i.tur === 'dizi' ? 'Dizi' : 'Film'}</span>
      </div>
      <div class="afis-bilgi">
        <h3>${kacir(i.ad)}</h3>
        <span class="soluk">${kacir([i.yil, i.kategori].filter(Boolean).join(' · '))}</span>
        ${i.puan ? `<span class="kalpler" aria-label="5 üzerinden ${i.puan} kalp">${kalpDizisi(i.puan)}</span>` : ''}
        ${i.notu ? `<p class="not">${kacir(i.notu)}</p>` : ''}
      </div>
    </li>`).join('');
}

// ===== Fotoğraflar =====
async function fotograflariGetir() {
  const galeri = document.getElementById('galeri');
  if (!galeri) return;

  const fotolar = await getir('fotograflar', 'sira', true);
  if (!fotolar) {
    galeri.innerHTML = '<li class="bos">Fotoğraflar şu an yüklenemedi.</li>';
    return;
  }
  if (!fotolar.length) {
    galeri.innerHTML = '<li class="bos">Henüz fotoğraf eklenmedi.</li>';
    return;
  }

  const egimler = [-3, 2, -1.5, 2.5, -2, 1, -2.5, 1.5, -1];
  const bantlar = ['#E8A6B4', '#A9C6D6', '#F3D36B'];
  galeri.innerHTML = fotolar.map((f, i) => `
    <li>
      <button class="polaroid"
              style="--egim: ${egimler[i % egimler.length]}deg; --bant: ${bantlar[i % bantlar.length]}"
              data-hikaye="${kacir(f.hikaye)}"
              aria-label="${kacir(f.yer || 'Fotoğraf')}, büyüt">
        <span class="foto"><img src="${kacir(f.gorsel_url)}" alt="${kacir(f.yer)}" loading="lazy"></span>
        <span class="foto-yazi">${kacir([f.yer, f.tarih].filter(Boolean).join(' · '))}</span>
      </button>
    </li>`).join('');

  galeriKur();   // polaroidler oluştuktan sonra tıklamaları bağla
}

// ===== Projelerim =====
async function projeleriKur() {
  const liste = document.getElementById('proje-listesi');
  const detay = document.getElementById('proje-detay');
  if (!liste) return;

  const projeler = await getir('projeler', 'sira', true);
  if (!projeler || !projeler.length) {
    detay.innerHTML = '<p class="metin">Projeler şu an yüklenemedi.</p>';
    return;
  }

  const klasorRengi = {
    'Yayında':    ['#8DB86A', '#5E8263'],
    'Tamamlandı': ['#A9C6D6', '#7FA3B8'],
    'Yapımda':    ['#F3D36B', '#C9A04A']
  };

  function gorselAlani(p) {
    const gorseller = p.gorseller || [];
    if (p.ekran === 'web') {
      const gorsel = gorseller[0]
        ? `<img src="${kacir(gorseller[0])}" alt="${kacir(p.ad)} ekran görüntüsü">`
        : `<div class="yer-tutucu">Ekran görüntüsü yakında</div>`;
      return `
        <div class="tarayici">
          <div class="tarayici-bar">
            <span></span><span></span><span></span>
            <span class="adres">${kacir(p.adres || p.ad)}</span>
          </div>
          <div class="tarayici-ekran">${gorsel}</div>
        </div>`;
    }
    return `
      <div class="telefonlar">
        ${[0, 1, 2].map(i => `
          <div class="telefon">
            ${gorseller[i]
              ? `<img src="${kacir(gorseller[i])}" alt="${kacir(p.ad)} ekran ${i + 1}">`
              : `<div class="yer-tutucu">Ekran ${i + 1}</div>`}
          </div>`).join('')}
      </div>`;
  }

  function goster(sira) {
    const p = projeler[sira];
    liste.querySelectorAll('.dosya').forEach((d, i) => {
      d.setAttribute('aria-current', i === sira ? 'true' : 'false');
    });

    detay.innerHTML = `
      <div class="proje-etiketler">
        <span class="cip-kutu" style="--renk: ${p.durum === 'Yapımda' ? '#FBEFD4' : '#E8F1E0'}">${kacir(p.durum)}</span>
        ${p.tur ? `<span class="cip-kutu" style="--renk: #E3EEF5">${kacir(p.tur)}</span>` : ''}
        ${p.rozet ? `<span class="cip-kutu" style="--renk: #FBEFD4">${kacir(p.rozet)}</span>` : ''}
      </div>

      <div class="bolum">
        <h2 class="proje-adi">${kacir(p.ad)}</h2>
        ${p.ozet ? `<p class="metin">${kacir(p.ozet)}</p>` : ''}
      </div>

      <div class="sahne-arka" style="background: ${kacir(p.renk || '#FFE9EE')}">${gorselAlani(p)}</div>

      ${p.rol || p.ogrendim ? `
        <div class="proje-bilgi">
          ${p.rol ? `<div><h3 class="kucuk-baslik">BENİM ROLÜM</h3><p class="metin">${kacir(p.rol)}</p></div>` : ''}
          ${p.ogrendim ? `<div><h3 class="kucuk-baslik">NE ÖĞRENDİM</h3><p class="metin">${kacir(p.ogrendim)}</p></div>` : ''}
        </div>` : ''}

      ${(p.teknolojiler || []).length ? `
        <div class="bolum">
          <h3 class="kucuk-baslik">KULLANDIKLARIM</h3>
          <ul class="teknolojiler">${p.teknolojiler.map(t => `<li>${kacir(t)}</li>`).join('')}</ul>
        </div>` : ''}

      <div class="proje-butonlar">
        ${p.canli_link ? `<a class="buton buton-pembe" href="${kacir(p.canli_link)}" target="_blank" rel="noopener">${kacir(p.canli_etiket || 'Canlı gör')} ›</a>` : ''}
        ${p.kod_link ? `<a class="buton" href="${kacir(p.kod_link)}" target="_blank" rel="noopener">GitHub'da incele</a>` : ''}
      </div>`;
  }

  liste.innerHTML = projeler.map((p, sira) => {
    const [govde, sekme] = klasorRengi[p.durum] || ['#E4DACA', '#BFB3A0'];
    return `
      <li>
        <button class="dosya" data-sira="${sira}">
          <svg width="30" height="26" viewBox="0 0 12 10" shape-rendering="crispEdges" aria-hidden="true">
            <rect x="0" y="0" width="5" height="2" fill="${sekme}"/>
            <rect x="0" y="1" width="12" height="9" fill="${govde}"/>
            <rect x="0" y="3" width="12" height="1" fill="${sekme}"/>
          </svg>
          <span>${kacir(p.ad)}</span>
        </button>
      </li>`;
  }).join('');

  liste.querySelectorAll('.dosya').forEach(buton => {
    buton.addEventListener('click', () => goster(Number(buton.dataset.sira)));
  });

  goster(0);
}
manzaraCiz();
odaCiz();
acilisiKur();
filtreleriKur();
formuKur();
projeleriKur();
kitaplariGetir();
izlenenleriGetir();
fotograflariGetir();
odaDurumlariGetir();

// Odadan patikaya geri dönüş
const donButon = document.getElementById('patikaya-don');
if (donButon) {
  donButon.addEventListener('click', () => {
    try { sessionStorage.removeItem('odada'); } catch (e) {}
    document.getElementById('oda').hidden = true;
    document.getElementById('acilis').hidden = false;
  });
}