# MyBajet

Apps ringkas untuk jejak duit masuk, duit keluar dan bayaran bulanan. Ia laman web biasa (HTML, CSS, JavaScript) yang boleh dipasang pada telefon macam apps, dan boleh dibuka tanpa internet selepas kali pertama.

*English summary at the bottom.*

## Cara guna

- Duit masuk berwarna biru muda, duit keluar berwarna pink, dan bayaran yang dah selesai berwarna hijau.
- Tanda selesai: leret item ke kiri, atau tekan 2 kali. Buat sekali lagi untuk batalkan. Hanya duit keluar yang ditanda; duit masuk tidak.
- Padam: leret item ke kanan. Apps akan tanya dulu sebelum padam, dan ada **Buat asal** selepas itu.
- Selesaikan satu kumpulan sekali gus (contohnya semua dalam Bil): tekan lama nama kumpulan, atau tekan tanda berkembar di hujung baris nama kumpulan. Apps akan tanya dulu.
- Tekan ikon pensel untuk edit item. Butang **Tambah item** untuk item baru.
- Anak panah di atas untuk tengok bulan lain.

## Sheet bulan baru

- 2 hari sebelum gaji, sheet bulan baru muncul sendiri di muka utama. Senarainya disalin dari bulan sebelumnya dan semua tanda selesai dikosongkan.
- Nak siapkan senarai lebih awal? Di bawah senarai ada butang **Sediakan sheet (bulan depan) sekarang**. Sheet itu boleh terus diedit, tapi muka utama kekal pada bulan semasa sehingga 2 hari sebelum gaji.
- Sheet yang disediakan awal ialah salinan pada masa itu. Perubahan pada bulan semasa selepas itu tak ikut masuk. Kalau nak salin semula, buka sheet awal itu dan tekan **Padam sheet ini**, kemudian sediakan sekali lagi.
- Hanya satu bulan ke depan boleh disediakan awal.

## Tetapan

Tekan tiga titik di atas kanan:

- **Bahasa:** Melayu atau English. Nama item dan kumpulan yang ditaip sendiri tak diterjemah.
- **Paparan:** Ikut sistem, Terang atau Gelap.
- **Tarikh gaji:** senarai tarikh gaji setiap bulan dengan catatan perayaan, dan tempat isi atau betulkan tarikh.
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

## Tarikh gaji 2028 ialah anggaran

Pekeliling 2028 belum keluar, jadi tarikh 2028 dalam apps ialah **anggaran** dan dilabel begitu. Ia dikira daripada corak tarikh sebenar 2026 dan 2027 serta tarikh perayaan 2028:

1. Asasnya 25 hb. Kalau 25 hb jatuh Jumaat, Sabtu atau Ahad, gaji pada Khamis sebelumnya. Kalau 25 hb cuti umum, gaji pada hari bekerja sebelumnya.
2. Kalau perayaan utama (Tahun Baharu Cina, Hari Raya Puasa, Hari Raya Haji, Deepavali, Krismas) jatuh pada 17 hb atau lebih lewat dalam bulan itu, gaji dibayar 5 hari sebelum hari pertama perayaan.
3. Jarak dari gaji sebelumnya tak lebih 35 hari; kalau lebih, gaji bulan itu ditarik awal.

Peraturan ini padan 23 daripada 24 bulan sebenar 2026 dan 2027; yang satu lagi tersasar sehari. Tarikh Hari Raya dan Awal Muharram 2028 pula bergantung pada anak bulan, jadi Februari dan Mei boleh berubah sehari. Oktober dan November paling tak pasti, sebab Deepavali jatuh betul-betul pada 17 hb.

Bila pekeliling sebenar keluar, betulkan tarikh itu dengan salah satu cara di bawah.

## Kemas kini tarikh gaji tahun baru

Cara paling senang ialah dalam apps: tekan baris tarikh gaji di bawah nama bulan (atau tiga titik > **Lihat dan isi tarikh gaji**), pergi ke tahun baru, taip hari bulan gaji untuk setiap bulan, dan **Simpan**. Tarikh yang diisi begini disimpan dalam telefon dan ikut sekali dalam fail **Simpan salinan**. Tarikh 2026 dan 2027 pun boleh dipinda di situ kalau ada perubahan.

Cara kedua ialah dalam fail, supaya tarikh itu ada untuk semua telefon: buka `tarikh-gaji.js` di GitHub, tekan ikon pensel, dan tambah satu baris. Dua belas nombor itu ialah hari bulan gaji dari Januari hingga Disember:

```js
2028: [25, 24, 23, 25, 25, 23, 25, 25, 25, 25, 24, 20],
```

Tahun yang belum ada dalam fail itu akan guna 25 hari bulan untuk setiap bulan.

## Uji tarikh lain

Untuk tengok apa jadi pada tarikh tertentu, tambah `?hari=TTTT-BB-HH` di hujung alamat, contohnya `?hari=2026-10-20`. Ini betul-betul mencipta sheet bulan itu, jadi buat ujian dalam browser lain, bukan pada apps yang sedang diguna.

---

## English

MyBajet is a small app for tracking monthly money in, money out and routine payments. It is a plain web page that installs on a phone like an app and works offline after the first visit.

- Money in is light blue, money out is pink, and paid items are green. Only money out can be marked paid.
- Swipe an item left, or double tap it, to mark it paid; do it again to unmark. Swipe right to delete (the app asks first).
- Press and hold a group name, or tap the double tick beside it, to mark the whole group paid.
- The pencil icon edits an item. **Add item** adds a new one.
- Two days before payday, the new month's sheet appears on the main page by itself, copied from the previous month with every paid mark cleared.
- To get the list ready sooner, use **Prepare the (next month) sheet now** below the list. The main page stays on the current month until two days before payday.
- Tap the three dots for settings: language (Melayu or English), appearance (System, Light or Dark), payday dates, and saving or importing a copy of your data.
- All data stays on the phone. Nothing is sent to GitHub or any server, so save a copy now and then.
- Payday dates for 2026 and 2027 are built in. The 2028 dates are an estimate, labelled as such, until the official circular is out. Enter or correct a year's dates in the app (tap the payday line under the month name), or edit `tarikh-gaji.js`.
