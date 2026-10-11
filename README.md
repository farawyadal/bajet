# Bajet Bulanan

Apps ringkas untuk jejak duit masuk, duit keluar dan bayaran bulanan. Ia laman web biasa (HTML, CSS, JavaScript) yang boleh dipasang pada telefon macam apps, dan boleh dibuka tanpa internet selepas kali pertama.

- Duit masuk berwarna hijau muda, duit keluar berwarna pink.
- Tekan 2 kali pada item untuk tandakan dah bayar (jadi kuning). Tekan 2 kali lagi untuk buang tanda.
- Tekan ikon pensel untuk edit atau padam item. Butang **Tambah item** untuk item baru.
- 2 hari sebelum gaji, sheet bulan baru muncul sendiri di muka utama. Senarainya disalin dari bulan lepas dan semua tanda dah bayar dikosongkan.
- Anak panah di atas untuk tengok bulan-bulan lepas.

## Fail dalam folder ini

| Fail | Guna |
|---|---|
| `index.html` | Muka apps |
| `style.css` | Warna dan susun atur |
| `app.js` | Semua logik apps |
| `tarikh-gaji.js` | Tarikh gaji 2026 dan 2027. Fail ini yang dikemas kini setiap tahun |
| `manifest.webmanifest`, `sw.js` | Supaya boleh dipasang pada telefon dan dibuka tanpa internet |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Ikon apps |

## Letak di GitHub

1. Di GitHub, tekan **New repository**. Beri nama, contohnya `bajet`. Pilih **Public**, kemudian **Create repository**.
2. Tekan pautan **uploading an existing file**. Seret semua fail dalam folder ini (bukan folder itu sendiri) ke situ, kemudian **Commit changes**.
3. Pergi ke **Settings > Pages**. Di bawah **Branch**, pilih `main` dan `/ (root)`, kemudian **Save**.
4. Tunggu seminit dua. Alamat apps ialah `https://NAMA-AKAUN.github.io/bajet/`.

## Pasang pada telefon

- **Android (Chrome):** buka alamat apps, tekan menu tiga titik, pilih **Add to Home screen** atau **Install app**.
- **iPhone (Safari):** buka alamat apps, tekan butang Share, pilih **Add to Home Screen**.

## Masukkan senarai

Kali pertama buka, tekan **Import senarai** dan pilih fail `senarai-awal.json`. Fail itu diberi berasingan dan **jangan** di-upload ke GitHub, sebab repo ini public dan fail itu ada jumlah gaji, nombor telefon dan nombor akaun bil.

## Data disimpan di mana

Semua data disimpan dalam telefon itu sahaja, bukan di GitHub dan bukan di mana-mana server. Maksudnya:

- Telefon lain atau browser lain tak nampak data yang sama.
- Kalau data browser dipadam atau tukar telefon, data hilang.

Sebab itu, sekali-sekala tekan menu tiga titik > **Simpan salinan**. Untuk pulihkan, menu > **Import fail** dan pilih fail salinan tadi.

## Kemas kini tarikh gaji tahun baru

Bila pekeliling tarikh gaji tahun depan keluar, buka `tarikh-gaji.js` di GitHub, tekan ikon pensel, dan tambah satu baris. Dua belas nombor itu ialah hari bulan gaji dari Januari hingga Disember:

```js
2028: [25, 24, 23, 25, 25, 23, 25, 25, 25, 25, 24, 20],
```

Tahun yang belum ada dalam fail itu akan guna 25 hari bulan untuk setiap bulan.

## Uji tarikh lain

Untuk tengok apa jadi pada tarikh tertentu, tambah `?hari=TTTT-BB-HH` di hujung alamat, contohnya `?hari=2026-10-20`. Ini betul-betul mencipta sheet bulan itu, jadi buat ujian dalam browser lain, bukan pada apps yang sedang diguna.
