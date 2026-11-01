# Sistem Manajemen Data Buku (Perpustakaan Master)

Aplikasi web berbasis **Node.js, Express.js, dan MySQL** yang dirancang untuk mengelola data koleksi buku perpustakaan secara efisien. Proyek ini mengimplementasikan siklus penuh operasi *CRUD (Create, Read, Update, Delete)* yang aman, dilengkapi dengan validasi data.

---

## Identitas Mahasiswa
* **Nama:** Made Adelia Febriana
* **NIM:** 42530007
* **Mata Kuliah:** Pemrograman Web (Semester 3)
* **Dosen Pengampu:** Ir. Gede Humaswara Prathama, S.T., M.T.

---

## Fitur Utama
* **Manajemen Data Buku (CRUD):** Tambah, lihat daftar, ubah, dan hapus data buku secara aman.
* **Pencarian Instan:** Fitur pencarian data buku secara *real-time* di halaman utama menggunakan JavaScript sisi klien.
* **Validasi & Normalisasi Data:** Pemeriksaan input ketat di sisi server (panjang karakter, rentang tahun, validasi kategori berbasis *ENUM*, serta format tanggal).
* **Metode HTTP RESTful:** Mendukung metode pengiriman `PUT` dan `DELETE` menggunakan pustaka `method-override`.
* **Antarmuka Modern:** Desain tata letak bersih menggunakan *CSS Custom* serta templat EJS.

---

## Implementasi CRUD (Create, Read, Update, Delete).
  * **Crate (Tambah Data Buku)**
    * **Alur Pengguna:** Pengguna mengklik tombol "+ Tambah Buku Baru" di halaman utama yang mengarah ke rute GET /buku/new, menampilkan formulir pengisian data buku.
    * **Proses:**
        * **Buka Form:** Pengguna mengklik tombol "+ Tambah Buku Baru" di halaman utama. Browser mengakses rute GET /buku/new, dan controller menampilkan halaman formulir kosong.
        * **Kirim Data:** Pengguna mengisi formulir (ISBN, judul, harga, dll.) lalu menekan tombol Simpan. Data dikirim ke server menggunakan metode POST /buku
        * **Validasi & Simpan:** Di controller, data dibersihkan (normalizeForm) dan dicek aturannya (validate). Jika lolos, model mengeksekusi perintah SQL INSERT INTO... (bukuModel.create).
        * **Data berhasil dibuat:** Server mengalihkan (redirect) pengguna kembali ke halaman utama (/buku) dengan membawa pesan sukses.
     
  * **Read (Menampilkan Daftar Buku)**
    * **Alur Pengguna:** Saat pengguna mengakses halaman utama di rute GET /buku, sistem menampilkan seluruh daftar koleksi buku.
    * **Proses:**
        * **Akses Halaman:** Pengguna membuka halaman utama http://localhost:3000/buku (GET /).
        * **Ambil Data:** Controller meminta seluruh data buku ke database melalui fungsi model bukuModel.getAll().
        * **Render Tampilan:** Data dari database dimasukkan ke dalam file index.ejs, diubah format rupiah dan tanggalnya, lalu dikirim ke browser menjadi tabel HTML yang rapi.

  * **Update (Edit Data Buku)**
    * **Alur Pengguna:** Pengguna mengklik tombol "Edit" pada salah satu baris buku untuk membuka rute GET /buku/:id/edit
    * **Proses:**
        * **Buka Form Edit:** Pengguna mengklik tombol "Edit" pada salah satu buku. Browser mengakses rute GET /buku/:id/edit (membawa ID buku).
        * **Pre-filled:** Server mencari data berdasarkan ID (bukuModel.getById). Jika ketemu, data lama dipasang ke dalam kotak input formulir agar pengguna tidak perlu mengetik ulang dari awal.
        * **Kirim Perubahan:** Setelah diubah, formulir dikirim menggunakan metode PUT (berkat bantuan pustaka method-override pada URL /buku/:id?_method=PUT).
        * **Simpan ke Database** Controller memvalidasi ulang data, lalu model menjalankan perintah SQL UPDATE... (bukuModel.update) dan mengarahkan kembali ke halaman utama dengan pesan sukses.
     
  * **Delete (Menhapus Data Buku)**
    * **Alur Pengguna:** Pengguna mengklik tombol "Hapus" pada baris buku tertentu.
    * **Konfirmasi Keamanan:** Muncul pemberitahuan konfirmasi penghapusan data (browser confirm) muncul sebelum penghapusan diproses
    * **Proses:**
        * **Konfirmasi Pengguna:** engguna mengklik tombol "Hapus". Sebelum terkirim, JavaScript (main.js) memunculkan jendela dialog konfirmasi (Pop-up: "Apakah Anda yakin ingin menghapus buku ini?").
        * **Kirim Permintaan Penghapusan:** Jika pengguna menekan "OK", formulir mengirim permintaan dengan metode DELETE (/buku/:id?_method=DELETE).
        * **Ekseskusi Hapus:** Controller memastikan data dengan ID tersebut ada, lalu model menjalankan perintah SQL DELETE FROM... (bukuModel.remove).
        * **Selesai:** Pengguna dialihkan kembali ke halaman utama dengan pemberitahuan bahwa data berhasil dihapus.
