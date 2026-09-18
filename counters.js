// counters.js
// Logica dei contatori: rendering degli sprite, stato, e salvataggio.
// La parte di salvataggio (init/updateCounter) è invariata rispetto a
// prima: usa ancora window.claude.use('db'), in attesa di essere
// sostituita da Supabase.

renderSprite('spriteBeer', BEER_BITMAP, { '1': 'var(--yellow)', '3': '#fff6db' });
renderSprite('spriteA', INVADER_BITMAP, { '1': 'var(--cyan)' });
renderSprite('spriteB', INVADER_BITMAP, { '1': 'var(--magenta)' });
renderSprite('titleSpriteA', INVADER_BITMAP, { '1': 'var(--cyan)' });
renderSprite('titleSpriteB', INVADER_BITMAP, { '1': 'var(--magenta)' });

document.getElementById('playBtn').addEventListener('click', () => {
  document.getElementById('titleScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
});

const heartColors = { '1': '#ff3b3b' };
renderSprite('heart1Sprite', HEART_BITMAP, heartColors);
renderSprite('heart2Sprite', HEART_BITMAP, heartColors);
renderSprite('heart3Sprite', HEART_BITMAP, heartColors);

let state = { a: 0, b: 0 };
let db = null;
let docRef = null;
let ready = false;

const els = {
  status: document.getElementById('status'),
  valueA: document.getElementById('valueA'),
  valueB: document.getElementById('valueB'),
  diffValue: document.getElementById('diffValue'),
  beerIcon: document.getElementById('beerIcon'),
  plusA: document.getElementById('plusA'),
  minusA: document.getElementById('minusA'),
  plusB: document.getElementById('plusB'),
  minusB: document.getElementById('minusB'),
};

function drinkVerdict(diff) {
  if (diff === 0) {
    return 'PAREGGIO';
  }
  const n = Math.abs(diff);
  const name = diff > 0 ? 'CILLA' : 'CHATO';
  return `${name} IN DEBITO DI<br>${n} DRINK`;
}

function render() {
  els.valueA.textContent = state.a;
  els.valueB.textContent = state.b;
  const diff = state.a - state.b;
  els.diffValue.innerHTML = drinkVerdict(diff);
  els.beerIcon.style.visibility = diff === 0 ? 'visible' : 'hidden';
}

function setButtonsEnabled(enabled) {
  [els.plusA, els.minusA, els.plusB, els.minusB].forEach(b => b.disabled = !enabled);
}

async function updateCounter(key, delta) {
  if (!docRef) return;
  const next = { ...state, [key]: state[key] + delta };
  state = next;
  render();
  try {
    await docRef.set(next);
  } catch (err) {
    els.status.textContent = '> ERRORE SALVATAGGIO. RIPROVA.';
  }
}

els.plusA.addEventListener('click', () => updateCounter('a', 1));
els.minusA.addEventListener('click', () => updateCounter('a', -1));
els.plusB.addEventListener('click', () => updateCounter('b', 1));
els.minusB.addEventListener('click', () => updateCounter('b', -1));

async function init() {
  try {
    db = await window.claude.use('db');
  } catch (e) {
    db = null;
  }

  if (!db) {
    els.status.textContent = '> MODALITA LOCALE (NON CONDIVISA)';
    setButtonsEnabled(true);
    ready = true;
    return;
  }

  docRef = db.doc('counters/main');

  docRef.onSnapshot(
    (snap) => {
      const data = snap.data();
      if (data && typeof data.a === 'number' && typeof data.b === 'number') {
        state = { a: data.a, b: data.b };
      } else if (!ready) {
        docRef.set({ a: 0, b: 0 }).catch(() => {});
      }
      render();
      els.status.textContent = '> SINCRONIZZATO - VISIBILE A TUTTI';
      setButtonsEnabled(true);
      ready = true;
    },
    (err) => {
      els.status.textContent = '> CONNESSIONE PERSA. RICARICA.';
      setButtonsEnabled(false);
    }
  );
}

init();
