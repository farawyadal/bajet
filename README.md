# Bajet Bulanan

Apps ringkas untuk jejak duit masuk, duit keluar dan bayaran bulanan. Ia laman web biasa (HTML, CSS, JavaScript) yang boleh dipasang pada telefon macam apps, dan boleh dibuka tanpa internet selepas kali pertama.

*English summary at the bottom.*

## Cara guna

- Duit masuk berwarna hijau, duit keluar berwarna pink.
- Tekan 2 kali pada item untuk tandakan dah bayar (jadi kuning). Tekan 2 kali lagi untuk buang tanda.
- Tekan ikon pensel untuk edit atau padam item. Butang **Tambah item** untuk item baru.
- Anak panah di atas untuk tengok bulan lain.

## Sheet bulan baru

- 2 hari sebelum gaji, sheet bulan baru muncul sendiri di muka utama. Senarainya disalin dari bulan sebelumnya dan semua tanda dah bayar dikosongkan.
- Nak siapkan senarai lebih awal? Di bawah senarai ada butang **Sediakan sheet (bulan depan) sekarang**. Sheet itu boleh terus diedit, tapi muka utama kekal pada bulan semasa sehingga 2 hari sebelum gaji.
- Sheet yang disediakan awal ialah salinan pada masa itu. Perubahan pada bulan semasa selepas itu tak ikut masuk. Kalau nak salin semula, buka sheet awal itu dan tekan **Padam sheet ini**, kemudian sediakan sekali lagi.
- Hanya satu bulan ke depan boleh disediakan awal.

## Tetapan

Tekan tiga titik di atas kanan:

- **Bahasa:** Melayu atau English. Nama item dan kumpulan yang ditaip sendiri tak diterjemah.
- **Paparan:** Ikut sistem, Terang atau Gelap.
- **Data:** Simpan salinan dan Import fail.

## Fail dalam folder ini

| Fail | Guna |
|---|---|
| `index.html` | Muka apps |
| `style.css` | Warna (terang dan gelap) dan susun atur |
| `app.js` | Semua logik apps dan teks dua bahasa |
| `tarikh-gaji.js` | Tarikh gaji 2026 dan 2027. Fail ini yang dikemas kini setiap tahun |
| `manifest.webmanifest`, `sw.js` | Supaya boleh dipasang pada telefon dan dibuka tanpa internet |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ikon apps |

## Letak di GitHub

1. Di GitHub, tekan **New repository**. Beri nama, contohnya `bajet`. Pilih **Public**, kemudian **Create repository**.
2. Tekan pautan **uploading an existing file**. Seret semua fail dalam folder ini (bukan folder itu sendiri) ke situ, kemudian **Commit changes**.
3. Pergi ke **Settings > Pages**. Di bawah **Branch**, pilih `main` dan `/ (root)`, kemudian **Save**.
4. Tunggu seminit dua. Alamat apps ialah `https://NAMA-AKAUN.github.io/bajet/`.

Untuk kemas kini apps kemudian, upload fail baru dengan nama yang sama ke repo itu (**Add file > Upload files**). Telefon akan ambil versi baru pada bukaan seterusnya; kadang-kadang perlu tutup dan buka apps dua kali. Data dalam telefon tak terusik.

## Pasang pada telefon

- **Android (Chrome):** buka alamat apps, tekan menu tiga titik, pilih **Add to Home screen** atau **Install app**.
- **iPhone (Safari):** buka alamat apps, tekan butang Share, pilih **Add to Home Screen**.

## Masukkan senarai

Kali pertama buka, tekan **Import senarai** dan pilih fail `senarai-awal.json`. Fail itu diberi berasingan dan **jangan** di-upload ke GitHub, sebab repo ini public dan fail itu ada jumlah gaji, nombor telefon dan nombor akaun bil.

## Data disimpan di mana

Semua data disimpan dalam telefon itu sahaja, bukan di GitHub dan bukan di mana-mana server. Maksudnya:

- Telefon lain atau browser lain tak nampak data yang sama.
- Kalau data browser dipadam atau tukar telefon, data hilang.

Sebab itu, sekali-sekala tekan tiga titik > **Simpan salinan**. Untuk pulihkan, tiga titik > **Import fail** dan pilih fail salinan tadi.

## Kemas kini tarikh gaji tahun baru

Bila pekeliling tarikh gaji tahun depan keluar, buka `tarikh-gaji.js` di GitHub, tekan ikon pensel, dan tambah satu baris. Dua belas nombor itu ialah hari bulan gaji dari Januari hingga Disember:

```js
2028: [25, 24, 23, 25, 25, 23, 25, 25, 25, 25, 24, 20],
```

Tahun yang belum ada dalam fail itu akan guna 25 hari bulan untuk setiap bulan.

## Uji tarikh lain

Untuk tengok apa jadi pada tarikh tertentu, tambah `?hari=TTTT-BB-HH` di hujung alamat, contohnya `?hari=2026-10-20`. Ini betul-betul mencipta sheet bulan itu, jadi buat ujian dalam browser lain, bukan pada apps yang sedang diguna.

---

## English

A small app for tracking monthly money in, money out and routine payments. It is a plain web page that installs on a phone like an app and works offline after the first visit.

- Money in is green, money out is pink. Double tap an item to mark it paid (it turns yellow); double tap again to unmark.
- The pencil icon edits or deletes an item. **Add item** adds a new one.
- Two days before payday, the new month's sheet appears on the main page by itself, copied from the previous month with every paid mark cleared.
- To get the list ready sooner, use **Prepare the (next month) sheet now** below the list. The main page stays on the current month until two days before payday.
- Tap the three dots for settings: language (Melayu or English), appearance (System, Light or Dark), and saving or importing a copy of your data.
- All data stays on the phone. Nothing is sent to GitHub or any server, so save a copy now and then.
- Payday dates live in `tarikh-gaji.js`; add one line per year.
