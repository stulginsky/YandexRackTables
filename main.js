function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node;
}

function initMain() {
  const globalSearch = /** @type {HTMLInputElement} */ (el("globalSearch"));

  globalSearch.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = globalSearch.value.trim();
    if (!q) {
      window.location.href = "./search.html";
      return;
    }
    window.location.href = `./search.html?q=${encodeURIComponent(q)}`;
  });
}

document.addEventListener("DOMContentLoaded", initMain);

