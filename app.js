
require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/buku');
});

app.use('/buku', require('./routes/bukuRoutes'));

app.use((req, res) => {
    res.status(404).render('404');
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render('500', {
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Terjadi kesalahan pada server. Periksa konfigurasi database.'
    });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
