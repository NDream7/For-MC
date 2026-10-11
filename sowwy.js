/* ====== PENGATURAN SPREADSHEET ======
   Tempel URL Web App dari Google Apps Script di sini (berakhiran /exec) */
const URL_SPREADSHEET = "https://script.google.com/macros/s/AKfycbyDyx_Zk25pY3EGfKEda1OVqQ4felA4cZuDoL6vp3blIBlByfp-5doXC-93RoqaoOI/exec";

const kartu = document.getElementById("kartu");
const latar = document.getElementById("latar");
const stikerUtama = document.getElementById("stikerUtama");
const isian = document.getElementById("isian");
const petunjuk = document.getElementById("petunjuk");
const btnKirim = document.getElementById("kirim");

/* ---- daftar gambar ----
   Sedih  : stiker/sedih-1.png ... stiker/sedih-11.png
   Senang : stiker/seneng-1 ... stiker/seneng-11 (+ seneng-utama)
   Bunga  : stiker/bunga (untuk surat)
   Ekstensi gambar senang dan bunga (.png/.jpg/.jpeg/.webp) dicari otomatis. */
const jumlah = 11;
const fileSedih = Array.from({ length: jumlah }, (_, i) => `stiker/sedih-${i + 1}.png`);
const namaSenang = Array.from({ length: jumlah }, (_, i) => `stiker/seneng-${i + 1}`);
const namaUtamaSenang = "stiker/seneng-utama";
const namaBunga = "stiker/bunga";
const ekstensi = [".png", ".jpg", ".jpeg", ".webp"];

function cariGambar(nama, selesai, n = 0) {
  if (n >= ekstensi.length) {
    console.warn("Gambar tidak ditemukan:", nama);
    return;
  }
  const tes = new Image();
  tes.onload = () => selesai(nama + ekstensi[n]);
  tes.onerror = () => cariGambar(nama, selesai, n + 1);
  tes.src = nama + ekstensi[n];
}
function tukarGambar(img, nama) {
  cariGambar(nama, (src) => { img.src = src; });
}

/* muat gambar senang dan bunga di belakang layar setelah halaman selesai */
window.addEventListener("load", () => {
  [namaUtamaSenang, namaBunga, ...namaSenang].forEach((nama) => cariGambar(nama, () => {}));
});

/* ---- stiker kecil yang tersebar ----
   x, y = posisi dalam persen layar, s = ukuran (vw), r = putar (derajat) */
const posisi = [
  { x: 8,  y: 8,  s: 14, r: -15 },
  { x: 78, y: 6,  s: 14, r: 12 },
  { x: 68, y: 30, s: 12, r: -8 },
  { x: 2,  y: 42, s: 13, r: 10 },
  { x: 16, y: 66, s: 13, r: -12 },
  { x: 40, y: 76, s: 11, r: 8 },
  { x: 62, y: 75, s: 11, r: -6 },
  { x: 52, y: 3,  s: 12, r: 14 },
  { x: 85, y: 45, s: 12, r: -14 },
  { x: 21, y: 30, s: 12, r: -17 },
  { x: 76, y: 62, s: 12, r: -14 },
];

const stikerLatar = [];
posisi.forEach((p, i) => {
  const img = document.createElement("img");
  img.decoding = "async";
  img.onload = () => img.classList.add("siap");
  img.src = fileSedih[i % fileSedih.length];
  img.alt = "";
  img.style.left = p.x + "%";
  img.style.top = p.y + "%";
  img.style.width = `clamp(60px, ${p.s}vw, 200px)`;
  img.style.setProperty("--rot", p.r + "deg");
  latar.appendChild(img);
  stikerLatar.push(img);
});

/* ---- pindah antar layar ---- */
function tampilkan(id) {
  document.querySelectorAll(".layar").forEach((l) => {
    l.classList.toggle("aktif", l.id === id);
  });
  kartu.dataset.layar = id;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "surat") {
    const bunga = document.getElementById("stikerBunga");
    cariGambar(namaBunga, (src) => { bunga.src = src; bunga.hidden = false; });
  }
}

/* semua tombol ber-atribut data-ke berpindah ke layar itu */
let tingkat = "";
document.querySelectorAll("[data-ke]").forEach((tbl) => {
  tbl.addEventListener("click", () => {
    const tujuan = tbl.dataset.ke;

    if (tbl.dataset.tingkat) {            /* pilihan tingkat marah */
      tingkat = tbl.dataset.tingkat;
      document.querySelectorAll("[data-versi]").forEach((v) => {
        v.hidden = v.dataset.versi !== tingkat;
      });
    }
    if (tujuan === "maaf") jadiSenang();  /* sudah dimaafin */
    tampilkan(tujuan);
  });
});

/* ---- semua stiker jadi senang ---- */
function jadiSenang() {
  document.body.classList.add("senang");
  tukarGambar(stikerUtama, namaUtamaSenang);
  stikerUtama.classList.add("senang");
  stikerLatar.forEach((img, i) => {
    tukarGambar(img, namaSenang[i % namaSenang.length]);
    img.classList.add("senang");
  });
}

/* ---- kirim jawaban ke spreadsheet ---- */
function simpan(data) {
  if (!URL_SPREADSHEET.startsWith("https://")) {
    console.warn("URL spreadsheet belum diisi di sowwy.js");
    return;
  }
  fetch(URL_SPREADSHEET, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

btnKirim.addEventListener("click", () => {
  const jawaban = isian.value.trim();
  if (!jawaban) {
    petunjuk.textContent = "isi dulu yaa 🥺";
    return;
  }
  btnKirim.disabled = true;
  simpan({ tingkat, jawaban });
  tampilkan("siap");
});
