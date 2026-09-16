// ============================================
// CARA PAKAI (tanpa perlu buka Extensions, bisa dari HP):
// 1. Sheet "Database Buku Tamu" sudah ada, tab bernama BukuTamu,
//    header baris 1: Waktu | Nama | Email | Pesan
// 2. Buka script.new di Chrome (HP atau laptop)
// 3. Hapus kode default, tempel semua kode di bawah ini
// 4. Klik Deploy > New deployment > pilih "Web app"
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Klik Deploy, izinkan (authorize), lalu salin Web App URL yang muncul
// 6. Tempel URL itu ke variabel GUESTBOOK_API_URL di file guestbook.js
// ============================================

const SHEET_ID = "1GtVB6cHGmAKcK5beO8NqEZwTDGGi1Rs7jyFo96peNmU";
const SHEET_NAME = "BukuTamu";

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();

  // Baris pertama = header, jadi dilewati
  const data = rows.slice(1).map(row => ({
    timestamp: row[0],
    nama: row[1],
    email: row[2],
    pesan: row[3]
  }));

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const body = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    body.nama,
    body.email,
    body.pesan
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
