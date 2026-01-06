const form = document.getElementById('swapForm');
const itemInput = document.getElementById('item');
const wantInput = document.getElementById('want');
const swapList = document.getElementById('swapList');

function loadSwaps(){
  const raw = localStorage.getItem('swaps');
  return raw ? JSON.parse(raw) : [];
}

function saveSwaps(list){
  localStorage.setItem('swaps', JSON.stringify(list));
}

function render(){
  const list = loadSwaps();
  swapList.innerHTML = '';
  if(list.length === 0){
    swapList.innerHTML = '<div class="empty">No hay intercambios publicados aún.</div>';
    return;
  }
  list.slice().reverse().forEach(s => {
    const card = document.createElement('div');
    card.className = 'card';
    const left = document.createElement('div');
    left.className = 'left';
    const title = document.createElement('h3');
    title.textContent = s.item;
    const desc = document.createElement('p');
    desc.textContent = 'Busca: ' + s.want + ' • ' + new Date(s.createdAt).toLocaleString();
    left.appendChild(title);
    left.appendChild(desc);

    const remove = document.createElement('button');
    remove.textContent = 'Eliminar';
    remove.addEventListener('click', () => {
      const remaining = loadSwaps().filter(x => x.id !== s.id);
      saveSwaps(remaining);
      render();
    });

    card.appendChild(left);
    card.appendChild(remove);
    swapList.appendChild(card);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const item = itemInput.value.trim();
  const want = wantInput.value.trim();
  if(!item || !want) return;
  const list = loadSwaps();
  list.push({ id: Date.now().toString(), item, want, createdAt: Date.now() });
  saveSwaps(list);
  itemInput.value = '';
  wantInput.value = '';
  render();
});

// Inicializar
render();
