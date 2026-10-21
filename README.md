# MyBajet

Apps ringkas untuk jejak duit masuk, duit keluar dan bayaran bulanan. Ia laman web biasa (HTML, CSS, JavaScript) yang boleh dipasang pada telefon macam apps, dan boleh dibuka tanpa internet selepas kali pertama.

*English summary at the bottom.*

## Cara guna

- Duit masuk berwarna biru muda, duit keluar berwarna pink, dan bayaran yang dah selesai berwarna hijau.
- Tanda selesai: leret item ke kiri, atau tekan 2 kali. Buat sekali lagi untuk batalkan. Hanya duit keluar yang ditanda; duit masuk tidak.
- Padam: leret item ke kanan. Apps akan tanya dulu sebelum padam, dan ada **Buat asal** selepas itu.
- Selesaikan satu kumpulan sekali gus (contohnya semua dalam Bil): tekan lama nama kumpulan, atau tekan tanda berkembar di hujung baris nama kumpulan. Apps akan tanya dulu.
- Tekan ikon pensel untuk edit item. Butang **Tambah item** untuk item baru.
- **Gaji:** baris Gaji tunjuk gaji bersih. Tekan untuk lihat dan ubah butiran pendapatan (gaji pokok, imbuhan) dan senarai potongan. Gaji bersih dikira sendiri: jumlah pendapatan tolak potongan gaji.
- **Potongan gaji:** potongan terus dari gaji (PCB, pinjaman perumahan, koperasi dan lain-lain), warna hijau gelap. Tak dikira dalam "Belum selesai". Tambah potongan baru dengan Tambah item > jenis Potongan gaji.
- **Kenaikan April:** bila sheet April dicipta, Gaji pokok naik RM250 sendiri.
- **Kategori:** tiga titik > **Urus kategori** untuk tambah, tukar nama, susun dan padam kategori duit keluar.
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
| `tarikh-gaji.js` | Tarikh gaji 2026 dan 2027, anggaran 2028, dan tarikh perayaan. Fail ini yang dikemas kini setiap tahun |
| `config.js` | Client ID Google untuk selaras Google Drive |
| `manifest.webmanifest`, `sw.js` | Supaya boleh dipasang pada telefon dan dibuka tanpa internet |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ikon apps |

## Letak di GitHub

1. Di GitHub, tekan **New repository**. Beri nama, contohnya `bajet`. Pilih **Public**, kemudian **Create repository**.
2. Tekan pautan **uploading an existing file**. Seret semua fail dalam folder ini (bukan folder itu sendiri) ke situ, kemudian **Commit changes**.
3. Pergi ke **Settings > Pages**. Di bawah **Branch**, pilih `main` dan `/ (root)`, kemudian **Save**.
4. Tunggu seminit dua. Alamat apps ialah `https://NAMA-AKAUN.github.io/bajet/`.

Untuk kemas kini apps kemudian, upload fail baru dengan nama yang sama ke repo itu (**Add file > Upload files**). Telefon akan ambil versi baru pada bukaan seterusnya; kadang-kadang perlu tutup dan buka apps dua kali. Data dalam telefon tak terusik.

## Pasang pada telefon

- **Android (Chrome):** buka alamat apps dan tekan butang anak panah ke bawah di sebelah tiga titik dalam apps. Butang itu muncul bila Chrome sedia memasang, dan hilang selepas apps dipasang. Kalau ia tak muncul, guna menu tiga titik Chrome > **Add to Home screen** atau **Install app**.
- **iPhone (Safari):** buka alamat apps, tekan butang Share, pilih **Add to Home Screen**.

## Masukkan senarai

Kali pertama buka, tekan **Import senarai** dan pilih fail `senarai-awal.json`. Fail itu diberi berasingan dan **jangan** di-upload ke GitHub, sebab repo ini public dan fail itu ada jumlah gaji, nombor telefon dan nombor akaun bil.

## Data disimpan di mana

Data disimpan dalam browser peranti itu. Tak ada apa disimpan di GitHub.

## Guna di phone dan PC: selaras Google Drive

1. Di phone: tiga titik > **Sambung Google Drive** > log masuk akaun Google.
2. Di PC: buka alamat apps, tekan **Ambil data dari Google Drive** (atau tiga titik > **Sambung Google Drive**), log masuk akaun Google yang sama.

Selepas itu:

- Data disimpan dalam folder tersembunyi khas apps ini dalam Google Drive kau. Apps hanya minta kebenaran untuk folder itu; ia tak boleh nampak fail lain dalam Drive.
- Apps selaras sendiri bila dibuka, bila kembali ke apps, dan 2 saat selepas setiap perubahan.
- Ikon awan kecil di sebelah tarikh gaji menunjukkan status. Kalau tertulis **Ketik untuk selaras**, ketik ia; Google akan minta log masuk semula (biasanya selepas sejam apps tak dibuka).
- Kalau bulan yang sama diubah di dua peranti sebelum sempat selaras, perubahan yang terakhir disimpan menang.
- Kali pertama sambung, kalau peranti itu dan Drive ada data berbeza, apps tanya yang mana nak diguna.
- Login Google ini guna Client ID yang sama dengan Read My Mail (`config.js`).

Tanpa selaras, data hanya dalam peranti itu: kalau data browser dipadam atau tukar telefon, data hilang. Sebab itu, sekali-sekala tekan tiga titik > **Simpan salinan**. Untuk pulihkan, tiga titik > **Import fail** dan pilih fail salinan tadi.

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
- Data lives in the browser on each device. To use the same data on your phone and PC, tap the three dots > **Connect Google Drive** on each device with the same Google account. Data is kept in a hidden app folder in your own Drive; the app syncs on open, on return, and two seconds after each change, and the latest change wins.
- Without sync, save a copy now and then.
- Payday dates for 2026 and 2027 are built in. The 2028 dates are an estimate, labelled as such, until the official circular is out. Enter or correct a year's dates in the app (tap the payday line under the month name), or edit `tarikh-gaji.js`.
