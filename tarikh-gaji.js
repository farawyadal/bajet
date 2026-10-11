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

// Tahun yang belum ada dalam senarai di atas guna hari bulan ini.
window.GAJI_LALAI = 25;

// Berapa hari sebelum gaji sheet baru muncul.
window.HARI_AWAL = 2;
