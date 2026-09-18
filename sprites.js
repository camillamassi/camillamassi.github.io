// sprites.js
// Funzioni helper per costruire griglie pixel-art e tutti i bitmap
// (invader, boccali di birra, cuori) usati dall'app.

function emptyGrid(w, h) {
  return Array.from({ length: h }, () => Array(w).fill('0'));
}

function fillRect(grid, r0, r1, c0, c1, symbol) {
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (grid[r] && c >= 0 && c < grid[r].length) grid[r][c] = symbol;
    }
  }
}

function fillCells(grid, cells, symbol) {
  cells.forEach(([r, c]) => { if (grid[r] && c >= 0 && c < grid[r].length) grid[r][c] = symbol; });
}

function toRows(grid) {
  return grid.map(row => row.join(''));
}

// --- Alieno stile Space Invaders ---
const INVADER_BITMAP_A = [
  "00100000100",
  "00010001000",
  "00111111100",
  "01101110110",
  "11111111111",
  "10111111101",
  "10100000101",
  "00011011000",
];

const INVADER_BITMAP_B = [
  "00100000100",
  "10010001001",
  "10111111101",
  "11101110111",
  "01111111110",
  "00111111100",
  "00100000100",
  "01000000010",
];

// --- Boccali di birra: due bicchieri con manico e schiuma, che brindano ---
function buildBeer() {
  const g = emptyGrid(18, 14);
  // boccale sinistro
  fillRect(g, 2, 3, 2, 7, '3');     // schiuma
  fillRect(g, 4, 10, 2, 7, '1');    // vetro/birra
  fillRect(g, 5, 5, 0, 1, '1');     // manico
  fillRect(g, 8, 8, 0, 1, '1');
  fillRect(g, 5, 8, 0, 0, '1');
  // boccale destro (leggermente più alto, come se brindasse)
  fillRect(g, 0, 1, 10, 15, '3');   // schiuma
  fillRect(g, 2, 8, 10, 15, '1');   // vetro/birra
  fillRect(g, 3, 3, 16, 17, '1');   // manico
  fillRect(g, 6, 6, 16, 17, '1');
  fillRect(g, 3, 6, 17, 17, '1');
  // schiuma che si tocca nel brindisi
  fillRect(g, 1, 2, 8, 9, '3');
  return toRows(g);
}

const BEER_BITMAP = buildBeer();

const HEART_BITMAP = [
  "0110110",
  "1111111",
  "1111111",
  "0111110",
  "0011100",
  "0001000",
];

// Disegna un bitmap (array di stringhe '0'/'1'/'2'/'3'...) dentro un
// contenitore .pixel-sprite, mappando ogni simbolo a un colore CSS.
function renderSprite(containerId, bitmap, colorMap) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  el.style.gridTemplateColumns = `repeat(${bitmap[0].length}, 1fr)`;
  el.style.gridTemplateRows = `repeat(${bitmap.length}, 1fr)`;
  const frag = document.createDocumentFragment();
  bitmap.forEach(row => {
    for (const ch of row) {
      const cell = document.createElement('div');
      if (colorMap[ch]) cell.style.background = colorMap[ch];
      frag.appendChild(cell);
    }
  });
  el.appendChild(frag);
}
