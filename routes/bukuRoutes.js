const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuControllers');

//Rute untuk menampilkan form tambah buku 
router.get('/new', bukuController.newForm);
//Rute untuk menyimpan data buku baru (POST)
router.post('/', bukuController.create);
//Rute untuk menampilkan daftar seluruh buku
router.get('/', bukuController.index);
//Rute untuk menampilkan form edit buku berdasarkan ID
router.get('/:id/edit', bukuController.editForm);
//Rute untuk memperbarui data buku (PUT)
router.put('/:id', bukuController.update);
//Rute untuk menghapus data buku (DELETE)
router.delete('/:id', bukuController.destroy);

module.exports = router;