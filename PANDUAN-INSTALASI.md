# Panduan Instalasi — Website Ma'had Sabilul Muttaqin

Backend (Google Apps Script) dipasang dulu, lalu frontend di GitHub Pages.

## A. Backend (file Kode.gs, terpisah dari ZIP)
1. Buka https://script.google.com → **Proyek baru**. Ganti nama `Code.gs` menjadi `Kode`, lalu tempel seluruh isi `Kode.gs`.
2. Pilih fungsi `setupAppEnvironment` → **Run** (HANYA SEKALI). Izinkan akses Drive, Sheets, dan Email. Cek folder "Website Ma'had Sabilul Muttaqin" di Drive.
3. Buka spreadsheet-nya, sheet **Pengaturan**: isi `WA_ADMIN`, `EMAIL_ADMIN`, `PORTAL_URL`, dan media sosial.
4. **Deploy → New deployment → Web app**: Execute as **Me**, access **Anyone**. Salin URL yang berakhiran `/exec`.
5. (Opsional, WA otomatis) Daftar di fonnte.com, salin token, ganti `ISI_TOKEN_FONNTE_DI_SINI` di fungsi `simpanTokenFonnte`, jalankan sekali, lalu hapus tokennya dari kode.
6. Setiap mengubah Kode.gs: Deploy → Manage deployments → Edit → versi baru.

## B. Frontend (GitHub Pages)
1. Ekstrak `sabilul-muttaqin-web.zip`. Buka `js/config.js`, ganti `GAS_URL` dengan URL `/exec` tadi.
2. **Folder yang di-`git init` adalah folder hasil ekstraksi itu sendiri** (yang langsung berisi `index.html`). Cek dengan `dir` (Windows) atau `ls`: `index.html` harus terlihat.
3. Buat repository **Public** di github.com (jangan centang README), lalu di terminal:
```
git init
git add .
git commit -m "Upload pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```
4. Repo → **Settings → Pages** → Branch `main`, folder `/ (root)` → Save. Tunggu 1–2 menit.
5. Bila muncul "Password authentication is not supported", buat **Personal Access Token** (scope `repo`) dan pakai sebagai password.

## C. Mengelola konten (tanpa koding)
- **Berita**: tambah baris di sheet `Berita` (kolom `tampil` = TIDAK untuk menyembunyikan).
- **Galeri**: tambah baris di sheet `Galeri`, isi `url` dengan tautan gambar langsung.
- **Kontak/media sosial**: ubah di sheet `Pengaturan`. Perubahan tampil dalam ±10 menit.
- **Pendaftar**: masuk ke sheet `Pendaftar`.

## D. Tes
Buka situs → data berita tampil → isi formulir → cek sheet `Pendaftar` dan email admin.

## E. Panel Admin (admin.html)
- Buka `https://USERNAME.github.io/NAMA-REPO/admin.html`. Untuk instalasi baru, login pertama (username `admin`) dan passwordnya muncul di Execution Log setelah `setupAppEnvironment`.
- **Sudah terlanjur menjalankan setup versi lama?** Jangan jalankan setup lagi. Tambahkan manual di spreadsheet: sheet baru `Admin` (kolom `username`, `hash`, `role`), lalu di editor Apps Script jalankan `buatAdmin('admin','PASSWORD-ANDA','admin')` lewat fungsi pembungkus. Tambahkan juga baris `SEJARAH`, `VISI`, `MISI`, `INFO_BIAYA` di sheet `Pengaturan`.
- Peran: **admin** (pendaftar + berita), **editor** (berita saja). Tambah akun dengan `buatAdmin('nama','sandi','editor')`.
- Setelah mengganti Kode.gs: Deploy → Manage deployments → Edit → **New version**.

## F. Tambahan tampilan (update)
Tambahkan baris di sheet `Pengaturan`: `PENGUMUMAN`, `SAMBUTAN`, `PIMPINAN`, `FOTO_KAMPUS`, `BIAYA_TERBUKA` (YA/TIDAK). Buat sheet `Biaya` dengan kolom `komponen, jenjang (SD/SMP/Semua), periode (Sekali/Bulanan), nominal, tampil`. Tanpa sheet ini bagian biaya otomatis menampilkan "hubungi panitia". Lalu deploy versi baru Kode.gs.

## G. Panel admin: Galeri, Biaya, Pengaturan
Tab baru di admin.html. **Galeri** dan **Biaya** bisa ditambah/diubah/dihapus; **Pengaturan** (kontak, sambutan, link portal, dll) diubah langsung per baris. Editor hanya melihat Berita dan Galeri. Foto galeri berupa **link gambar** (unggah file belum tersedia). Setelah mengganti Kode.gs: Deploy → Manage deployments → Edit → New version.

## H. Tidak bisa login admin?
1. Pastikan Kode.gs terbaru sudah di-deploy (**Manage deployments → Edit → New version**).
2. Di editor Apps Script, ubah sandi di fungsi `aturAkunAdmin`, pilih fungsi itu, klik **Run**. Ini otomatis membuat sheet `Admin` bila belum ada, dan mereset sandi bila username `admin` sudah ada. Setelah berhasil, kembalikan sandinya ke tulisan semula.
3. Login dengan username `admin` dan sandi tadi. Ikon mata di kolom password menampilkan atau menyembunyikan sandi.

## I. Pembaruan: tampilan admin baru, ganti password, Portal Wali dihapus
Salin ke repository: `index.html`, `admin.html`, `css/style.css`, `css/admin.css` (baru), `js/app.js`, `js/admin.js`, `js/icons.js` (baru). **Jangan timpa `js/config.js`.** Tempel `Kode.gs` baru, lalu Deploy → Manage deployments → Edit → New version. Ganti password lewat menu **Akun Saya**.

## J. Menu Tentang Kami (dropdown) dan Guru & Karyawan
Salin `index.html`, `css/style.css`, `js/app.js`, `js/admin.js`, `js/icons.js` (jangan timpa `config.js`), tempel `Kode.gs` baru, lalu Deploy versi baru. Setelah login admin, buka menu **Guru & Karyawan** (sheet dibuat otomatis) dan menu **Pengaturan** satu kali (baris baru KURIKULUM, PRESTASI, ALUMNI_INFO, MITRA, VIDEO_URL ditambahkan otomatis). Foto guru: isi link gambar, dan kolom `foto_tampil` = TIDAK untuk menyembunyikan foto.

## K. Virtual Tour 360°
**Opsi 1: Street View Google.** Buka Google Maps, cari lokasi pondok, masuk ke Street View (tarik ikon orang kuning ke jalan di depan pondok). Klik **Bagikan → Sematkan peta**, salin kode HTML-nya, tempel utuh ke menu Pengaturan baris `STREETVIEW_EMBED`.
**Opsi 2: foto 360° sendiri.** Buat foto 360 (aplikasi Google Street View di HP atau kamera 360), simpan sebagai `assets/panorama.jpg` di repository, lalu isi `PANORAMA_URL` dengan `assets/panorama.jpg`. Keduanya boleh dipakai bersamaan.

## L. Pengumuman Pop Up
Menu admin **Pengumuman Pop Up** (sheet dibuat otomatis). Kolom: judul, isi, gambar (link), tombol_teks, tombol_link, **popup** (YA = ikut tampil, TIDAK = disembunyikan). Saklar besar di atas halaman mengaktifkan/menonaktifkan semua pop up (`POPUP_AKTIF`, khusus admin). Pop up muncul sekali per kunjungan; bila ada beberapa, pengunjung bisa menggeser antar pengumuman.

## M. Foto latar beranda dari Galeri
Semua foto dikelola lewat menu **Galeri**. Foto dipakai untuk: (1) latar beranda yang berganti tiap 5 detik dengan lapisan gradasi biru, (2) kartu kampus di beranda, (3) kotak Fasilitas (isi `judul` foto dengan kata *masjid*, *asrama*, *kelas*, atau *lapangan* agar masuk ke kotak yang sesuai). Sembunyikan foto dengan `tampil` = TIDAK. Urutan mengikuti urutan baris; maksimal 8 foto pertama dipakai di latar.

## N. Unggah foto langsung dari panel admin
Di form **Berita, Galeri, Guru & Karyawan, dan Pengumuman**, kolom foto punya tombol **Unggah**. Foto otomatis dikecilkan (maks 1600 px), disimpan di folder `Foto` pada Google Drive pondok, dan linknya terisi sendiri. Klik **Simpan** setelahnya. Bila muncul error izin: di Apps Script jalankan fungsi `izinkanDrive` sekali, lalu Deploy → New version.

## O. Foto tanpa URL (pustaka Galeri)
**Galeri** adalah pustaka foto: klik **Unggah foto**, isi judul, lalu Simpan. Di form **Berita, Guru & Karyawan, dan Pengumuman**, foto dipilih lewat tombol **Pilih dari Galeri** (jendela berisi semua foto Galeri), atau unggah foto baru langsung dari jendela itu (otomatis masuk Galeri). Tidak ada kolom link yang perlu diketik.
