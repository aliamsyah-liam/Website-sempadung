// ============================================
// CARA PAKAI (tanpa perlu buka Extensions, bisa dari HP):
// 1. Sheet "Database Buku Tamu" sudah ada, tab bernama BukuTamu,
//    header baris 1: Waktu | Nama | Email | Pesan | Kategori
// 2. Buat SATU TAB BARU lagi di spreadsheet yang sama, namanya: Admin
//    Header baris 1 di tab Admin: Username | Password
//    (Boleh dikosongkan, nanti diisi otomatis lewat halaman Daftar Akun)
// 3. Buka script.new di Chrome (HP atau laptop)
// 4. Hapus kode default, tempel semua kode di bawah ini
// 5. Klik Deploy > New deployment > pilih "Web app"
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Klik Deploy, izinkan (authorize), lalu salin Web App URL yang muncul
// 7. Tempel URL itu ke:
//    - GUESTBOOK_API_URL di guestbook.js
//    - ADMIN_API_URL di admin-login.html, admin-register.html, admin.html
// ============================================

const SHEET_ID = "1GtVB6cHGmAKcK5beO8NqEZwTDGGi1Rs7jyFo96peNmU";
const SHEET_NAME = "BukuTamu";
const ADMIN_SHEET_NAME = "Admin";

function getSheet(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action || "guestbook";

  if (action === "register") return handleRegister(body);
  if (action === "login") return handleLogin(body);
  if (action === "data") return handleGetData(body);
  return handleGuestbook(body); // default: kirim pesan dari form buku tamu
}

// Publik: simpan pesan dari form buku tamu
function handleGuestbook(body) {
  const sheet = getSheet(SHEET_NAME);
  sheet.appendRow([new Date(), body.nama, body.email, body.pesan, body.kategori || "Pesan"]);
  return jsonOutput({ status: "success" });
}

// Daftar akun admin baru
function handleRegister(body) {
  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return jsonOutput({ status: "error", message: "Username dan password wajib diisi" });
  }

  const sheet = getSheet(ADMIN_SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  const sudahAda = rows.slice(1).some(row => row[0] === username);
  if (sudahAda) {
    return jsonOutput({ status: "error", message: "Username sudah dipakai, pilih yang lain" });
  }

  sheet.appendRow([username, password]);
  return jsonOutput({ status: "success" });
}

// Cek login admin
function handleLogin(body) {
  const username = (body.username || "").trim();
  const password = body.password || "";

  const sheet = getSheet(ADMIN_SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  const cocok = rows.slice(1).some(row => row[0] === username && String(row[1]) === String(password));

  if (!cocok) {
    return jsonOutput({ status: "error", message: "Username atau password salah" });
  }
  return jsonOutput({ status: "success" });
}

// Ambil semua data buku tamu (hanya untuk admin yang sudah login)
function handleGetData(body) {
  const loginCheck = handleLogin(body);
  const loginResult = JSON.parse(loginCheck.getContent());

  if (loginResult.status !== "success") {
    return jsonOutput({ status: "error", message: "Belum login" });
  }

  const sheet = getSheet(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  const data = rows.slice(1)
    .filter(row => row[1])
    .map(row => ({
      waktu: row[0],
      nama: row[1],
      email: row[2],
      pesan: row[3],
      kategori: row[4]
    }))
    .reverse();

  return jsonOutput({ status: "success", data: data });
}
