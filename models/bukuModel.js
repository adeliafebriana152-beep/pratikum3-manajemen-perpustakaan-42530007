const database = require('../config/database');

// Menampilkan semua buku.
async function getAll() {
    const [rows] = await database.execute(`
        SELECT 
            id,
            isbn,
            judul,
            penulis,
            penerbit,
            kategori,
            tahun_terbit,
            jumlah_halaman,
            stok,
            harga,
            tanggal_masuk,
            deskripsi,
            created_at
        FROM buku
        ORDER BY id DESC
    `);

    return rows;
}

// Mengambil satu buku berdasarkan ID.
async function getById(id) {
    const [rows] = await database.execute(`
        SELECT 
            id, isbn, judul, penulis, penerbit,
            kategori, tahun_terbit, jumlah_halaman, stok, 
            harga, tanggal_masuk, deskripsi
        FROM buku
        WHERE id = ?
    `, [id]);

    return rows[0] || null;
}

// Menambahkan data buku.
async function create(data) {
    const [result] = await database.execute(`
        INSERT INTO buku (
            isbn, judul, penulis, penerbit, kategori,
            tahun_terbit, jumlah_halaman, stok, harga,
            tanggal_masuk, deskripsi
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        data.isbn,
        data.judul,
        data.penulis,
        data.penerbit,
        data.kategori,
        data.tahun_terbit,
        data.jumlah_halaman,
        data.stok,
        data.harga,
        data.tanggal_masuk,
        data.deskripsi
    ]);

    return result.insertId;
}

// Memperbarui data buku.
async function update(id, data) {
    const [result] = await database.execute(`
        UPDATE buku
        SET 
            isbn = ?,
            judul = ?,
            penulis = ?,
            penerbit = ?,
            kategori = ?,
            tahun_terbit = ?,
            jumlah_halaman = ?,
            stok = ?,
            harga = ?,
            tanggal_masuk = ?,
            deskripsi = ?
        WHERE id = ?
    `, [
        data.isbn,
        data.judul,
        data.penulis,
        data.penerbit,
        data.kategori,
        data.tahun_terbit,
        data.jumlah_halaman,
        data.stok,
        data.harga,
        data.tanggal_masuk,
        data.deskripsi,
        id
    ]);

    return result.affectedRows;
}

// Menghapus data buku.
async function remove(id) {
    const [result] = await database.execute(
        'DELETE FROM buku WHERE id = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};