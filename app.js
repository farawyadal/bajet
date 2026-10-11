/* Bajet Bulanan
   Data disimpan dalam localStorage telefon/browser ini sahaja.

   Bentuk data (kunci "bajet-bulanan-v1"):
   {
     v: 1,
     sheets: {
       "2026-10": { items: [ { id, type: "in" | "out", name, amount, group, note, paid } ] }
     }
   }
   Kunci sheet ialah bulan gaji. Sheet bulan baru dicipta sendiri 2 hari sebelum
   tarikh gaji (lihat tarikh-gaji.js) dengan menyalin sheet sebelumnya, atau
   boleh disediakan lebih awal dengan butang di bawah senarai.

   Tetapan (kunci "bajet-bulanan-tetapan"): { bahasa, tema, utama }
*/
(() => {
  'use strict';

  const KUNCI_SIMPAN = 'bajet-bulanan-v1';
  const KUNCI_TETAPAN = 'bajet-bulanan-tetapan';

  const $ = (id) => document.getElementById(id);

  /* ---------- Bahasa ---------- */

  const TEKS = {
    ms: {
      bulan: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
      bulanPendek: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'],
      hari: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

      bulanSebelum: 'Bulan sebelum',
      bulanSelepas: 'Bulan selepas',
      tetapan: 'Tetapan',
      keSemasa: 'Pergi ke bulan semasa',

      mulaTajuk: 'Belum ada senarai bayaran',
      mulaTeks: 'Import senarai sedia ada, atau mula kosong dan tambah item satu per satu. Senarai disimpan dalam telefon ini sahaja.',
      mulaImport: 'Import senarai',
      mulaKosong: 'Mula dengan senarai kosong',

      belum: 'Belum bayar',
      semuaBayar: 'Semua dah bayar',
      masuk: 'Duit masuk',
      keluar: 'Duit keluar',
      baki: 'Baki',
      petunjukBayar: 'Dah bayar, tekan 2 kali',
      jalurNota: 'Dah bayar {a} daripada {b} bayaran, RM {j}',
      jalurKosong: 'Belum ada bayaran dalam senarai',
      kosongMasuk: 'Belum ada duit masuk. Tekan Tambah item dan pilih Duit masuk.',
      kosongKeluar: 'Belum ada bayaran. Tekan Tambah item untuk masukkan bayaran bulanan.',
      tanpaKumpulan: 'Lain-lain',
      tanpaNama: 'Tanpa nama',

      tambah: 'Tambah item',
      edit: 'Edit item',
      editAria: 'Edit {n}',
      fJenis: 'Jenis',
      fNama: 'Nama',
      fNamaPh: 'cth. Bil TNB',
      fJumlah: 'Jumlah (RM)',
      fKumpulan: 'Kumpulan',
      fKumpulanPh: 'cth. Bil, Transfer, Simpan',
      fCatatan: 'Catatan',
      fCatatanPh: 'Tak wajib',
      dahBayar: 'Dah bayar',
      dahMasuk: 'Dah masuk',
      padam: 'Padam',
      batal: 'Batal',
      simpan: 'Simpan',
      tutup: 'Tutup',
      buatAsal: 'Buat asal',
      ralatNama: 'Isi nama item dulu.',
      ralatJumlah: 'Jumlah mesti nombor sahaja, contoh 150 atau 150.50.',
      disimpan: 'Disimpan',
      ditambah: '{n} ditambah',
      dipadam: '{n} dipadam',

      gajiLagi: 'Gaji masuk {t}, lagi {n} hari',
      gajiEsok: 'Gaji masuk esok, {t}',
      gajiHariIni: 'Gaji masuk hari ini',
      gajiDah: 'Gaji dah masuk {t}',
      gajiBiasa: 'Gaji {t}',

      akanMuncul: 'Sheet {s} muncul sendiri pada {b}, {h} hari sebelum gaji {g}. Nak siapkan senarai lebih awal, sediakan sekarang.',
      sediaSekarang: 'Sediakan sheet {s} sekarang',
      dahSedia: 'Sheet {s} dah disediakan. Ia jadi muka utama pada {b}.',
      bukaSheet: 'Buka sheet {s}',
      awal: 'Disediakan awal. Sheet ini jadi muka utama pada {b}.',
      padamSheetNota: 'Sheet ini salinan {d} semasa ia disediakan. Padam kalau nak salin semula nanti.',
      padamSheet: 'Padam sheet ini',
      sheetSedia: 'Sheet {s} dah sedia, disalin dari {d}.',
      kiniUtama: 'Sheet {s} kini di muka utama.',
      sheetDipadam: 'Sheet {s} dipadam',

      bahasa: 'Bahasa',
      paparan: 'Paparan',
      temaSistem: 'Ikut sistem',
      temaTerang: 'Terang',
      temaGelap: 'Gelap',
      data: 'Data',
      dataNota: 'Semua data disimpan dalam telefon ini sahaja. Simpan salinan sekali-sekala supaya tak hilang kalau tukar telefon atau padam data browser.',
      eksport: 'Simpan salinan',
      eksportNota: 'Muat turun semua bulan sebagai satu fail',
      import: 'Import fail',
      importNota: 'Masukkan senarai awal, atau pulihkan dari salinan',
      tiadaData: 'Belum ada data untuk disimpan.',
      salinanDisimpan: 'Salinan disimpan sebagai {f}',
      failRosak: 'Fail ini tak dapat dibaca. Pilih fail .json dari Bajet Bulanan.',
      failTiadaBulan: 'Fail ini tak ada data bulan di dalamnya.',
      failBukan: 'Fail ini bukan fail Bajet Bulanan.',
      sahGantiSemua: 'Ganti semua data dalam apps ini dengan data dari fail?',
      sahGantiSenarai: 'Ganti senarai {s} dengan senarai dari fail?',
      dipulihkan: 'Data dipulihkan, {n} bulan',
      dimasukkan: '{n} item dimasukkan ke {s}',
      takDapatSimpan: 'Tak dapat simpan. Storan browser penuh atau disekat.',
    },

    en: {
      bulan: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      bulanPendek: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      hari: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

      bulanSebelum: 'Previous month',
      bulanSelepas: 'Next month',
      tetapan: 'Settings',
      keSemasa: 'Go to the current month',

      mulaTajuk: 'No payment list yet',
      mulaTeks: 'Import an existing list, or start empty and add items one at a time. The list is stored on this phone only.',
      mulaImport: 'Import a list',
      mulaKosong: 'Start with an empty list',

      belum: 'Still to pay',
      semuaBayar: 'All paid',
      masuk: 'Money in',
      keluar: 'Money out',
      baki: 'Balance',
      petunjukBayar: 'Paid, double tap',
      jalurNota: 'Paid {a} of {b} payments, RM {j}',
      jalurKosong: 'No payments in the list yet',
      kosongMasuk: 'No money in yet. Tap Add item and choose Money in.',
      kosongKeluar: 'No payments yet. Tap Add item to enter your monthly payments.',
      tanpaKumpulan: 'Other',
      tanpaNama: 'Untitled',

      tambah: 'Add item',
      edit: 'Edit item',
      editAria: 'Edit {n}',
      fJenis: 'Type',
      fNama: 'Name',
      fNamaPh: 'e.g. Electricity bill',
      fJumlah: 'Amount (RM)',
      fKumpulan: 'Group',
      fKumpulanPh: 'e.g. Bills, Transfers, Savings',
      fCatatan: 'Note',
      fCatatanPh: 'Optional',
      dahBayar: 'Paid',
      dahMasuk: 'Received',
      padam: 'Delete',
      batal: 'Cancel',
      simpan: 'Save',
      tutup: 'Close',
      buatAsal: 'Undo',
      ralatNama: 'Enter a name for the item.',
      ralatJumlah: 'Amount must be a number, for example 150 or 150.50.',
      disimpan: 'Saved',
      ditambah: '{n} added',
      dipadam: '{n} deleted',

      gajiLagi: 'Payday {t}, in {n} days',
      gajiEsok: 'Payday tomorrow, {t}',
      gajiHariIni: 'Payday is today',
      gajiDah: 'Paid on {t}',
      gajiBiasa: 'Payday {t}',

      akanMuncul: 'The {s} sheet appears on its own on {b}, {h} days before payday on {g}. To get the list ready sooner, prepare it now.',
      sediaSekarang: 'Prepare the {s} sheet now',
      dahSedia: 'The {s} sheet is ready. It becomes the main page on {b}.',
      bukaSheet: 'Open the {s} sheet',
      awal: 'Prepared early. This sheet becomes the main page on {b}.',
      padamSheetNota: 'This sheet is a copy of {d} from when it was prepared. Delete it to copy again later.',
      padamSheet: 'Delete this sheet',
      sheetSedia: 'The {s} sheet is ready, copied from {d}.',
      kiniUtama: 'The {s} sheet is now the main page.',
      sheetDipadam: '{s} sheet deleted',

      bahasa: 'Language',
      paparan: 'Appearance',
      temaSistem: 'System',
      temaTerang: 'Light',
      temaGelap: 'Dark',
      data: 'Data',
      dataNota: 'All data is stored on this phone only. Save a copy now and then so nothing is lost if you change phones or clear browser data.',
      eksport: 'Save a copy',
      eksportNota: 'Download every month as one file',
      import: 'Import a file',
      importNota: 'Load a starting list, or restore from a copy',
      tiadaData: 'There is no data to save yet.',
      salinanDisimpan: 'Copy saved as {f}',
      failRosak: "This file can't be read. Choose a .json file from Bajet Bulanan.",
      failTiadaBulan: 'This file has no month data in it.',
      failBukan: "This isn't a Bajet Bulanan file.",
      sahGantiSemua: 'Replace all data in this app with the data from the file?',
      sahGantiSenarai: 'Replace the {s} list with the list from the file?',
      dipulihkan: 'Data restored, {n} months',
      dimasukkan: '{n} items added to {s}',
      takDapatSimpan: "Couldn't save. Browser storage is full or blocked.",
    },
  };

  let tetapan = { bahasa: 'ms', tema: 'sistem', utama: null };

  function muatTetapan() {
    try {
      const j = JSON.parse(localStorage.getItem(KUNCI_TETAPAN) || '{}');
      if (j.bahasa === 'en' || j.bahasa === 'ms') tetapan.bahasa = j.bahasa;
      if (['sistem', 'terang', 'gelap'].includes(j.tema)) tetapan.tema = j.tema;
      if (typeof j.utama === 'string') tetapan.utama = j.utama;
    } catch (e) { /* guna lalai */ }
  }

  function simpanTetapan() {
    try { localStorage.setItem(KUNCI_TETAPAN, JSON.stringify(tetapan)); } catch (e) { /* tak penting */ }
  }

  // t('kunci', { n: 3 }) -> teks dalam bahasa semasa, {n} diganti.
  function t(k, nilai) {
    let s = TEKS[tetapan.bahasa][k];
    if (s === undefined) s = TEKS.ms[k];
    if (nilai) Object.keys(nilai).forEach((n) => { s = s.split('{' + n + '}').join(nilai[n]); });
    return s;
  }

  function gunaBahasa() {
    document.documentElement.lang = tetapan.bahasa;
    document.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach((e) => { e.placeholder = t(e.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach((e) => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
  }

  /* ---------- Tema ---------- */

  function gunaTema() {
    const akar = document.documentElement;
    if (tetapan.tema === 'gelap') akar.setAttribute('data-theme', 'dark');
    else if (tetapan.tema === 'terang') akar.setAttribute('data-theme', 'light');
    else akar.removeAttribute('data-theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(akar).getPropertyValue('--kertas').trim() || '#F6F7FB';
  }

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

  const hariAwal = () => (Number.isFinite(window.HARI_AWAL) ? window.HARI_AWAL : 2);

  function tarikhGaji(y, m) {
    const tahun = (window.TARIKH_GAJI || {})[y];
    const hari = tahun && Number(tahun[m]) > 0 ? Number(tahun[m]) : (window.GAJI_LALAI || 25);
    return new Date(y, m, hari);
  }

  function tarikhBuka(y, m) {
    const g = tarikhGaji(y, m);
    return new Date(g.getFullYear(), g.getMonth(), g.getDate() - hariAwal());
  }

  const kunci = (y, m) => y + '-' + String(m + 1).padStart(2, '0');
  const pecah = (k) => { const [y, m] = k.split('-').map(Number); return { y, m: m - 1 }; };

  function kunciSelepas(k) {
    let { y, m } = pecah(k);
    m += 1;
    if (m > 11) { m = 0; y += 1; }
    return kunci(y, m);
  }

  // Bulan gaji yang sedang berjalan pada tarikh t.
  function kunciSemasa(tarikh) {
    let y = tarikh.getFullYear();
    let m = tarikh.getMonth();
    if (tarikh < tarikhBuka(y, m)) {
      m -= 1;
      if (m < 0) { m = 11; y -= 1; }
    }
    return kunci(y, m);
  }

  const namaSheet = (k) => { const { y, m } = pecah(k); return t('bulan')[m] + ' ' + y; };
  const tarikhPendek = (d) => d.getDate() + ' ' + t('bulanPendek')[d.getMonth()];
  const tarikhPenuh = (d) => t('hari')[d.getDay()] + ', ' + tarikhPendek(d);
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
      name: String(x.name == null ? '' : x.name).trim().slice(0, 80) || t('tanpaNama'),
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
      toast(t('takDapatSimpan'));
      return false;
    }
  }

  const senaraiKunci = () => Object.keys(data.sheets).sort();
  const kunciAkhir = () => senaraiKunci().pop() || null;
  const sheetLihat = () => data.sheets[lihat];

  // Salinan sheet untuk bulan baru: item dan jumlah sama, tanda dah bayar dikosongkan.
  const salin = (k) => ({ items: data.sheets[k].items.map((i) => Object.assign({}, i, { id: uid(), paid: false })) });

  // Sheet muka utama: bulan gaji yang sedang berjalan. Sheet yang disediakan
  // awal untuk bulan depan belum jadi muka utama sehingga tarikh bukanya.
  function kunciUtama() {
    const ada = senaraiKunci();
    if (!ada.length) return null;
    const semasa = kunciSemasa(hariIni());
    const layak = ada.filter((k) => k <= semasa);
    return layak.length ? layak[layak.length - 1] : ada[0];
  }

  // Cipta sheet bulan semasa kalau dah sampai tarikhnya dan belum disediakan awal.
  function sediakanSheet() {
    const ada = senaraiKunci();
    if (!ada.length) return null;
    const semasa = kunciSemasa(hariIni());
    if (data.sheets[semasa]) return null;
    const sebelum = ada.filter((k) => k < semasa);
    if (!sebelum.length) return null;
    const dari = sebelum[sebelum.length - 1];
    data.sheets[semasa] = salin(dari);
    simpan();
    return { baru: semasa, dari };
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
      const g = i.group || '';
      if (!peta.has(g)) peta.set(g, []);
      peta.get(g).push(i);
    });
    return Array.from(peta, ([nama, senarai]) => ({ nama: nama || t('tanpaKumpulan'), senarai }));
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
        '<button class="baris-edit" type="button" data-edit="' + i.id + '" aria-label="' + esc(t('editAria', { n: i.name })) + '">' + IKON_EDIT + '</button>' +
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

    h += '<section class="bahagian"><div class="bahagian-kepala"><h2>' + esc(t('masuk')) + '</h2><span>' + fmt(jumlah(masuk)) + '</span></div>';
    h += masuk.length
      ? '<ul class="baris-senarai">' + masuk.map(htmlBaris).join('') + '</ul>'
      : '<p class="kosong">' + esc(t('kosongMasuk')) + '</p>';
    h += '</section>';

    h += '<section class="bahagian"><div class="bahagian-kepala"><h2>' + esc(t('keluar')) + '</h2><span>' + fmt(jumlah(keluar)) + '</span></div>';
    if (kumpulan.length) {
      kumpulan.forEach((k) => {
        h += '<div class="kumpulan"><span>' + esc(k.nama) + '</span><span>' + fmt(jumlah(k.senarai)) + '</span></div>';
        h += '<ul class="baris-senarai">' + k.senarai.map(htmlBaris).join('') + '</ul>';
      });
    } else {
      h += '<p class="kosong">' + esc(t('kosongKeluar')) + '</p>';
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
    $('belumLabel').textContent = semua ? t('semuaBayar') : t('belum');
    $('belumAngka').innerHTML = '<small>RM</small>' + fmt(belum);

    // Petak jalur ikut turutan paparan.
    const turutan = kumpulKeluar(items).flatMap((k) => k.senarai).filter((i) => keSen(i.amount) > 0);
    $('jalur').innerHTML = turutan
      .map((i) => '<i style="flex-grow:' + keSen(i.amount) + '"' + (i.paid ? ' class="bayar"' : '') + '></i>')
      .join('');

    const nota = kira.length
      ? t('jalurNota', { a: sudah.length, b: kira.length, j: fmt(jumlah(sudah)) })
      : t('jalurKosong');
    $('jalurNota').textContent = nota;
    $('jalur').setAttribute('aria-label', nota);

    $('jumMasuk').textContent = fmt(masuk);
    $('jumKeluar').textContent = fmt(keluar);
    $('jumBaki').textContent = (baki < 0 ? '−' : '') + fmt(Math.abs(baki));
    $('jumBaki').parentElement.classList.toggle('kurang', baki < 0);
  }

  let tindakanAkan = null; // apa butang di bawah senarai buat

  function paparKepala() {
    const ada = senaraiKunci();
    const idx = ada.indexOf(lihat);
    const akhir = ada[ada.length - 1];
    const utama = kunciUtama();
    const { y, m } = pecah(lihat);
    const gaji = tarikhGaji(y, m);
    const lagi = bezaHari(gaji, hariIni());

    $('tajuk').textContent = namaSheet(lihat);
    document.title = namaSheet(lihat) + ' | Bajet Bulanan';

    let teks;
    if (lagi > 1) teks = t('gajiLagi', { t: tarikhPenuh(gaji), n: lagi });
    else if (lagi === 1) teks = t('gajiEsok', { t: tarikhPenuh(gaji) });
    else if (lagi === 0) teks = t('gajiHariIni');
    else if (lihat === utama) teks = t('gajiDah', { t: tarikhPenuh(gaji) });
    else teks = t('gajiBiasa', { t: tarikhPenuh(gaji) });
    $('gaji').textContent = teks;

    $('btnSebelum').disabled = idx <= 0;
    $('btnSelepas').disabled = idx >= ada.length - 1;
    $('btnSemasa').hidden = lihat === utama;

    // Sheet yang disediakan awal: beritahu bila ia jadi muka utama.
    const awal = lihat > utama;
    $('awal').hidden = !awal;
    if (awal) $('awal').textContent = t('awal', { b: tarikhPenuh(tarikhBuka(y, m)) });

    // Bahagian bawah senarai.
    const kotak = $('akanDatang');
    tindakanAkan = null;
    if (lihat === utama && lihat === akhir) {
      // Belum ada sheet bulan depan: tunjuk bila ia muncul, dan tawar sediakan awal.
      const depan = kunciSelepas(lihat);
      const p = pecah(depan);
      $('akanTeks').textContent = t('akanMuncul', {
        s: namaSheet(depan), b: tarikhPenuh(tarikhBuka(p.y, p.m)), h: hariAwal(), g: tarikhPendek(tarikhGaji(p.y, p.m)),
      });
      $('btnAkan').textContent = t('sediaSekarang', { s: namaSheet(depan) });
      $('btnAkan').className = 'btn';
      tindakanAkan = 'sedia';
      kotak.hidden = false;
    } else if (lihat === utama && idx < ada.length - 1) {
      // Sheet bulan depan dah disediakan awal.
      const depan = ada[idx + 1];
      const p = pecah(depan);
      $('akanTeks').textContent = t('dahSedia', { s: namaSheet(depan), b: tarikhPenuh(tarikhBuka(p.y, p.m)) });
      $('btnAkan').textContent = t('bukaSheet', { s: namaSheet(depan) });
      $('btnAkan').className = 'btn';
      tindakanAkan = 'buka';
      kotak.hidden = false;
    } else if (awal && lihat === akhir && idx > 0) {
      $('akanTeks').textContent = t('padamSheetNota', { d: namaSheet(ada[idx - 1]) });
      $('btnAkan').textContent = t('padamSheet');
      $('btnAkan').className = 'btn bahaya';
      tindakanAkan = 'padam';
      kotak.hidden = false;
    } else {
      kotak.hidden = true;
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
      document.title = 'Bajet Bulanan';
      $('gaji').textContent = '';
      $('awal').hidden = true;
      $('btnSemasa').hidden = true;
      return;
    }
    if (!data.sheets[lihat]) lihat = kunciUtama();
    paparKepala();
    paparRingkas();
    paparSenarai();
  }

  const keAtas = () => window.scrollTo(0, 0);

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
    $('fBayarTeks').textContent = masuk ? t('dahMasuk') : t('dahBayar');
  }

  function bukaBorang(id) {
    const item = id ? cari(id) : null;
    sedangEdit = item ? item.id : null;

    $('borangTajuk').textContent = item ? t('edit') : t('tambah');
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
    if (!nama) { ralatBorang(t('ralatNama'), $('fNama')); return; }
    const amaun = bacaJumlah($('fJumlah').value);
    if (amaun === null) { ralatBorang(t('ralatJumlah'), $('fJumlah')); return; }

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
    toast(sedangEdit ? t('disimpan') : t('ditambah', { n: nilai.name }));
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
    toast(t('dipadam', { n: dibuang.name }), () => {
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
    keAtas();
  }

  $('btnSebelum').addEventListener('click', () => alih(-1));
  $('btnSelepas').addEventListener('click', () => alih(1));
  $('btnSemasa').addEventListener('click', () => { lihat = kunciUtama(); papar(); keAtas(); });

  /* ---------- Sediakan sheet bulan depan lebih awal ---------- */

  $('btnAkan').addEventListener('click', () => {
    if (tindakanAkan === 'sedia') {
      const dari = kunciAkhir();
      const baru = kunciSelepas(dari);
      if (data.sheets[baru]) return;
      data.sheets[baru] = salin(dari);
      simpan();
      lihat = baru;
      papar();
      keAtas();
      toast(t('sheetSedia', { s: namaSheet(baru), d: namaSheet(dari) }));
    } else if (tindakanAkan === 'buka') {
      alih(1);
    } else if (tindakanAkan === 'padam') {
      const k = lihat;
      if (k <= kunciUtama()) return; // hanya sheet yang disediakan awal boleh dipadam
      const simpanan = data.sheets[k];
      delete data.sheets[k];
      simpan();
      lihat = kunciUtama();
      papar();
      keAtas();
      toast(t('sheetDipadam', { s: namaSheet(k) }), () => {
        if (data.sheets[k]) return;
        data.sheets[k] = simpanan;
        simpan();
        lihat = k;
        papar();
        keAtas();
      });
    }
  });

  /* ---------- Tetapan: bahasa, paparan, simpan salinan & import ---------- */

  const menu = $('menu');

  $('btnMenu').addEventListener('click', () => {
    menu.querySelector('input[name="bahasa"][value="' + tetapan.bahasa + '"]').checked = true;
    menu.querySelector('input[name="tema"][value="' + tetapan.tema + '"]').checked = true;
    menu.showModal();
  });
  $('btnTutupMenu').addEventListener('click', () => menu.close());

  menu.querySelectorAll('input[name="bahasa"]').forEach((r) => r.addEventListener('change', () => {
    tetapan.bahasa = r.value;
    simpanTetapan();
    gunaBahasa();
    papar();
  }));

  menu.querySelectorAll('input[name="tema"]').forEach((r) => r.addEventListener('change', () => {
    tetapan.tema = r.value;
    simpanTetapan();
    gunaTema();
  }));

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const dengar = () => { if (tetapan.tema === 'sistem') gunaTema(); };
    if (mq.addEventListener) mq.addEventListener('change', dengar); else if (mq.addListener) mq.addListener(dengar);
  }

  $('btnEksport').addEventListener('click', () => {
    if (!senaraiKunci().length) { menu.close(); toast(t('tiadaData')); return; }
    const d = new Date();
    const nama = 'bajet-bulanan-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
    const isi = JSON.stringify({ app: 'bajet-bulanan', v: 1, disimpan: d.toISOString(), sheets: data.sheets }, null, 2);
    const url = URL.createObjectURL(new Blob([isi], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    menu.close();
    toast(t('salinanDisimpan', { f: nama }));
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
      toast(t('failRosak'));
      return;
    }

    if (j && j.sheets && typeof j.sheets === 'object') {
      // Salinan penuh: ganti semua bulan.
      const baru = bersihSheets(j.sheets);
      if (!Object.keys(baru).length) { toast(t('failTiadaBulan')); return; }
      if (senaraiKunci().length && !confirm(t('sahGantiSemua'))) return;
      data = { v: 1, sheets: baru };
      simpan();
      sediakanSheet();
      catatUtama();
      lihat = kunciUtama();
      papar();
      toast(t('dipulihkan', { n: Object.keys(baru).length }));
    } else if (j && Array.isArray(j.items)) {
      // Senarai sahaja: jadikan senarai bulan yang sedang dipapar.
      const k = senaraiKunci().length ? lihat : kunciSemasa(hariIni());
      const sedia = data.sheets[k];
      if (sedia && sedia.items.length && !confirm(t('sahGantiSenarai', { s: namaSheet(k) }))) return;
      data.sheets[k] = { items: j.items.map(bersihItem) };
      simpan();
      catatUtama();
      lihat = k;
      papar();
      toast(t('dimasukkan', { n: j.items.length, s: namaSheet(k) }));
    } else {
      toast(t('failBukan'));
    }
  });

  $('btnKosong').addEventListener('click', () => {
    lihat = kunciSemasa(hariIni());
    data.sheets[lihat] = { items: [] };
    simpan();
    catatUtama();
    papar();
  });

  /* ---------- Mula ---------- */

  // Ingat sheet mana muka utama, supaya boleh beritahu bila ia bertukar.
  function catatUtama() {
    const u = kunciUtama();
    if (tetapan.utama !== u) { tetapan.utama = u; simpanTetapan(); }
  }

  // Semak sama ada bulan gaji dah bertukar. Pulangkan true kalau paparan dah dilukis.
  function semakBulanBaru() {
    if (!senaraiKunci().length) return false;
    const utamaLama = tetapan.utama;
    const diUtama = lihat === null || lihat === utamaLama;
    const hasil = sediakanSheet();
    const utama = kunciUtama();
    if (utama === utamaLama) return false;
    catatUtama();
    if (diUtama) lihat = utama;
    papar();
    if (hasil) toast(t('sheetSedia', { s: namaSheet(hasil.baru), d: namaSheet(hasil.dari) }));
    else if (utamaLama && utama > utamaLama) toast(t('kiniUtama', { s: namaSheet(utama) }));
    return true;
  }

  muatTetapan();
  gunaTema();
  gunaBahasa();
  muat();
  if (tetapan.utama && !data.sheets[tetapan.utama]) tetapan.utama = null;
  if (!semakBulanBaru()) {
    lihat = kunciUtama();
    catatUtama();
    papar();
  }

  // Kalau apps dibiar terbuka sampai tarikh sheet baru, semak semula bila kembali.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (!semakBulanBaru() && senaraiKunci().length) paparKepala();
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
