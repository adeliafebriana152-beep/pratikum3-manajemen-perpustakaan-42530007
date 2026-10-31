document.addEventListener('DOMContentLoaded', () => {
    // Fitur Pencarian Tabel 
    const searchInput = document.getElementById('tableSearch');
    const table = document.getElementById('booksTable');

    if (searchInput && table) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    //Konfirmasi saat Menghapus Data
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const title = form.getAttribute('data-title') || 'buku ini';
            const confirmed = confirm(
                `Apakah Anda yakin ingin menghapus "${title}"?\nData yang dihapus tidak dapat dikembalikan.`
            );

            if (!confirmed) {
                event.preventDefault();
            }
        });
    });
});