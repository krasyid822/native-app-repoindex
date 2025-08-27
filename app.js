document.addEventListener('DOMContentLoaded', () => {
    const appGridContainer = document.getElementById('app-grid-container');

    // Jika kita berada di halaman utama
    if (appGridContainer) {
        appList.forEach(app => {
            const appCard = document.createElement('a');
            appCard.className = 'app-card';
            // Link menuju detail.html dengan parameter id
            appCard.href = `detail.html?id=${app.id}`; 
            
            appCard.innerHTML = `
                <img src="${app.ikon}" alt="Ikon ${app.nama}">
                <h3>${app.nama}</h3>
                <p>${app.deskripsiSingkat}</p>
            `;
            
            appGridContainer.appendChild(appCard);
        });
    }

    // Logika untuk halaman detail
    const detailContainer = document.querySelector('.app-detail');
    if (detailContainer) {
        // Ambil ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const appId = parseInt(urlParams.get('id'));

        // Cari aplikasi yang cocok di dalam data
        const app = appList.find(app => app.id === appId);

        if (app) {
            // Ubah judul halaman
            document.title = `Detail - ${app.nama}`;

            // Isi template HTML dengan data yang ditemukan
            document.getElementById('app-icon').src = app.ikon;
            document.getElementById('app-name').textContent = app.nama;
            document.getElementById('app-developer').textContent = `Oleh: ${app.developer}`;
            document.getElementById('app-category').textContent = `Platform: ${app.platform}`;
            document.getElementById('app-download-link').href = app.linkDownload;
            document.getElementById('app-full-description').textContent = app.deskripsiLengkap;
            
            const screenshotGallery = document.getElementById('screenshot-gallery');
            app.screenshots.forEach(screenshotUrl => {
                const img = document.createElement('img');
                img.src = screenshotUrl;
                img.alt = 'Screenshot';
                screenshotGallery.appendChild(img);
            });
        } else {
            // Jika aplikasi tidak ditemukan
            detailContainer.innerHTML = '<h1>Aplikasi tidak ditemukan!</h1><p>Silakan kembali ke halaman utama.</p>';
        }
    }
});