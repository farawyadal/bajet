/* Bajet Bulanan
   Data disimpan dalam localStorage telefon/browser ini sahaja.

   Bentuk data:
   {
     v: 1,
     sheets: {
       "2026-10": { items: [ { id, type: "in" | "out", name, amount, group, note, paid } ] }
     }
   }
   Kunci sheet ialah bulan gaji. Sheet bulan baru dicipta 2 hari sebelum
   tarikh gaji (lihat tarikh-gaji.js) dengan menyalin sheet terakhir.
*/
(() => {
  'use strict';

  const KUNCI_SIMPAN = 'bajet-bulanan-v1';
  const BULAN = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  const BULAN_PENDEK = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  const HARI = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const TANPA_KUMPULAN = 'Lain-lain';

  const $ = (id) => document.getElementById(id);

  /* ---------- Tarikh ---------- */

  // ?hari=2026-10-20 pada URL membolehkan uji tarikh lain.
  function hariIni() {
    const q = new URLSearchParams(location.search).get('hari');
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) {
      const [y, m, d] = q.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function tarikhGaji(y, m) {
    const tahun = (window.TARIKH_GAJI || {})[y];
    const hari = tahun && Number(tahun[m]) > 0 ? Number(tahun[m]) : (window.GAJI_LALAI || 25);
    return new Date(y, m, hari);
  }

  function tarikhBuka(y, m) {
    const g = tarikhGaji(y, m);
    const awal = Number.isFinite(window.HARI_AWAL) ? window.HARI_AWAL : 2;
    return new Date(g.getFullYear(), g.getMonth(), g.getDate() - awal);
  }

  const kunci = (y, m) => y + '-' + String(m + 1).padStart(2, '0');
  const pecah = (k) => { const [y, m] = k.split('-').map(Number); return { y, m: m - 1 }; };

  function kunciSelepas(k) {
    let { y, m } = pecah(k);
    m += 1;
    if (m > 11) { m = 0; y += 1; }
    return kunci(y, m);
  }

  // Sheet yang sepatutnya aktif pada tarikh t.
  function kunciSemasa(t) {
    let y = t.getFullYear();
    let m = t.getMonth();
    if (t < tarikhBuka(y, m)) {
      m -= 1;
      if (m < 0) { m = 11; y -= 1; }
    }
    return kunci(y, m);
  }

  const namaSheet = (k) => { const { y, m } = pecah(k); return BULAN[m] + ' ' + y; };
  const tarikhPendek = (d) => d.getDate() + ' ' + BULAN_PENDEK[d.getMonth()];
  const tarikhPenuh = (d) => HARI[d.getDay()] + ', ' + tarikhPendek(d);
  const bezaHari = (a, b) => Math.round((a - b) / 86400000);

  /* ---------- Duit ---------- */

  const keSen = (rm) => Math.round((Number(rm) || 0) * 100);
  const nf = new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt = (sen) => nf.format(sen / 100);

  function bacaJumlah(teks) {
    const s = String(teks).replace(/rm/i, '').replace(/[\s,]/g, '');
    if (s === '') return 0;
    if (!/^\d*\.?\d*$/.test(s) || s === '.') return null;
    const n = Number(s);
    if (!Number.isFinite(n) || n < 0 || n > 99999999) return null;
    return Math.round(n * 100) / 100;
  }

  /* ---------- Simpanan ---------- */

  let data = { v: 1, sheets: {} };
  let lihat = null; // kunci sheet yang sedang dipapar

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function bersihItem(x) {
    x = x || {};
    const amaun = Number(x.amount);
    return {
      id: uid(),
      type: x.type === 'in' ? 'in' : 'out',
      name: String(x.name == null ? '' : x.name).trim().slice(0, 80) || 'Tanpa nama',
      amount: Number.isFinite(amaun) && amaun >= 0 ? Math.round(amaun * 100) / 100 : 0,
      group: String(x.group == null ? '' : x.group).trim().slice(0, 40),
      note: String(x.note == null ? '' : x.note).trim().slice(0, 300),
      paid: x.paid === true,
    };
  }

  function bersihSheets(sheets) {
    const keluar = {};
    Object.keys(sheets || {}).forEach((k) => {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(k)) return;
      const items = sheets[k] && Array.isArray(sheets[k].items) ? sheets[k].items : [];
      keluar[k] = { items: items.map(bersihItem) };
    });
    return keluar;
  }

  function muat() {
    try {
      const mentah = localStorage.getItem(KUNCI_SIMPAN);
      if (!mentah) return;
      const j = JSON.parse(mentah);
      if (j && j.sheets) data = { v: 1, sheets: bersihSheets(j.sheets) };
    } catch (e) {
      console.warn('Tak dapat baca data tersimpan', e);
    }
  }

  function simpan() {
    try {
      localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(data));
      return true;
    } catch (e) {
      toast('Tak dapat simpan. Storan browser penuh atau disekat.');
      return false;
    }
  }

  const senaraiKunci = () => Object.keys(data.sheets).sort();
  const sheetLihat = () => data.sheets[lihat];

  // Cipta sheet bulan semasa kalau dah sampai masanya. Pulangkan kunci baru, atau null.
  function sediakanSheet() {
    const ada = senaraiKunci();
    if (!ada.length) return null;
    const semasa = kunciSemasa(hariIni());
    const akhir = ada[ada.length - 1];
    if (akhir >= semasa) return null;
    data.sheets[semasa] = {
      items: data.sheets[akhir].items.map((i) => Object.assign({}, i, { id: uid(), paid: false })),
    };
    simpan();
    return semasa;
  }

  /* ---------- Papar ---------- */

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const IKON_TANDA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const IKON_EDIT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>';

  // Duit keluar disusun ikut kumpulan, mengikut turutan kumpulan mula-mula muncul.
  function kumpulKeluar(items) {
    const peta = new Map();
    items.forEach((i) => {
      if (i.type !== 'out') return;
      const g = i.group || TANPA_KUMPULAN;
      if (!peta.has(g)) peta.set(g, []);
      peta.get(g).push(i);
    });
    return Array.from(peta, ([nama, senarai]) => ({ nama, senarai }));
  }

  function htmlBaris(i) {
    const kelas = 'baris ' + (i.type === 'in' ? 'masuk' : 'keluar') + (i.paid ? ' bayar' : '');
    const catatan = i.note ? '<small class="catatan">' + esc(i.note) + '</small>' : '';
    return (
      '<li class="' + kelas + '" data-id="' + i.id + '">' +
        '<button class="baris-utama" type="button" aria-pressed="' + i.paid + '">' +
          '<span class="tanda">' + IKON_TANDA + '</span>' +
          '<span class="nama">' + esc(i.name) + catatan + '</span>' +
          '<span class="amaun">' + fmt(keSen(i.amount)) + '</span>' +
        '</button>' +
        '<button class="baris-edit" type="button" data-edit="' + i.id + '" aria-label="Edit ' + esc(i.name) + '">' + IKON_EDIT + '</button>' +
      '</li>'
    );
  }

  const jumlah = (senarai) => senarai.reduce((s, i) => s + keSen(i.amount), 0);

  function paparSenarai() {
    const items = sheetLihat().items;
    const masuk = items.filter((i) => i.type === 'in');
    const kumpulan = kumpulKeluar(items);
    const keluar = items.filter((i) => i.type === 'out');

    let h = '';

    h += '<section class="bahagian"><div class="bahagian-kepala"><h2>Duit masuk</h2><span>' + fmt(jumlah(masuk)) + '</span></div>';
    h += masuk.length
      ? '<ul class="baris-senarai">' + masuk.map(htmlBaris).join('') + '</ul>'
      : '<p class="kosong">Belum ada duit masuk. Tekan Tambah item dan pilih Duit masuk.</p>';
    h += '</section>';

    h += '<section class="bahagian"><div class="bahagian-kepala"><h2>Duit keluar</h2><span>' + fmt(jumlah(keluar)) + '</span></div>';
    if (kumpulan.length) {
      kumpulan.forEach((k) => {
        h += '<div class="kumpulan"><span>' + esc(k.nama) + '</span><span>' + fmt(jumlah(k.senarai)) + '</span></div>';
        h += '<ul class="baris-senarai">' + k.senarai.map(htmlBaris).join('') + '</ul>';
      });
    } else {
      h += '<p class="kosong">Belum ada bayaran. Tekan Tambah item untuk masukkan bayaran bulanan.</p>';
    }
    h += '</section>';

    $('senarai').innerHTML = h;
  }

  function paparRingkas() {
    const items = sheetLihat().items;
    const masuk = jumlah(items.filter((i) => i.type === 'in'));
    const keluarSemua = items.filter((i) => i.type === 'out');
    const keluar = jumlah(keluarSemua);
    const kira = keluarSemua.filter((i) => keSen(i.amount) > 0); // RM0 tak dikira sebagai bayaran
    const sudah = kira.filter((i) => i.paid);
    const belum = keluar - jumlah(sudah);
    const baki = masuk - keluar;

    const semua = kira.length > 0 && sudah.length === kira.length;
    $('belumLabel').textContent = semua ? 'Semua dah bayar' : 'Belum bayar';
    $('belumAngka').innerHTML = '<small>RM</small>' + fmt(belum);

    // Petak jalur ikut turutan paparan.
    const turutan = kumpulKeluar(items).flatMap((k) => k.senarai).filter((i) => keSen(i.amount) > 0);
    $('jalur').innerHTML = turutan
      .map((i) => '<i style="flex-grow:' + keSen(i.amount) + '"' + (i.paid ? ' class="bayar"' : '') + '></i>')
      .join('');

    const nota = kira.length
      ? 'Dah bayar ' + sudah.length + ' daripada ' + kira.length + ' bayaran, RM ' + fmt(jumlah(sudah))
      : 'Belum ada bayaran dalam senarai';
    $('jalurNota').textContent = nota;
    $('jalur').setAttribute('aria-label', nota);

    $('jumMasuk').textContent = fmt(masuk);
    $('jumKeluar').textContent = fmt(keluar);
    $('jumBaki').textContent = (baki < 0 ? '−' : '') + fmt(Math.abs(baki));
    $('jumBaki').parentElement.classList.toggle('kurang', baki < 0);
  }

  function paparKepala() {
    const ada = senaraiKunci();
    const idx = ada.indexOf(lihat);
    const terakhir = idx === ada.length - 1;
    const { y, m } = pecah(lihat);
    const gaji = tarikhGaji(y, m);
    const hari = hariIni();

    $('tajuk').textContent = namaSheet(lihat);
    document.title = namaSheet(lihat) + ' | Bajet Bulanan';

    let teks;
    if (terakhir) {
      const lagi = bezaHari(gaji, hari);
      if (lagi > 1) teks = 'Gaji masuk ' + tarikhPenuh(gaji) + ', lagi ' + lagi + ' hari';
      else if (lagi === 1) teks = 'Gaji masuk esok, ' + tarikhPenuh(gaji);
      else if (lagi === 0) teks = 'Gaji masuk hari ini';
      else teks = 'Gaji dah masuk ' + tarikhPenuh(gaji);
    } else {
      teks = 'Gaji ' + tarikhPenuh(gaji);
    }
    $('gaji').textContent = teks;

    $('btnSebelum').disabled = idx <= 0;
    $('btnSelepas').disabled = terakhir;
    $('btnSemasa').hidden = terakhir;

    if (terakhir) {
      const seterusnya = kunciSelepas(lihat);
      const p = pecah(seterusnya);
      $('akanDatang').hidden = false;
      $('akanDatang').textContent =
        'Sheet ' + namaSheet(seterusnya) + ' muncul pada ' + tarikhPenuh(tarikhBuka(p.y, p.m)) +
        ', 2 hari sebelum gaji ' + tarikhPendek(tarikhGaji(p.y, p.m)) +
        '. Senarai ini disalin ke situ dan semua tanda dah bayar dikosongkan.';
    } else {
      $('akanDatang').hidden = true;
    }
  }

  function papar() {
    const adaSheet = senaraiKunci().length > 0;
    $('mula').hidden = adaSheet;
    $('isi').hidden = !adaSheet;
    $('btnTambah').hidden = !adaSheet;
    $('btnSebelum').hidden = !adaSheet;
    $('btnSelepas').hidden = !adaSheet;
    if (!adaSheet) {
      $('tajuk').textContent = 'Bajet Bulanan';
      $('gaji').textContent = '';
      $('btnSemasa').hidden = true;
      return;
    }
    if (!data.sheets[lihat]) lihat = senaraiKunci().pop();
    paparKepala();
    paparRingkas();
    paparSenarai();
  }

  /* ---------- Toast ---------- */

  let toastMasa = null;
  let toastAsal = null;

  function toast(teks, buatAsal) {
    clearTimeout(toastMasa);
    toastAsal = buatAsal || null;
    $('toastTeks').textContent = teks;
    $('toastBtn').hidden = !buatAsal;
    $('toast').hidden = false;
    toastMasa = setTimeout(() => { $('toast').hidden = true; toastAsal = null; }, buatAsal ? 6000 : 3500);
  }

  $('toastBtn').addEventListener('click', () => {
    const f = toastAsal;
    clearTimeout(toastMasa);
    $('toast').hidden = true;
    toastAsal = null;
    if (f) f();
  });

  /* ---------- Tanda dah bayar (tekan 2 kali) ---------- */

  const cari = (id) => sheetLihat().items.find((i) => i.id === id);

  function togolBayar(id) {
    const item = cari(id);
    if (!item) return;
    item.paid = !item.paid;
    simpan();
    // Kemas kini baris sedia ada sahaja supaya sapuan kuning kelihatan.
    const li = $('senarai').querySelector('li[data-id="' + id + '"]');
    if (li) {
      li.classList.toggle('bayar', item.paid);
      li.querySelector('.baris-utama').setAttribute('aria-pressed', String(item.paid));
    }
    paparRingkas();
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) { /* tak penting */ } }
  }

  let ketukAkhir = { id: null, masa: 0 };

  $('senarai').addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit]');
    if (edit) { bukaBorang(edit.dataset.edit); return; }

    const utama = e.target.closest('.baris-utama');
    if (!utama) return;
    const id = utama.parentElement.dataset.id;

    // Papan kekunci (Enter / Space): terus tanda.
    if (e.detail === 0) { togolBayar(id); return; }

    if (ketukAkhir.id === id && e.timeStamp - ketukAkhir.masa < 450) {
      ketukAkhir = { id: null, masa: 0 };
      togolBayar(id);
    } else {
      ketukAkhir = { id, masa: e.timeStamp };
    }
  });

  /* ---------- Borang tambah / edit ---------- */

  const borang = $('borang');
  let sedangEdit = null; // id item, atau null untuk item baru

  const jenisDipilih = () => borang.querySelector('input[name="jenis"]:checked').value;

  function kemasBorangIkutJenis() {
    const masuk = jenisDipilih() === 'in';
    $('medanKumpulan').hidden = masuk;
    $('fBayarTeks').textContent = masuk ? 'Dah masuk' : 'Dah bayar';
  }

  function bukaBorang(id) {
    const item = id ? cari(id) : null;
    sedangEdit = item ? item.id : null;

    $('borangTajuk').textContent = item ? 'Edit item' : 'Tambah item';
    $('btnPadam').hidden = !item;
    $('borangRalat').hidden = true;

    borang.querySelector('input[name="jenis"][value="' + (item ? item.type : 'out') + '"]').checked = true;
    $('fNama').value = item ? item.name : '';
    $('fJumlah').value = item ? (item.amount ? item.amount.toFixed(2) : '') : '';
    $('fKumpulan').value = item ? item.group : '';
    $('fCatatan').value = item ? item.note : '';
    $('fBayar').checked = item ? item.paid : false;

    const kumpulan = Array.from(new Set(sheetLihat().items.map((i) => i.group).filter(Boolean)));
    $('senaraiKumpulan').innerHTML = kumpulan.map((g) => '<option value="' + esc(g) + '">').join('');

    kemasBorangIkutJenis();
    borang.showModal();

    // Bila edit, yang paling kerap ditukar ialah jumlah.
    const fokus = item ? $('fJumlah') : $('fNama');
    fokus.focus();
    if (item) fokus.select();
  }

  function ralatBorang(teks, medan) {
    $('borangRalat').textContent = teks;
    $('borangRalat').hidden = false;
    medan.focus();
  }

  borang.querySelectorAll('input[name="jenis"]').forEach((r) => r.addEventListener('change', kemasBorangIkutJenis));

  $('borangForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = $('fNama').value.trim();
    if (!nama) { ralatBorang('Isi nama item dulu.', $('fNama')); return; }
    const amaun = bacaJumlah($('fJumlah').value);
    if (amaun === null) { ralatBorang('Jumlah mesti nombor sahaja, contoh 150 atau 150.50.', $('fJumlah')); return; }

    const nilai = {
      type: jenisDipilih(),
      name: nama.slice(0, 80),
      amount: amaun,
      group: $('fKumpulan').value.trim().slice(0, 40),
      note: $('fCatatan').value.trim().slice(0, 300),
      paid: $('fBayar').checked,
    };

    const items = sheetLihat().items;
    if (sedangEdit) {
      const item = cari(sedangEdit);
      if (item) Object.assign(item, nilai);
    } else {
      const baru = Object.assign({ id: uid() }, nilai);
      // Letak selepas item terakhir dalam kumpulan yang sama, kalau ada.
      let pos = -1;
      items.forEach((i, n) => { if (i.type === baru.type && (baru.type === 'in' || i.group === baru.group)) pos = n; });
      if (pos >= 0) items.splice(pos + 1, 0, baru); else items.push(baru);
    }
    simpan();
    borang.close();
    papar();
    toast(sedangEdit ? 'Disimpan' : nilai.name + ' ditambah');
  });

  $('btnBatal').addEventListener('click', () => borang.close());

  $('btnPadam').addEventListener('click', () => {
    const items = sheetLihat().items;
    const pos = items.findIndex((i) => i.id === sedangEdit);
    if (pos < 0) { borang.close(); return; }
    const sheetAsal = lihat;
    const [dibuang] = items.splice(pos, 1);
    simpan();
    borang.close();
    papar();
    toast(dibuang.name + ' dipadam', () => {
      const s = data.sheets[sheetAsal];
      if (!s) return;
      s.items.splice(Math.min(pos, s.items.length), 0, dibuang);
      simpan();
      papar();
    });
  });

  $('btnTambah').addEventListener('click', () => bukaBorang(null));

  // Tekan kawasan gelap di luar helaian untuk tutup.
  document.querySelectorAll('dialog.helai').forEach((d) => {
    d.addEventListener('click', (e) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      const dalam = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!dalam) d.close();
    });
  });

  /* ---------- Tukar bulan ---------- */

  function alih(langkah) {
    const ada = senaraiKunci();
    const idx = ada.indexOf(lihat) + langkah;
    if (idx < 0 || idx >= ada.length) return;
    lihat = ada[idx];
    papar();
    window.scrollTo(0, 0);
  }

  $('btnSebelum').addEventListener('click', () => alih(-1));
  $('btnSelepas').addEventListener('click', () => alih(1));
  $('btnSemasa').addEventListener('click', () => { lihat = senaraiKunci().pop(); papar(); window.scrollTo(0, 0); });

  /* ---------- Menu: simpan salinan & import ---------- */

  const menu = $('menu');
  $('btnMenu').addEventListener('click', () => menu.showModal());
  $('btnTutupMenu').addEventListener('click', () => menu.close());

  $('btnEksport').addEventListener('click', () => {
    if (!senaraiKunci().length) { menu.close(); toast('Belum ada data untuk disimpan.'); return; }
    const t = new Date();
    const nama = 'bajet-bulanan-' + t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0') + '.json';
    const isi = JSON.stringify({ app: 'bajet-bulanan', v: 1, disimpan: t.toISOString(), sheets: data.sheets }, null, 2);
    const url = URL.createObjectURL(new Blob([isi], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    menu.close();
    toast('Salinan disimpan sebagai ' + nama);
  });

  function pilihFail() { $('failImport').value = ''; $('failImport').click(); }
  $('btnImport').addEventListener('click', () => { menu.close(); pilihFail(); });
  $('btnImportMula').addEventListener('click', pilihFail);

  $('failImport').addEventListener('change', async (e) => {
    const fail = e.target.files && e.target.files[0];
    if (!fail) return;
    let j;
    try {
      j = JSON.parse(await fail.text());
    } catch (err) {
      toast('Fail ini tak dapat dibaca. Pilih fail .json dari Bajet Bulanan.');
      return;
    }

    if (j && j.sheets && typeof j.sheets === 'object') {
      // Salinan penuh: ganti semua bulan.
      const baru = bersihSheets(j.sheets);
      if (!Object.keys(baru).length) { toast('Fail ini tak ada data bulan di dalamnya.'); return; }
      if (senaraiKunci().length && !confirm('Ganti semua data dalam apps ini dengan data dari fail?')) return;
      data = { v: 1, sheets: baru };
      simpan();
      sediakanSheet();
      lihat = senaraiKunci().pop();
      papar();
      toast('Data dipulihkan, ' + Object.keys(baru).length + ' bulan');
    } else if (j && Array.isArray(j.items)) {
      // Senarai sahaja: jadikan senarai bulan semasa.
      const k = senaraiKunci().length ? lihat : kunciSemasa(hariIni());
      const sedia = data.sheets[k];
      if (sedia && sedia.items.length && !confirm('Ganti senarai ' + namaSheet(k) + ' dengan senarai dari fail?')) return;
      data.sheets[k] = { items: j.items.map(bersihItem) };
      simpan();
      lihat = k;
      papar();
      toast(j.items.length + ' item dimasukkan ke ' + namaSheet(k));
    } else {
      toast('Fail ini bukan fail Bajet Bulanan.');
    }
  });

  $('btnKosong').addEventListener('click', () => {
    lihat = kunciSemasa(hariIni());
    data.sheets[lihat] = { items: [] };
    simpan();
    papar();
  });

  /* ---------- Mula ---------- */

  function semakSheetBaru() {
    const diTerakhir = lihat === null || lihat === senaraiKunci().pop();
    const baru = sediakanSheet();
    if (!baru) return false;
    const ada = senaraiKunci();
    const dari = ada[ada.length - 2];
    if (diTerakhir) lihat = baru;
    papar();
    toast('Sheet ' + namaSheet(baru) + ' dah sedia, disalin dari ' + namaSheet(dari) + '.');
    return true;
  }

  muat();
  lihat = senaraiKunci().pop() || null;
  if (!semakSheetBaru()) papar();

  // Kalau apps dibiar terbuka sampai tarikh sheet baru, semak semula bila kembali.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (!semakSheetBaru() && senaraiKunci().length) paparKepala();
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
