const bukuModel = require('../models/bukuModel');

const VALID_CATEGORIES = [
    'Pendidikan',
    'Teknologi',
    'Sejarah',
    'Sains',
    'Agama',
    'Hukum',
    'Referensi',
    'Lainnya'
];

function normalizeForm(body) {
    return {
        isbn: String(body.isbn || '').trim(),
        judul: String(body.judul || '').trim(),
        penulis: String(body.penulis || '').trim(),
        penerbit: String(body.penerbit || '').trim(),
        kategori: String(body.kategori || '').trim(),
        tahun_terbit: Number(body.tahun_terbit),
        jumlah_halaman: Number(body.jumlah_halaman || 0),
        stok: Number(body.stok || 0),
        harga: Number(body.harga || 0),
        tanggal_masuk: String(body.tanggal_masuk || ''),
        deskripsi: String(body.deskripsi || '').trim()
    };
}

function validate(data) {
    const errors = [];

    if (!data.isbn || data.isbn.length > 20)
        errors.push('ISBN wajib diisi, maksimal 20 karakter.');

    if (!data.judul || data.judul.length > 200)
        errors.push('Judul wajib diisi, maksimal 200 karakter.');

    if (!data.penulis || data.penulis.length > 150)
        errors.push('Penulis wajib diisi, maksimal 150 karakter.');

    if (!data.penerbit || data.penerbit.length > 150)
        errors.push('Penerbit wajib diisi, maksimal 150 karakter.');

    if (!VALID_CATEGORIES.includes(data.kategori))
        errors.push('Kategori tidak valid.');

    if (!Number.isInteger(data.tahun_terbit) ||
        data.tahun_terbit < 1000 ||
        data.tahun_terbit > 9999)
        errors.push('Tahun terbit tidak valid.');

    if (!Number.isInteger(data.jumlah_halaman) || data.jumlah_halaman < 0)
        errors.push('Jumlah halaman minimal 0.');

    if (!Number.isInteger(data.stok) || data.stok < 0)
        errors.push('Stok minimal 0 dan harus bilangan bulat.');

    if (!Number.isFinite(data.harga) || data.harga < 0)
        errors.push('Harga tidak boleh negatif.');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_masuk))
        errors.push('Tanggal masuk wajib diisi.');

    return errors;
}

function renderForm(res, options) {
    return res.render('buku/form', options);
}

// READ: untuk menampilkan seluruh data.
async function index(req, res, next) {
    try {
        const books = await bukuModel.getAll();

        res.render('buku/index', {
            books,
            success: req.query.success || '',
            error: req.query.error || ''
        });
    } catch (err) {
        next(err);
    }
}

// Menampilkan form tambah.
async function newForm(req, res, next) {
    try {
        renderForm(res, {
            pageTitle: 'Tambah Data Buku',
            formAction: '/buku',
            submitLabel: 'Simpan Buku',
            book: {
                kategori: 'Pendidikan',
                stok: 0,
                jumlah_halaman: 0,
                harga: '0.00',
                tanggal_masuk: new Date().toISOString().slice(0, 10)
            },
            categories: VALID_CATEGORIES,
            errors: []
        });
    } catch (err) {
        next(err);
    }
}

// CREATE: POST dan Post-Redirect-Get.
async function create(req, res, next) {
    const data = normalizeForm(req.body);
    const errors = validate(data);

    try {
        if (errors.length) {
            return renderForm(res, {
                pageTitle: 'Tambah Data Buku',
                formAction: '/buku',
                submitLabel: 'Simpan Buku',
                book: data,
                categories: VALID_CATEGORIES,
                errors
            });
        }

        await bukuModel.create(data);

        return res.redirect(
            '/buku?success=' +
            encodeURIComponent('Data buku berhasil ditambahkan.')
        );
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return renderForm(res, {
                pageTitle: 'Tambah Data Buku',
                formAction: '/buku',
                submitLabel: 'Simpan Buku',
                book: data,
                categories: VALID_CATEGORIES,
                errors: ['ISBN sudah terdaftar. Gunakan ISBN lain.']
            });
        }

        next(err);
    }
}

// Menampilkan form edit dengan data pre-filled.
async function editForm(req, res, next) {
    try {
        const id = Number(req.params.id);
        const book = await bukuModel.getById(id);

        if (!book) {
            return res.status(404).render('404');
        }

        renderForm(res, {
            pageTitle: 'Edit Data Buku',
            formAction: `/buku/${book.id}?_method=PUT`,
            submitLabel: 'Simpan Perubahan',
            book,
            categories: VALID_CATEGORIES,
            errors: []
        });
    } catch (err) {
        next(err);
    }
}

// UPDATE: memperbarui buku.
async function update(req, res, next) {
    const id = Number(req.params.id);
    const data = normalizeForm(req.body);
    const errors = validate(data);

    try {
        const existing = await bukuModel.getById(id);

        if (!existing) {
            return res.status(404).render('404');
        }

        if (errors.length) {
            return renderForm(res, {
                pageTitle: 'Edit Data Buku',
                formAction: `/buku/${id}?_method=PUT`,
                submitLabel: 'Simpan Perubahan',
                book: { ...data, id: id },
                categories: VALID_CATEGORIES,
                errors
            });
        }

        await bukuModel.update(id, data);

        return res.redirect(
            '/buku?success=' +
            encodeURIComponent('Data buku berhasil diperbarui.')
        );
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return renderForm(res, {
                pageTitle: 'Edit Data Buku',
                formAction: `/buku/${id}?_method=PUT`,
                submitLabel: 'Simpan Perubahan',
                book: { ...data, id: id },
                categories: VALID_CATEGORIES,
                errors: ['ISBN sudah digunakan buku lain.']
            });
        }

        next(err);
    }
}

// DELETE: menghapus buku.
async function destroy(req, res, next) {
    try {
        const id = Number(req.params.id);
        const existing = await bukuModel.getById(id);

        if (!existing) {
            return res.status(404).render('404');
        }

        await bukuModel.remove(id);

        return res.redirect(
            '/buku?success=' +
            encodeURIComponent('Data buku berhasil dihapus.')
        );
    } catch (err) {
        next(err);
    }
}

module.exports = {
    index,
    newForm,
    create,
    editForm,
    update,
    destroy
};