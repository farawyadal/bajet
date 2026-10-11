/* MyBajet
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
      pasang: 'Pasang MyBajet pada telefon',
      dipasang: 'MyBajet dah dipasang',
      keSemasa: 'Pergi ke bulan semasa',

      mulaTajuk: 'Belum ada senarai bayaran',
      mulaTeks: 'Import senarai sedia ada, atau mula kosong dan tambah item satu per satu. Senarai disimpan dalam telefon ini sahaja.',
      mulaImport: 'Import senarai',
      mulaKosong: 'Mula dengan senarai kosong',

      belum: 'Belum selesai',
      semuaBayar: 'Semua dah selesai',
      masuk: 'Duit masuk',
      keluar: 'Duit keluar',
      masukPendek: 'Masuk',
      keluarPendek: 'Keluar',
      baki: 'Baki',
      petunjukBayar: 'Selesai',
      cara: 'Leret kiri atau tekan 2 kali untuk tanda selesai. Leret kanan untuk padam. Tekan lama nama kumpulan untuk selesaikan semua.',
      jalurNota: '{a} daripada {b} selesai',
      jalurPenuh: 'Selesai {a} daripada {b} bayaran, RM {j}',
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
      dahBayar: 'Dah selesai',
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

      aksiSelesai: 'Selesai',
      aksiBatalSelesai: 'Batal selesai',
      sahPadamTajuk: 'Padam {n}?',
      sahPadamTeks: 'Item ini dibuang dari senarai {s} sahaja. Bulan lain tak terusik.',
      semuaAria: 'Selesaikan semua dalam {g}',
      sahSemuaTajuk: 'Selesaikan semua dalam {g}?',
      sahSemuaTeks: '{n} bayaran berjumlah RM {j} akan ditanda selesai.',
      sahSemuaYa: 'Selesai semua',
      sahBatalSemuaTajuk: 'Batalkan tanda selesai dalam {g}?',
      sahBatalSemuaTeks: 'Semua {n} bayaran dalam kumpulan ini akan jadi belum selesai.',
      sahBatalSemuaYa: 'Batalkan semua',
      semuaSelesai: '{g}: {n} bayaran ditanda selesai',
      semuaBatal: '{g}: tanda selesai dibatalkan',

      tarikhGaji: 'Tarikh gaji',
      gajiLihat: 'Lihat dan isi tarikh gaji',
      gajiLihatNota: 'Semak tarikh gaji setiap bulan, dan isi tarikh tahun baru bila pekeliling keluar.',
      tahunSebelum: 'Tahun sebelum',
      tahunSelepas: 'Tahun selepas',
      gajiRasmi: 'Ikut pekeliling rasmi. Tukar nombor hari bulan kalau ada pindaan.',
      gajiSendiri: 'Diisi sendiri dalam telefon ini.',
      gajiTiada: 'Belum ada tarikh untuk {y}. Apps guna {d} hb setiap bulan sehingga diisi di sini.',
      gajiAnggar: 'Anggaran sahaja, belum ada pekeliling {y}. Dikira daripada corak tarikh gaji tahun-tahun lepas dan tarikh perayaan {y}. Betulkan di sini bila pekeliling keluar.',
      anggaran: ' (anggaran)',
      akanAnggar: ' Tarikh ini anggaran.',
      perayaan: { tbc: 'Tahun Baharu Cina', puasa: 'Hari Raya Puasa', haji: 'Hari Raya Haji', deepavali: 'Deepavali', krismas: 'Krismas', muharram: 'Awal Muharram' },
      gajiAsal: 'Guna tarikh asal',
      gajiRalat: 'Hari bulan untuk {b} mesti antara 1 dan {n}.',
      gajiDisimpan: 'Tarikh gaji {y} disimpan',
      gajiDipulih: 'Tarikh gaji {y} kembali ikut pekeliling',

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
      failRosak: 'Fail ini tak dapat dibaca. Pilih fail .json dari MyBajet.',
      failTiadaBulan: 'Fail ini tak ada data bulan di dalamnya.',
      failBukan: 'Fail ini bukan fail MyBajet.',
      sahGantiSemua: 'Ganti semua data dengan data dari fail?',
      sahGantiSemuaTeks: 'Semua bulan dalam apps ini akan diganti dengan isi fail.',
      sahGantiSenarai: 'Ganti senarai {s}?',
      sahGantiSenaraiTeks: 'Senarai bulan ini akan diganti dengan senarai dari fail.',
      ganti: 'Ganti',
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
      pasang: 'Install MyBajet on this phone',
      dipasang: 'MyBajet installed',
      keSemasa: 'Go to the current month',

      mulaTajuk: 'No payment list yet',
      mulaTeks: 'Import an existing list, or start empty and add items one at a time. The list is stored on this phone only.',
      mulaImport: 'Import a list',
      mulaKosong: 'Start with an empty list',

      belum: 'Still to pay',
      semuaBayar: 'All paid',
      masuk: 'Money in',
      keluar: 'Money out',
      masukPendek: 'In',
      keluarPendek: 'Out',
      baki: 'Balance',
      petunjukBayar: 'Paid',
      cara: 'Swipe left or double tap to mark paid. Swipe right to delete. Press and hold a group name to mark the whole group paid.',
      jalurNota: '{a} of {b} paid',
      jalurPenuh: 'Paid {a} of {b} payments, RM {j}',
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

      aksiSelesai: 'Paid',
      aksiBatalSelesai: 'Not paid',
      sahPadamTajuk: 'Delete {n}?',
      sahPadamTeks: 'This removes the item from the {s} list only. Other months are not affected.',
      semuaAria: 'Mark everything in {g} as paid',
      sahSemuaTajuk: 'Mark everything in {g} as paid?',
      sahSemuaTeks: '{n} payments totalling RM {j} will be marked paid.',
      sahSemuaYa: 'Mark all paid',
      sahBatalSemuaTajuk: 'Unmark everything in {g}?',
      sahBatalSemuaTeks: 'All {n} payments in this group will go back to not paid.',
      sahBatalSemuaYa: 'Unmark all',
      semuaSelesai: '{g}: {n} payments marked paid',
      semuaBatal: '{g}: paid marks removed',

      tarikhGaji: 'Payday dates',
      gajiLihat: 'View and enter payday dates',
      gajiLihatNota: 'Check each month\'s payday, and enter a new year\'s dates when the circular is out.',
      tahunSebelum: 'Previous year',
      tahunSelepas: 'Next year',
      gajiRasmi: 'From the official circular. Change a day number if a date is revised.',
      gajiSendiri: 'Entered on this phone.',
      gajiTiada: 'No dates for {y} yet. The app uses the {d}th of every month until you enter them here.',
      gajiAnggar: 'An estimate only; there is no circular for {y} yet. Worked out from the pattern of earlier years and the {y} festival dates. Correct it here when the circular is out.',
      anggaran: ' (estimate)',
      akanAnggar: ' These dates are an estimate.',
      perayaan: { tbc: 'Chinese New Year', puasa: 'Hari Raya Puasa', haji: 'Hari Raya Haji', deepavali: 'Deepavali', krismas: 'Christmas', muharram: 'Awal Muharram' },
      gajiAsal: 'Use original dates',
      gajiRalat: 'The day for {b} must be between 1 and {n}.',
      gajiDisimpan: 'Payday dates for {y} saved',
      gajiDipulih: 'Payday dates for {y} back to the circular',

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
      failRosak: "This file can't be read. Choose a .json file from MyBajet.",
      failTiadaBulan: 'This file has no month data in it.',
      failBukan: "This isn't a MyBajet file.",
      sahGantiSemua: 'Replace all data with the file?',
      sahGantiSemuaTeks: 'Every month in this app will be replaced with what is in the file.',
      sahGantiSenarai: 'Replace the {s} list?',
      sahGantiSenaraiTeks: 'This month\'s list will be replaced with the list from the file.',
      ganti: 'Replace',
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

  const gajiLalai = () => window.GAJI_LALAI || 25;
  const gajiRasmi = (y) => (window.TARIKH_GAJI || {})[y] || null;

  const gajiAnggar = (y) => (window.TARIKH_GAJI_ANGGARAN || {})[y] || null;

  // Dari mana tarikh gaji tahun y datang: diisi sendiri, pekeliling, anggaran, atau tiada (guna lalai).
  const sumberGaji = (y) => (data.gaji[y] ? 'sendiri' : gajiRasmi(y) ? 'rasmi' : gajiAnggar(y) ? 'anggar' : 'tiada');
  const gajiBelumPasti = (y) => { const s = sumberGaji(y); return s === 'anggar' || s === 'tiada'; };

  // Tarikh yang diisi sendiri dalam apps mengatasi tarikh dalam tarikh-gaji.js.
  function tarikhGaji(y, m) {
    const tahun = data.gaji[y] || gajiRasmi(y) || gajiAnggar(y);
    const hari = tahun && Number(tahun[m]) > 0 ? Number(tahun[m]) : gajiLalai();
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

  let data = { v: 1, sheets: {}, gaji: {} };
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

  // Tarikh gaji yang diisi sendiri: { 2028: [12 hari bulan] }
  function bersihGaji(g) {
    const keluar = {};
    Object.keys(g || {}).forEach((y) => {
      const a = g[y];
      if (!/^\d{4}$/.test(y) || !Array.isArray(a) || a.length !== 12) return;
      const hari = a.map((h) => Math.round(Number(h)));
      if (hari.every((h, m) => h >= 1 && h <= new Date(Number(y), m + 1, 0).getDate())) keluar[y] = hari;
    });
    return keluar;
  }

  function muat() {
    try {
      const mentah = localStorage.getItem(KUNCI_SIMPAN);
      if (!mentah) return;
      const j = JSON.parse(mentah);
      if (j && j.sheets) data = { v: 1, sheets: bersihSheets(j.sheets), gaji: bersihGaji(j.gaji) };
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
  const IKON_SEMUA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12.5l4.5 4.5 9.5-9.5"/><path d="M11.5 16l1 1 9.5-9.5"/></svg>';
  const IKON_TONG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/></svg>';
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
    return Array.from(peta, ([kunciKumpulan, senarai]) => ({ kunci: kunciKumpulan, nama: kunciKumpulan || t('tanpaKumpulan'), senarai }));
  }

  // Hanya duit keluar boleh ditanda selesai.
  const selesai = (i) => i.type === 'out' && i.paid;

  function htmlBaris(i) {
    const keluar = i.type === 'out';
    const kelas = 'baris ' + (keluar ? 'keluar' : 'masuk') + (selesai(i) ? ' bayar' : '');
    const catatan = i.note ? '<small class="catatan">' + esc(i.note) + '</small>' : '';
    return (
      '<li class="' + kelas + '" data-id="' + i.id + '">' +
        // Lapisan bawah: kelihatan bila baris dileret.
        '<div class="baris-bawah" aria-hidden="true">' +
          '<span class="aksi aksi-padam">' + IKON_TONG + esc(t('padam')) + '</span>' +
          (keluar ? '<span class="aksi aksi-selesai">' + esc(t('aksiSelesai')) + IKON_TANDA + '</span>' : '') +
        '</div>' +
        '<div class="baris-isi">' +
          '<button class="baris-utama" type="button"' + (keluar ? ' aria-pressed="' + selesai(i) + '"' : '') + '>' +
            (keluar ? '<span class="tanda">' + IKON_TANDA + '</span>' : '') +
            '<span class="nama">' + esc(i.name) + catatan + '</span>' +
            '<span class="amaun">' + fmt(keSen(i.amount)) + '</span>' +
          '</button>' +
          '<button class="baris-edit" type="button" data-edit="' + i.id + '" aria-label="' + esc(t('editAria', { n: i.name })) + '">' + IKON_EDIT + '</button>' +
        '</div>' +
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
        const penuh = k.senarai.every((i) => i.paid);
        h += '<div class="kumpulan" data-kumpulan="' + esc(k.kunci) + '">' +
          '<span class="kumpulan-nama">' + esc(k.nama) + '</span>' +
          '<span class="kumpulan-jumlah">' + fmt(jumlah(k.senarai)) + '</span>' +
          '<button class="kumpulan-semua' + (penuh ? ' penuh' : '') + '" type="button" aria-label="' + esc(t('semuaAria', { g: k.nama })) + '">' + IKON_SEMUA + '</button>' +
        '</div>';
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
    const sudah = kira.filter(selesai);
    const belum = keluar - jumlah(sudah);
    const baki = masuk - keluar;

    const semua = kira.length > 0 && sudah.length === kira.length;
    $('belumLabel').textContent = semua ? t('semuaBayar') : t('belum');
    $('belumAngka').innerHTML = '<small>RM</small>' + fmt(belum);

    // Petak jalur ikut turutan paparan.
    const turutan = kumpulKeluar(items).flatMap((k) => k.senarai).filter((i) => keSen(i.amount) > 0);
    $('jalur').innerHTML = turutan
      .map((i) => '<i style="flex-grow:' + keSen(i.amount) + '"' + (selesai(i) ? ' class="bayar"' : '') + '></i>')
      .join('');

    $('jalurNota').textContent = kira.length ? t('jalurNota', { a: sudah.length, b: kira.length }) : t('jalurKosong');
    $('jalur').setAttribute('aria-label', kira.length
      ? t('jalurPenuh', { a: sudah.length, b: kira.length, j: fmt(jumlah(sudah)) })
      : t('jalurKosong'));

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
    document.title = namaSheet(lihat) + ' | MyBajet';

    let teks;
    if (lagi > 1) teks = t('gajiLagi', { t: tarikhPenuh(gaji), n: lagi });
    else if (lagi === 1) teks = t('gajiEsok', { t: tarikhPenuh(gaji) });
    else if (lagi === 0) teks = t('gajiHariIni');
    else if (lihat === utama) teks = t('gajiDah', { t: tarikhPenuh(gaji) });
    else teks = t('gajiBiasa', { t: tarikhPenuh(gaji) });
    if (gajiBelumPasti(y) && lagi !== 0) teks += t('anggaran');
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
      }) + (gajiBelumPasti(p.y) ? t('akanAnggar') : '');
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
    $('ringkas').hidden = !adaSheet;
    $('btnTambah').hidden = !adaSheet;
    $('btnSebelum').hidden = !adaSheet;
    $('btnSelepas').hidden = !adaSheet;
    if (!adaSheet) {
      $('tajuk').textContent = 'MyBajet';
      document.title = 'MyBajet';
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

  /* ---------- Pengesahan ---------- */

  const sah = $('sah');
  let sahSelesai = null;

  // Tunjuk soalan ya/tidak. Pulangkan Promise<boolean>.
  function sahkan(o) {
    return new Promise((resolve) => {
      $('sahTajuk').textContent = o.tajuk;
      $('sahTeks').textContent = o.teks || '';
      $('sahTeks').hidden = !o.teks;
      $('sahYa').textContent = o.ya;
      $('sahYa').className = 'btn ' + (o.bahaya ? 'bahaya-penuh' : 'utama');
      sahSelesai = resolve;
      sah.returnValue = '';
      sah.showModal();
      $('sahTidak').focus(); // lalai yang selamat
    });
  }

  $('sahYa').addEventListener('click', () => sah.close('ya'));
  $('sahTidak').addEventListener('click', () => sah.close(''));
  sah.addEventListener('close', () => {
    const f = sahSelesai;
    sahSelesai = null;
    if (f) f(sah.returnValue === 'ya');
  });

  /* ---------- Tanda selesai: tekan 2 kali atau leret kiri ---------- */

  const cari = (id) => sheetLihat().items.find((i) => i.id === id);

  const getar = (ms) => { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* tak penting */ } } };

  // Kemas kini baris sedia ada sahaja (bukan lukis semula) supaya sapuan hijau kelihatan.
  function kemasBaris(item) {
    const li = $('senarai').querySelector('li[data-id="' + item.id + '"]');
    if (!li) return;
    li.classList.toggle('bayar', selesai(item));
    li.querySelector('.baris-utama').setAttribute('aria-pressed', String(selesai(item)));
    const label = li.querySelector('.aksi-selesai');
    if (label) label.firstChild.nodeValue = selesai(item) ? t('aksiBatalSelesai') : t('aksiSelesai');
  }

  const itemKumpulan = (g) => sheetLihat().items.filter((i) => i.type === 'out' && (i.group || '') === g);

  function kemasKumpulan(g) {
    $('senarai').querySelectorAll('.kumpulan').forEach((k) => {
      if (k.dataset.kumpulan !== g) return;
      k.querySelector('.kumpulan-semua').classList.toggle('penuh', itemKumpulan(g).every((i) => i.paid));
    });
  }

  function togolBayar(id) {
    const item = cari(id);
    if (!item || item.type !== 'out') return;
    item.paid = !item.paid;
    simpan();
    kemasBaris(item);
    kemasKumpulan(item.group || '');
    paparRingkas();
    getar(12);
  }

  // Selesaikan (atau batalkan) semua bayaran dalam satu kumpulan, selepas disahkan.
  async function selesaiSemua(g) {
    const sheet = lihat;
    const items = itemKumpulan(g);
    if (!items.length) return;
    const nama = g || t('tanpaKumpulan');
    const belum = items.filter((i) => !i.paid);
    const batal = belum.length === 0; // semua dah selesai: tawar batalkan
    const sasaran = batal ? items : belum;

    const ok = await sahkan(batal
      ? { tajuk: t('sahBatalSemuaTajuk', { g: nama }), teks: t('sahBatalSemuaTeks', { n: items.length }), ya: t('sahBatalSemuaYa') }
      : { tajuk: t('sahSemuaTajuk', { g: nama }), teks: t('sahSemuaTeks', { n: belum.length, j: fmt(jumlah(belum)) }), ya: t('sahSemuaYa') });
    if (!ok || lihat !== sheet) return;

    const asal = sasaran.map((i) => [i, i.paid]);
    sasaran.forEach((i) => { i.paid = !batal; });
    simpan();
    sasaran.forEach(kemasBaris);
    kemasKumpulan(g);
    paparRingkas();
    getar(20);
    toast(batal ? t('semuaBatal', { g: nama }) : t('semuaSelesai', { g: nama, n: sasaran.length }), () => {
      asal.forEach(([i, p]) => { i.paid = p; });
      simpan();
      papar();
    });
  }

  // Padam item selepas disahkan. Masih boleh "Buat asal" dari toast.
  async function padamItem(id) {
    const sheet = lihat;
    const item = cari(id);
    if (!item) return;
    const ok = await sahkan({
      tajuk: t('sahPadamTajuk', { n: item.name }),
      teks: t('sahPadamTeks', { s: namaSheet(sheet) }),
      ya: t('padam'),
      bahaya: true,
    });
    if (!ok) return;
    const s = data.sheets[sheet];
    const pos = s ? s.items.findIndex((i) => i.id === id) : -1;
    if (pos < 0) return;
    const [dibuang] = s.items.splice(pos, 1);
    simpan();
    if (borang.open) borang.close();
    papar();
    toast(t('dipadam', { n: dibuang.name }), () => {
      const semula = data.sheets[sheet];
      if (!semula) return;
      semula.items.splice(Math.min(pos, semula.items.length), 0, dibuang);
      simpan();
      papar();
    });
  }

  let ketukAkhir = { id: null, masa: 0 };
  let leretTamat = 0; // masa leretan terakhir tamat, supaya ia tak dikira sebagai ketukan
  let tahanTamat = 0; // sama, untuk tekan lama
  let tahanAktif = false; // jari masih menekan selepas tekan lama dikesan

  $('senarai').addEventListener('click', (e) => {
    if (Date.now() - leretTamat < 400 || Date.now() - tahanTamat < 700) return;

    const semua = e.target.closest('.kumpulan-semua');
    if (semua) { selesaiSemua(semua.parentElement.dataset.kumpulan); return; }

    const edit = e.target.closest('[data-edit]');
    if (edit) { bukaBorang(edit.dataset.edit); return; }

    const utama = e.target.closest('.baris-utama');
    if (!utama) return;
    const li = utama.closest('li');
    if (!li.classList.contains('keluar')) return; // duit masuk tak ditanda
    const id = li.dataset.id;

    // Papan kekunci (Enter / Space): terus tanda.
    if (e.detail === 0) { togolBayar(id); return; }

    if (ketukAkhir.id === id && e.timeStamp - ketukAkhir.masa < 450) {
      ketukAkhir = { id: null, masa: 0 };
      togolBayar(id);
    } else {
      ketukAkhir = { id, masa: e.timeStamp };
    }
  });

  /* ---------- Leret baris: kiri = selesai, kanan = padam ---------- */

  let seret = null;

  function tamatSeret(buat) {
    if (!seret) return;
    const s = seret;
    seret = null;
    s.li.classList.remove('menyeret', 'lepas-had');
    s.isi.style.transform = '';
    if (!s.aktif) return;
    leretTamat = Date.now();
    // Biar baris meluncur balik dulu, kemudian buang kelas arah.
    setTimeout(() => s.li.classList.remove('leret-kiri', 'leret-kanan'), 220);
    if (!buat || Math.abs(s.dx) < s.had) return;
    if (s.dx < 0) togolBayar(s.id); else padamItem(s.id);
  }

  $('senarai').addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const li = e.target.closest('li.baris');
    if (!li) return;
    seret = {
      li, id: li.dataset.id, isi: li.querySelector('.baris-isi'), pid: e.pointerId,
      x: e.clientX, y: e.clientY, dx: 0, aktif: false,
      bolehSelesai: li.classList.contains('keluar'),
      had: Math.min(120, li.offsetWidth * 0.3),
    };
  });

  $('senarai').addEventListener('pointermove', (e) => {
    if (!seret || e.pointerId !== seret.pid) return;
    const dx = e.clientX - seret.x;
    const dy = e.clientY - seret.y;
    if (!seret.aktif) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { seret = null; return; } // menatal, bukan leret
      if (Math.abs(dx) < 12) return;
      seret.aktif = true;
      seret.li.classList.add('menyeret');
      try { seret.li.setPointerCapture(e.pointerId); } catch (err) { /* tak penting */ }
    }
    // Duit masuk tak boleh ditanda selesai: leret kiri hanya bergerak sedikit.
    const d = dx < 0 && !seret.bolehSelesai ? dx * 0.12 : dx;
    seret.dx = dx < 0 && !seret.bolehSelesai ? 0 : dx;
    seret.isi.style.transform = 'translateX(' + d + 'px)';
    seret.li.classList.toggle('leret-kiri', d < 0);
    seret.li.classList.toggle('leret-kanan', d > 0);
    const lepas = Math.abs(seret.dx) >= seret.had;
    if (lepas && !seret.li.classList.contains('lepas-had')) getar(8);
    seret.li.classList.toggle('lepas-had', lepas);
  });

  $('senarai').addEventListener('pointerup', (e) => { if (seret && e.pointerId === seret.pid) tamatSeret(true); });
  $('senarai').addEventListener('pointercancel', (e) => { if (seret && e.pointerId === seret.pid) tamatSeret(false); });

  /* ---------- Tekan lama nama kumpulan: selesaikan semua ---------- */

  let tahan = null;

  function batalTahan() {
    if (tahan) { clearTimeout(tahan.masa); tahan = null; }
  }

  $('senarai').addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.kumpulan');
    if (!k || e.target.closest('.kumpulan-semua')) return;
    batalTahan();
    tahan = {
      x: e.clientX, y: e.clientY,
      masa: setTimeout(() => {
        tahan = null;
        tahanAktif = true;
        tahanTamat = Date.now();
        getar(20);
        selesaiSemua(k.dataset.kumpulan);
      }, 550),
    };
  });
  $('senarai').addEventListener('pointermove', (e) => {
    if (tahan && Math.hypot(e.clientX - tahan.x, e.clientY - tahan.y) > 10) batalTahan();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => $('senarai').addEventListener(n, batalTahan));
  $('senarai').addEventListener('contextmenu', (e) => { if (e.target.closest('.kumpulan')) e.preventDefault(); });
  // Bila jari diangkat selepas tekan lama, ada pelayar yang hantar satu "klik".
  // Tandakan masa itu supaya klik tersebut tak menutup soalan yang baru dibuka.
  ['pointerup', 'pointercancel'].forEach((n) => document.addEventListener(n, () => {
    if (tahanAktif) { tahanAktif = false; tahanTamat = Date.now(); }
  }, true));

  /* ---------- Borang tambah / edit ---------- */

  const borang = $('borang');
  let sedangEdit = null; // id item, atau null untuk item baru

  const jenisDipilih = () => borang.querySelector('input[name="jenis"]:checked').value;

  function kemasBorangIkutJenis() {
    const masuk = jenisDipilih() === 'in';
    $('medanKumpulan').hidden = masuk;
    $('medanBayar').hidden = masuk; // hanya duit keluar ditanda selesai
    $('fBayarTeks').textContent = t('dahBayar');
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
    $('fBayar').checked = item ? selesai(item) : false;

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

    const jenis = jenisDipilih();
    const nilai = {
      type: jenis,
      name: nama.slice(0, 80),
      amount: amaun,
      group: $('fKumpulan').value.trim().slice(0, 40),
      note: $('fCatatan').value.trim().slice(0, 300),
      paid: jenis === 'out' && $('fBayar').checked,
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

  $('btnPadam').addEventListener('click', () => { padamItem(sedangEdit); });

  $('btnTambah').addEventListener('click', () => bukaBorang(null));

  // Tekan kawasan gelap di luar helaian untuk tutup.
  document.querySelectorAll('dialog.helai').forEach((d) => {
    d.addEventListener('click', (e) => {
      if (e.target !== d) return;
      if (tahanAktif || Date.now() - tahanTamat < 700) return; // klik sisa daripada tekan lama
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

  /* ---------- Tarikh gaji: senarai dan isian ---------- */

  const gajiHelai = $('gajiHelai');
  let gajiTahun = null;

  const hariDalamBulan = (y, m) => new Date(y, m + 1, 0).getDate();

  function hadTahunGaji() {
    const rasmi = Object.keys(window.TARIKH_GAJI || {}).concat(Object.keys(window.TARIKH_GAJI_ANGGARAN || {})).map(Number);
    const sendiri = Object.keys(data.gaji).map(Number);
    const kini = hariIni().getFullYear();
    return {
      min: Math.min(kini, ...rasmi, ...sendiri),
      max: Math.max(kini + 2, ...rasmi.map((y) => y + 1), ...sendiri.map((y) => y + 1)),
    };
  }

  function paparGaji() {
    const y = gajiTahun;
    const had = hadTahunGaji();
    const sendiri = data.gaji[y];
    const rasmi = gajiRasmi(y);
    const anggar = gajiAnggar(y);
    const utama = kunciUtama();
    const perayaan = (window.PERAYAAN || {})[y] || [];

    $('gajiTahun').textContent = y;
    $('gajiSebelum').disabled = y <= had.min;
    $('gajiSelepas').disabled = y >= had.max;
    $('gajiSumber').textContent = sendiri ? t('gajiSendiri')
      : rasmi ? t('gajiRasmi')
      : anggar ? t('gajiAnggar', { y })
      : t('gajiTiada', { y, d: gajiLalai() });
    $('gajiAsal').hidden = !(sendiri && (rasmi || anggar));
    $('gajiRalat').hidden = true;

    let h = '';
    for (let m = 0; m < 12; m += 1) {
      const d = tarikhGaji(y, m);
      h += '<li' + (utama === kunci(y, m) ? ' class="kini"' : '') + '>' +
        '<label for="gajiHari' + m + '">' + esc(t('bulan')[m]) +
          perayaan.filter((p) => p[0] === m + 1).map((p) =>
            '<small class="g-nota">' + esc((t('perayaan')[p[2]] || p[2]) + ', ' + p[1] + ' ' + t('bulanPendek')[m]) + '</small>').join('') +
        '</label>' +
        '<input id="gajiHari' + m + '" type="number" inputmode="numeric" min="1" max="' + hariDalamBulan(y, m) + '" value="' + d.getDate() + '" data-m="' + m + '">' +
        '<span class="g-hari">' + esc(t('hari')[d.getDay()]) + '</span>' +
      '</li>';
    }
    $('gajiSenarai').innerHTML = h;
  }

  function bukaGaji(tahun) {
    const had = hadTahunGaji();
    gajiTahun = Math.min(had.max, Math.max(had.min, tahun || hariIni().getFullYear()));
    paparGaji();
    gajiHelai.showModal();
    $('gajiTutup').focus();
  }

  // Tunjuk hari (Isnin, Selasa...) sebaik sahaja nombor ditukar.
  $('gajiSenarai').addEventListener('input', (e) => {
    const inp = e.target.closest('input');
    if (!inp) return;
    $('gajiRalat').hidden = true;
    const m = Number(inp.dataset.m);
    const h = Number(inp.value);
    const sah2 = Number.isInteger(h) && h >= 1 && h <= hariDalamBulan(gajiTahun, m);
    inp.parentElement.querySelector('.g-hari').textContent = sah2 ? t('hari')[new Date(gajiTahun, m, h).getDay()] : '';
  });

  $('gajiSebelum').addEventListener('click', () => { gajiTahun -= 1; paparGaji(); });
  $('gajiSelepas').addEventListener('click', () => { gajiTahun += 1; paparGaji(); });
  $('gajiTutup').addEventListener('click', () => gajiHelai.close());

  function selepasTukarGaji() {
    simpan();
    if (!semakBulanBaru()) papar();
  }

  $('gajiSimpan').addEventListener('click', () => {
    const y = gajiTahun;
    const hari = [];
    for (const inp of $('gajiSenarai').querySelectorAll('input')) {
      const m = Number(inp.dataset.m);
      const h = Number(inp.value);
      const maks = hariDalamBulan(y, m);
      if (!Number.isInteger(h) || h < 1 || h > maks) {
        $('gajiRalat').textContent = t('gajiRalat', { b: t('bulan')[m], n: maks });
        $('gajiRalat').hidden = false;
        inp.focus();
        return;
      }
      hari.push(h);
    }
    const rasmi = gajiRasmi(y);
    // Sama dengan pekeliling: tak perlu simpan salinan sendiri.
    if (rasmi && hari.every((h, m) => h === Number(rasmi[m]))) delete data.gaji[y];
    else data.gaji[y] = hari;
    selepasTukarGaji();
    gajiHelai.close();
    toast(t('gajiDisimpan', { y }));
  });

  $('gajiAsal').addEventListener('click', () => {
    const y = gajiTahun;
    delete data.gaji[y];
    selepasTukarGaji();
    paparGaji();
    toast(t('gajiDipulih', { y }));
  });

  $('btnGaji').addEventListener('click', () => { menu.close(); bukaGaji(lihat ? pecah(lihat).y : null); });
  $('gaji').addEventListener('click', () => { if (lihat) bukaGaji(pecah(lihat).y); });

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const dengar = () => { if (tetapan.tema === 'sistem') gunaTema(); };
    if (mq.addEventListener) mq.addEventListener('change', dengar); else if (mq.addListener) mq.addListener(dengar);
  }

  $('btnEksport').addEventListener('click', () => {
    if (!senaraiKunci().length) { menu.close(); toast(t('tiadaData')); return; }
    const d = new Date();
    const nama = 'mybajet-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
    const isi = JSON.stringify({ app: 'bajet-bulanan', v: 1, disimpan: d.toISOString(), sheets: data.sheets, gaji: data.gaji }, null, 2);
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
      if (senaraiKunci().length && !(await sahkan({ tajuk: t('sahGantiSemua'), teks: t('sahGantiSemuaTeks'), ya: t('ganti'), bahaya: true }))) return;
      data = { v: 1, sheets: baru, gaji: bersihGaji(j.gaji) };
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
      if (sedia && sedia.items.length && !(await sahkan({ tajuk: t('sahGantiSenarai', { s: namaSheet(k) }), teks: t('sahGantiSenaraiTeks'), ya: t('ganti'), bahaya: true }))) return;
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

  /* ---------- Butang pasang ---------- */

  // Pelayar hantar "beforeinstallprompt" bila apps boleh dipasang. Simpan ia dan
  // tunjuk butang sendiri, supaya pemasangan boleh dimulakan terus dari dalam apps.
  let pasangTunda = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pasangTunda = e;
    $('btnPasang').hidden = false;
  });

  $('btnPasang').addEventListener('click', async () => {
    const e = pasangTunda;
    if (!e) return;
    pasangTunda = null;          // satu tawaran hanya boleh diguna sekali
    $('btnPasang').hidden = true;
    try { e.prompt(); await e.userChoice; } catch (err) { /* pengguna batal, tak mengapa */ }
  });

  window.addEventListener('appinstalled', () => {
    pasangTunda = null;
    $('btnPasang').hidden = true;
    toast(t('dipasang'));
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
