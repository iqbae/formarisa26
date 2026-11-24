# 🎂 Website Ucapan Ulang Tahun

Website satu halaman dengan nuansa malam berbintang, emas, dan rose.
Alurnya: tiup lilin → ucapan bertahap saat scroll → kejutan surat di balik segel.

## Struktur file

```
birthday/
├── index.html
├── .htaccess
├── assets/
│   ├── css/style.css
│   ├── img/
│   │   ├── share.jpg      ← gambar preview link (1200×630)
│   │   └── share-card.html ← sumber desain kartu share
│   ├── js/
│   │   ├── config.js      ← semua teks & nama di sini
│   │   └── app.js
│   └── audio/
│       └── music.mp3      ← tambahkan sendiri (opsional)
└── README.md
```

## 1. Ganti nama & teks

Buka **`assets/js/config.js`**. Hampir semua yang perlu diubah ada di sana:

- `to` → nama pacar
- `from` → nama kamu
- `ogTitle` / `ogDescription` → teks yang muncul saat link dibagikan (WhatsApp dll)
- `dateISO` / `dateLabel` → tanggal ulang tahun
- `heroSub`, `story`, `quote`, `gift` → semua kalimat
- `introHint` → teks di bawah kue

Simpan, lalu refresh browser. Tidak perlu build tools apa pun.

## 2. Tambahkan musik (opsional)

Taruh file MP3 di:

```
assets/audio/music.mp3
```

Judul lagu bebas. Gunakan lagu yang memang boleh dipakai (misalnya instrumental bebas royalti),
karena situs akan diakses publik lewat internet.

Kalau file belum ada, tombol musik otomatis nonaktif dan halaman tetap jalan normal.

## 3. Lihat hasilnya di lokal

Cara paling mudah, jalankan server kecil dari folder `birthday`:

```bash
cd birthday
python3 -m http.server 8000
```

Lalu buka <http://localhost:8000>.

> Catatan: fitur **tiup pakai mikrofon** hanya berjalan di `https` atau `localhost`.
> Kalau dibuka lewat `file://` langsung, mikrofofon tidak tersedia — tombol "Tiup lilinnya" tetap bisa dipakai.
> Sesudah di-deploy ke cPanel (https), fitur mikrofon akan aktif normal.

## 4. Deploy ke cPanel

### Opsi A — File Manager (paling mudah)

1. Login cPanel → **File Manager**.
2. Masuk ke `public_html` (kalau untuk domain utama) atau folder subdomain.
3. Upload semua isi folder `birthday` (bukan foldernya, tapi isinya):
   `index.html`, `.htaccess`, dan folder `assets`.
   Paling cepat: upload `birthday.zip`, lalu klik kanan → **Extract**.
4. Pastikan struktur akhirnya seperti ini:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   └── assets/
   ```
5. Buka domain kamu. Selesai.

### Opsi B — Upload ZIP

```bash
cd birthday
zip -r ../birthday.zip . -x "*.DS_Store"
```

Upload `birthday.zip` ke `public_html`, extract di sana, lalu hapus file zip-nya.

### Permission

- Folder: `755`
- File: `644`

Biasanya sudah otomatis benar saat upload lewat File Manager.

### Kalau ditaruh di subfolder

Misalnya `public_html/ultah/`, buka `https://domainmu.com/ultah/`.
Semua path di proyek ini relatif (`assets/...`), jadi tidak perlu diubah.

### Setelah deploy

- Buka di HP, cek: intro → tiup lilin → scroll → tombol hadiah.
- Kalau musik tidak muncul, pastikan nama file tepat `music.mp3` (huruf kecil semua).
- Gambar preview link sudah tersedia di `assets/img/share.jpg` (1200×630 px) dan
  meta `og:image` / `twitter:image` sudah dipasang di `index.html`.
- Kalau preview WhatsApp masih polos setelah deploy, ganti path di kedua meta itu
  menjadi URL penuh, misalnya `https://domainmu.com/assets/img/share.jpg`.
- Mau ubah desain kartunya? Edit `assets/img/share-card.html`, lalu render ulang:
  ```bash
  cd birthday/assets/img
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,630 --virtual-time-budget=6000 \
    --screenshot=share.png "file://$PWD/share-card.html"
  sips -s format jpeg -s formatOptions 88 share.png --out share.jpg
  rm share.png
  ```

## Tips kecil

- Nama domain + link bisa kamu kirim tepat tengah malam. 🎉
- Isi `age` di config kalau mau menampilkan "yang ke-24".
- Ubah `musicVolume` kalau musiknya terlalu keras (0.0 – 1.0).
- Semua animasi otomatis meredup kalau perangkat pengguna mengaktifkan
  "reduce motion", jadi tetap nyaman dibaca.