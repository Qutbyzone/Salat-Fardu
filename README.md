# Media Pembelajaran Interaktif (MPI): Mengenal Salat Fardu

Aplikasi web Media Pembelajaran Interaktif (MPI) untuk murid SD Kelas 1 dan 2 (Fase A) pada materi **Pendidikan Agama Islam: Mengenal Salat Fardu**.

## 📁 Struktur Direktori Proyek

```text
SALAT FARDU/
├── index.html                      # Halaman utama aplikasi (Lanskap Rasio 16:9)
├── README.md                       # Dokumentasi lengkap panduan & kurasi
├── css/
│   └── style.css                   # Desain UI 3D Cartoon (Clay Style), Rasio 16:9, & Animasi
├── js/
│   ├── app.js                      # Navigasi, Form Murid, Autoplay VO, & Modal Info Kreator
│   ├── tts.js                      # Text-to-Speech Suara Anak Indonesia & Synthesizer SFX
│   └── games.js                    # Eksplorasi 5 Salat, Pasangkan Rakaat, Susun Gerakan Salat (Drag & Drop), & Kuis
└── assets/
    ├── images/                     # Aset visual foto/ilustrasi 3D
    │   ├── cover-masjid.jpg        # Foto/Gambar Sampul Masjid 16:9 Layar Penuh
    │   ├── avatar-ahmad.jpg        # Karakter 3D Ahmad
    │   ├── avatar-fatimah.jpg      # Karakter 3D Fatimah
    │   ├── avatar-ali.jpg          # Karakter 3D Ali
    │   ├── avatar-aisyah.jpg       # Karakter 3D Aisyah
    │   ├── visual-salat-subuh.jpg  # Visual Waktu Subuh
    │   ├── visual-salat-zuhur.jpg  # Visual Waktu Zuhur
    │   ├── visual-salat-asar.jpg   # Visual Waktu Asar
    │   ├── visual-salat-magrib.jpg # Visual Waktu Magrib
    │   ├── visual-salat-isya.jpg   # Visual Waktu Isya
    │   ├── gerakan-berdiri-tegak.jpg # Gerakan 1: Berdiri Tegak
    │   ├── gerakan-takbir.jpg      # Gerakan 2: Takbiratul Ihram
    │   ├── gerakan-bersedekap.jpg  # Gerakan 3: Bersedekap
    │   ├── gerakan-rukuk.jpg       # Gerakan 4: Rukuk
    │   ├── gerakan-itidal.jpg      # Gerakan 5: Iktidal
    │   ├── gerakan-sujud.jpg       # Gerakan 6: Sujud
    │   ├── gerakan-tahiyat.jpg     # Gerakan 7: Duduk Tahiyat
    │   └── gerakan-salam.jpg       # Gerakan 8: Salam
    └── audio/                      # Aset audio & panduan
        └── PETUNJUK_AUDIO.txt
```

## ✨ Fitur-Fitur Utama Terbaru

1. **Rasio Presisi 16:9:**
   - Terkunci rapi menggunakan kalkulasi `min(100vw, calc(100vh * (16 / 9)))` dengan latar belakang gradien halus dan tata letak yang pas di layar komputer, laptop, maupun tablet.
2. **Voice Over Anak-Anak Berbahasa Indonesia Fasih & Jelas:**
   - Menggunakan sintesis suara cilik berbahasa Indonesia yang jernih (*pitch* ceria anak-anak), pelafalan tervalidasi KBBI/bahasa Indonesia alami, dan tempo yang ramah anak.
   - Dilengkapi fitur *Autoplay Voice Over* saat cover pertama kali dibuka.
3. **Tombol Informasi Kreator `(i)` di Pojok Kanan Atas:**
   - Menyajikan informasi pengembang: **Andriansyah, S.Pd.I**.
   - Dilengkapi **Tujuan Pembelajaran** (Capaian Pembelajaran Fase A PAI) dan atribusi lisensi aset.
4. **Menu Jelajah Gerakan & Kenali Bacaan:**
   - Jelajah 10 posisi/gerakan salat dengan gambar, deskripsi, dan voice over.
   - Kenali 9 bacaan salat dengan teks Arab, latin, terjemahan, dan voice over.
5. **Menu 'Susun Gerakan Salat' (Tantangan Drag & Drop 10 Gerakan):**
   - Menampilkan 10 posisi/gerakan salat lengkap, termasuk `gerakan-bersedekap.jpg`.
   - Mendukung fitur tarik-dan-lepas (*drag & drop*), *touchscreen drag*, serta *tap-to-place* (ketuk kartu lalu ketuk kotak nomor).
6. **Musik Latar Ceria:**
   - Musik instrumental orisinal anak-anak disertakan sebagai `assets/audio/musik-latar-anak.wav` dan diputar berulang.
   - Browser dapat membatasi autoplay; aplikasi mencoba memulai audio otomatis dan membuka audio penuh pada interaksi pertama (klik/ketukan), tanpa tombol audio pada cover.
7. **Kuis Bintang & Sertifikat Juara Cilik:**
   - Skor otomatis dicatat atas nama murid yang diinput di awal.

## 🚀 Cara Menjalankan

Klik dua kali berkas `index.html` pada peramban Google Chrome atau Microsoft Edge.


Dibuat oleh: ANDRIANSYAH, S.Pd.I
