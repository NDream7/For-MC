const iya = document.getElementById("iya");
const ngga = document.getElementById("ngga");
const latar = document.getElementById("latar");
const stikerUtama = document.getElementById("stikerUtama");
const judul = document.getElementById("judul");
const teks = document.getElementById("teks");
const tombol = document.getElementById("tombol");

/* ---- daftar gambar ----
   Sedih  : stiker/sedih-1.png ... stiker/sedih-11.png
   Senang : stiker/seneng-1 ... stiker/seneng-11 (+ seneng-utama)
   Untuk gambar senang, ekstensi (.png / .jpg / .jpeg / .webp) dicari otomatis,
   jadi file boleh campur png dan jpg. Cukup nama depannya yang harus sama. */
const jumlah = 11;
const fileSedih = Array.from({ length: jumlah }, (_, i) => `stiker/sedih-${i + 1}.png`);
const namaSenang = Array.from({ length: jumlah }, (_, i) => `stiker/seneng-${i + 1}`);
const namaUtamaSenang = "stiker/seneng-utama";
const ekstensi = [".png", ".jpg", ".jpeg", ".webp"];

/* coba satu per satu ekstensi sampai gambarnya ketemu */
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

/* ganti gambar hanya kalau file barunya ketemu */
function tukarGambar(img, nama) {
  cariGambar(nama, (src) => { img.src = src; });
}

/* muat gambar senang lebih awal supaya langsung muncul saat diganti */
window.addEventListener("load", () => {
  [namaUtamaSenang, ...namaSenang].forEach((nama) => cariGambar(nama, () => {}));
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

/* ---- tombol Ngga: kabur saat didekati, Iya makin besar ---- */
const kolomNgga = document.querySelector(".kolom-ngga"); /* tombol + teks kecilnya */
const teksNgga = ["Ngga", "Yakin?", "Beneran?", "Aku sedih nih", "Pweeaassee..."];
let level = 0;
let tx = 0, ty = 0; /* geseran Ngga dari posisi aslinya */

function kabur() {
  /* 1) pindah ke tempat acak yang cukup jauh dari posisi sekarang */
  const r = kolomNgga.getBoundingClientRect();
  const asalX = r.left - tx;
  const asalY = r.top - ty;
  const batas = 12;
  const maxX = Math.max(batas, innerWidth - r.width - batas);
  const maxY = Math.max(batas, innerHeight - r.height - batas);

  let x, y;
  for (let i = 0; i < 10; i++) {
    x = batas + Math.random() * (maxX - batas);
    y = batas + Math.random() * (maxY - batas);
    if (Math.hypot(x - r.left, y - r.top) > 160) break;
  }
  tx = x - asalX;
  ty = y - asalY;
  kolomNgga.style.transform = `translate(${tx}px, ${ty}px)`;

  /* 2) teks Ngga berubah dan tombol Iya makin besar */
  level++;
  ngga.textContent = teksNgga[Math.min(level, teksNgga.length - 1)];

  if (level >= 5) {
    iya.classList.add("penuh");
  } else {
    iya.style.fontSize = 1 + level * 0.6 + "rem";
    iya.style.padding = `${12 + level * 10}px ${24 + level * 16}px`;
  }
}

kolomNgga.addEventListener("mouseenter", kabur); /* mouse / laptop */
kolomNgga.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault(); /* cegah terpencet di hape */
    kabur();
  },
  { passive: false }
);
ngga.addEventListener("click", kabur); /* jaga-jaga kalau dipencet lewat keyboard */

/* ---- tombol Iya: semua stiker jadi senang ---- */
iya.addEventListener("click", () => {
  iya.classList.remove("penuh");
  tombol.style.display = "none";

  judul.textContent = "YIIPPIIEE MAACIIHH! 🥹⭐";
  teks.textContent = "janji ndakaann diulangin agiiiii.";
  document.body.classList.add("senang");

  tukarGambar(stikerUtama, namaUtamaSenang);
  stikerUtama.classList.add("senang");

  stikerLatar.forEach((img, i) => {
    tukarGambar(img, namaSenang[i % namaSenang.length]);
    img.classList.add("senang");
  });
});