const iya = document.getElementById("iya");
const tidak = document.getElementById("tidak");
const kartu = document.getElementById("kartu");

let ukuran = 1;

function kabur(e) {
  e.preventDefault(); // cegah sentuhan jadi klik di hape

  const lebar = tidak.offsetWidth;
  const tinggi = tidak.offsetHeight;

  // pakai batas layar sebenarnya, dikurangi ukuran tombol dan margin
  const maxX = window.innerWidth - lebar - 16;
  const maxY = window.innerHeight - tinggi - 16;

  tidak.style.position = "fixed";
  tidak.style.left = Math.max(8, Math.random() * maxX) + "px";
  tidak.style.top = Math.max(8, Math.random() * maxY) + "px";

  // batasi supaya tombol "Iya" tidak melebihi layar
  ukuran = Math.min(ukuran + 0.12, 1.8);
  iya.style.transform = `scale(${ukuran})`;
}

tidak.addEventListener("mouseover", kabur);
tidak.addEventListener("touchstart", kabur, { passive: false });
tidak.addEventListener("click", kabur);

iya.addEventListener("click", () => {
  kartu.innerHTML =
    "<h1>Makasih ya! 🥹💖</h1><p>Aku janji nggak ngulang lagi.</p>";
});