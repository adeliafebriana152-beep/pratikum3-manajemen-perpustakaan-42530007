
const database = require('../config/database');

async function getAll() {
    const [rows] = await database.execute(
        `SELECT id_kategori, nama_kategori, deskripsi
         FROM kategori
         ORDER BY nama_kategori ASC`
    );

    return rows;
}

module.exports = { getAll };
