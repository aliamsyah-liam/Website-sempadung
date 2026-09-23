// ============================================
// GANTI URL DI BAWAH INI dengan Web App URL
// hasil Deploy dari Google Apps Script kamu.
// Contoh: "https://script.google.com/macros/s/xxxxxxxx/exec"
// ============================================
const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbyBbUk-zqwrBUJFrIFezz4glHJ-rr6yyU-27ww0QvKRuOUiE1igBY_jRhawdlrGu0j-/exec";

const guestForm = document.getElementById('guestForm');
const gStatus = document.getElementById('gStatus');
const gSubmitBtn = document.getElementById('gSubmitBtn');
const loginBanner = document.getElementById('loginBanner');

function isApiConfigured() {
  return typeof GUESTBOOK_API_URL === 'string' &&
    GUESTBOOK_API_URL.startsWith('http') &&
    !GUESTBOOK_API_URL.includes('PASTE_URL');
}

function isLoggedIn() {
  return !!(sessionStorage.getItem('adminUsername') && sessionStorage.getItem('adminPassword'));
}

function renderLoginBanner() {
  if (!loginBanner) return;

  if (isLoggedIn()) {
    const username = sessionStorage.getItem('adminUsername');
    let successNote = '';
    if (sessionStorage.getItem('showLoginSuccess')) {
      successNote = '✅ Berhasil login! ';
      sessionStorage.removeItem('showLoginSuccess');
    }
    loginBanner.style.background = '#e8f5e9';
    loginBanner.style.color = '#256029';
    loginBanner.innerHTML = `${successNote}Masuk sebagai <b>${username}</b> (admin). ` +
      `<a href="admin.html" style="font-weight:600">Lihat Dashboard</a> · ` +
      `<a href="#" id="logoutLink" style="font-weight:600">Keluar</a>`;

    document.getElementById('logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('adminUsername');
      sessionStorage.removeItem('adminPassword');
      renderLoginBanner();
    });

    gSubmitBtn.disabled = false;
  } else {
    loginBanner.style.background = '#fdecea';
    loginBanner.style.color = '#c0392b';
    loginBanner.innerHTML = `🔒 Kamu harus login admin dulu sebelum bisa mengirim pesan. ` +
      `<a href="admin-login.html" style="font-weight:600">Masuk ke Login Admin →</a>`;
    gSubmitBtn.disabled = true;
  }
}

renderLoginBanner();

if (guestForm) {
  guestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      gStatus.textContent = 'Gagal: kamu belum login admin.';
      gStatus.className = 'form-status';
      renderLoginBanner();
      return;
    }

    const nama = document.getElementById('gName').value.trim();
    const email = document.getElementById('gEmail').value.trim();
    const pesan = document.getElementById('gMessage').value.trim();
    const kategori = document.getElementById('gKategori').value;

    if (!nama || !email || !pesan) return;

    gSubmitBtn.disabled = true;
    gStatus.textContent = 'Mengirim...';
    gStatus.className = 'form-status';

    if (!isApiConfigured()) {
      gStatus.textContent = 'Belum terhubung ke server, coba lagi nanti.';
      gStatus.className = 'form-status';
      gSubmitBtn.disabled = false;
      return;
    }

    try {
      await fetch(GUESTBOOK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ nama, email, pesan, kategori })
      });

      gStatus.textContent = 'Pesan terkirim, terima kasih!';
      gStatus.className = 'form-status ok';
      guestForm.reset();
    } catch (err) {
      console.error('Gagal mengirim pesan:', err);
      gStatus.textContent = 'Gagal mengirim pesan, coba lagi.';
      gStatus.className = 'form-status';
    } finally {
      gSubmitBtn.disabled = false;
    }
  });
}
