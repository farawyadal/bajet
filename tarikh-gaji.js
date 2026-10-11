/*
  Tarikh gaji (pembayaran emolumen bulanan).
  Setiap tahun ada 12 nombor: hari bulan gaji untuk Januari hingga Disember.

  Bila pekeliling tahun baru keluar, tambah satu baris di bawah. Contoh:
    2028: [25, 24, 23, 25, 25, 23, 25, 25, 25, 25, 24, 20],

  Sheet bulan baru muncul 2 hari sebelum tarikh gaji.
*/
window.TARIKH_GAJI = {
  //     Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis
  2026: [22, 12, 16, 20, 21, 25, 23, 24, 24, 22, 25, 21], // SPANM Bil. 5/2025
  2027: [25, 25, 25, 22, 12, 17, 21, 25, 23, 21, 25, 20], // SPANM Bil. 5/2026
};

/*
  ANGGARAN untuk tahun yang belum ada pekeliling. Bukan tarikh rasmi.
  Apps tunjuk label "anggaran" untuk tahun ini. Bila pekeliling keluar,
  pindahkan baris tahun itu ke TARIKH_GAJI di atas dengan tarikh sebenar.

  Cara anggaran dikira (padan 23 daripada 24 bulan sebenar 2026 dan 2027):
  1. Asasnya 25 hb. Kalau 25 hb jatuh Jumaat, Sabtu atau Ahad, gaji pada Khamis sebelumnya.
     Kalau 25 hb cuti umum, gaji pada hari bekerja sebelumnya.
  2. Kalau perayaan utama jatuh pada 17 hb atau lebih lewat dalam bulan itu, gaji 5 hari
     sebelum hari pertama perayaan (jatuh Jumaat/Sabtu: undur ke Khamis; jatuh Ahad: Isnin).
  3. Jarak dari gaji sebelumnya tak lebih 35 hari; kalau lebih, gaji ditarik awal.
*/
window.TARIKH_GAJI_ANGGARAN = {
  //     Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis
  2028: [20, 22, 23, 25, 24, 22, 25, 24, 25, 12, 16, 20],
};

/*
  Hari pertama perayaan, untuk catatan dalam senarai tarikh gaji: [bulan, hari, kod].
  2026 dan 2027 ikut catatan pekeliling. 2028 ikut kalendar awal; tarikh Hari Raya
  dan Awal Muharram bergantung pada anak bulan dan boleh berubah sehari.
*/
window.PERAYAAN = {
  2026: [[2, 17, 'tbc'], [3, 21, 'puasa'], [5, 27, 'haji'], [11, 8, 'deepavali'], [12, 25, 'krismas']],
  2027: [[2, 6, 'tbc'], [3, 10, 'puasa'], [5, 17, 'haji'], [10, 28, 'deepavali'], [12, 25, 'krismas']],
  2028: [[1, 26, 'tbc'], [2, 27, 'puasa'], [5, 5, 'haji'], [5, 25, 'muharram'], [10, 17, 'deepavali'], [12, 25, 'krismas']],
};

// Tahun yang belum ada dalam mana-mana senarai di atas guna hari bulan ini.
window.GAJI_LALAI = 25;

// Berapa hari sebelum gaji sheet baru muncul.
window.HARI_AWAL = 2;
