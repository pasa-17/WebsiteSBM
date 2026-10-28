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
