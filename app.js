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
            document.getElementById('app-web-link').href = app.linkWeb;
            document.getElementById('app-full-description').textContent = app.deskripsiLengkap;
            
            const webLinkBtn = document.getElementById('app-web-link');
            if (webLinkBtn) {
                const link = app.linkWeb && String(app.linkWeb).trim();
                if (link && link !== '#') {
                    webLinkBtn.style.display = '';
                    webLinkBtn.href = app.linkWeb;
                } else {
                    webLinkBtn.style.display = 'none';
                    webLinkBtn.removeAttribute('href');
                }
            }

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

// Registrasi Service Worker untuk PWA dan cache management
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // register using relative path so it works on GitHub Pages (repo pages)
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);

                // Deteksi update baru
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Ada update baru, tampilkan notifikasi
                                if (confirm('Ada pembaruan aplikasi. Reload untuk menggunakan versi terbaru?')) {
                                    // Kirim pesan ke SW untuk skip waiting
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                }
                            }
                        });
                    }
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });

        // Saat SW baru aktif, reload halaman
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!window.__swReloading) {
                window.__swReloading = true;
                window.location.reload();
            }
        });
    });
}

// Fungsi untuk cek pembaruan konten setiap 5 menit
function checkForUpdates() {
    fetch('./meta.json?_=' + Date.now(), { cache: 'no-store' })
        .then(response => {
            const ct = response.headers.get('content-type') || '';
            if (!response.ok) throw new Error('meta.json not found');
            if (ct.includes('application/json')) return response.json();
            // if server returned HTML (404 page), avoid parsing as JSON
            throw new Error('meta.json returned non-JSON response');
        })
        .then(data => {
            const currentVersion = localStorage.getItem('appVersion');
            if (!currentVersion || currentVersion !== data.version) {
                localStorage.setItem('appVersion', data.version);
                if (currentVersion && confirm('Konten aplikasi telah diperbarui. Reload untuk melihat perubahan?')) {
                    window.location.reload();
                }
            }
        })
        .catch(error => console.log('Error checking for updates:', error));
}

// Jalankan cek update setiap 1 menit
setInterval(checkForUpdates, 1 * 60 * 1000);

// Cek update saat load pertama
checkForUpdates();