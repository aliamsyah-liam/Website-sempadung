// ============================================
// GANTI URL DI BAWAH INI dengan Web App URL
// hasil Deploy dari Google Apps Script kamu.
// Contoh: "https://script.google.com/macros/s/xxxxxxxx/exec"
// ============================================
const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbyBbUk-zqwrBUJFrIFezz4glHJ-rr6yyU-27ww0QvKRuOUiE1igBY_jRhawdlrGu0j-/exec";

const guestForm = document.getElementById('guestForm');
const gStatus = document.getElementById('gStatus');
const gSubmitBtn = document.getElementById('gSubmitBtn');

function isApiConfigured() {
  return typeof GUESTBOOK_API_URL === 'string' &&
    GUESTBOOK_API_URL.startsWith('http') &&
    !GUESTBOOK_API_URL.includes('PASTE_URL');
}

if (guestForm) {
  guestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('gName').value.trim();
    const email = document.getElementById('gEmail').value.trim();
    const pesan = document.getElementById('gMessage').value.trim();

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
        body: JSON.stringify({ nama, email, pesan })
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
