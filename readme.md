# ⚜️ Pawiwahan Ageng - Undangan Digital Pernikahan Tradisional Jawa

Undangan digital pernikahan berbasis website dengan tema **Jawa Keraton yang Romantis, Elegan, dan Megah**, bernuansa warna gelap (*dark luxury*) dengan aksen emas kerajaan (*royal gold*).

### 🤵 Mempelai:
- **Pengantin Pria:** A. Fahmi Aziz, S.Kom.
- **Pengantin Wanita:** Rofiatul Hasanah, S.Pd.

---

## ✨ Fitur Unggulan

1. **Tema Jawa Megah & Romantis (*Dark Royal Keraton*)**:
   - Ornamen vektor Gunungan Wayang, sudut ukiran khas Jawa, dan divider emas.
   - Pola latar belakang halus Batik Kawung gelap.
   - Efek partikel melayang: serbuk emas (*golden stardust*) & kelopak bunga melati putih (*jasmine petals*) secara dinamis pada canvas 60fps.
   - Tipografi anggun perpaduan serif kerajaan (*Cinzel Decorative*, *Cormorant Garamond*, *Great Vibes*).

2. **Nama Penerima Undangan Dinamis & Dapat Diedit**:
   - **Melalui URL Parameter**:
     - Tambahkan parameter `?to=Nama+Tamu` dan `?di=Tempat` pada link:
       `index.html?to=Bpk.+Bambang+Sutrisno+dan+Keluarga&di=Yogyakarta`
   - **Melalui Fitur Modal Editor Langsung di Website**:
     - Klik tombol **"✎ Ganti Nama / Buat Link"** pada sampul atau tombol **"Edit Nama Tamu"** di pojok kanan atas.
     - Tersedia chip bantuan cepat (`+ Bpk.`, `+ Ibu`, `+ Mas`, `+ Mbak`, `+ & Keluarga`).
     - Terdapat tombol **"Terapkan Langsung"** (mengubah nama seketika tanpa refresh halaman).
     - Tombol **"Salin Link"**, **"Salin Teks WA"** (pesan berbahasa santun dan rapi), serta **"Bagikan Langsung ke WhatsApp"**.

3. **Musik Tradisional Gamelan Jawa & Suling (Offline & Online Resilient)**:
   - Dilengkapi audio instrumen Gamelan Pelog/Slendro lembut dengan suara Gong Ageng, Bonang, dan seruling bambu.
   - Disertai Web Audio API synthesizer fallback agar alunan musik tetap berbunyi merdu meski dijalankan secara lokal tanpa koneksi internet.
   - Tombol pengontrol musik terapung di pojok kiri bawah.

4. **Struktur Konten Lengkap**:
   - **Sampul Undangan Interaktif**: Gerbang amplop kerajaan dengan tombol *Buka Undangan*.
   - **Ayat Suci & Filosofi Jawa**: QS. Ar-Rum: 21 dan filosofi luhur *Tresna Sejati*.
   - **Profil Kedua Mempelai**: Foto prewedding berbingkai filigri emas, informasi orang tua, dan tautan Instagram.
   - **Hitung Mundur (*Countdown Timer*)**: Real-time timer menuju hari H pernikahan dilengkapi tombol *Simpan ke Google Calendar*.
   - **Detail Acara & Peta Lokasi**: Jadwal Akad Nikah & Resepsi Ageng, terintegrasi dengan Google Maps.
   - **Kisah Cinta (*Love Journey*)**: Linimasa romantis perjalanan cinta kedua mempelai.
   - **Galeri Foto & Lightbox**: Grid foto prewedding berbusana adat Jawa yang dapat dibuka fullscreen.
   - **Amplop Digital / Hadiah Pernikahan**: No. rekening BCA, BSI/Mandiri dengan tombol *Salin Rekening* instan, serta alamat pengiriman kado fisik.
   - **RSVP & Buku Tamu Interaktif**: Form konfirmasi kehadiran dan ucapan doa yang tersimpan di `localStorage` dan langsung tampil secara real-time.
   - **Bilah Navigasi Bawah (*Bottom Navigation Bar*)**: Navigasi cepat mobile-friendly dengan indikator aktif sesuai posisi scroll.

---

## 🚀 Cara Menjalankan

### Cara 1: Langsung Buka di Browser
Cukup klik ganda file `index.html` pada File Explorer untuk membukanya di Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari.

### Cara 2: Menggunakan Local Web Server (Python)
Buka terminal / PowerShell di direktori ini, lalu jalankan:
```bash
python -m http.server 8000
```
Buka peramban di: `http://localhost:8000/` atau coba variasi nama tamu:
```
http://localhost:8000/?to=Bapak+Hendra+Kusuma+dan+Keluarga&di=Semarang
```
