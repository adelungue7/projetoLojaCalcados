// Dados simulados de produtos
const produtos = [
  { nome: 'Abibas Classic', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgG5V8v7x44yal4V-80ineoeobwlR_-wWuA&s', desc: 'Tênis clássico, confortável e estiloso.' },
  { nome: 'Crocs McQueen', img: 'https://lksneakers.com.br/cdn/shop/products/crocs-classic-clog-x-the-cars-lightning-mcqueen-vermelho-256864_grande.jpg?v=1710449489', desc: 'Crocs do Relâmpago McQueen para fãs de velocidade.' },
  { nome: 'Nike Air Force 1', img: 'https://authenticfeet.vtexassets.com/arquivos/ids/405920-800-800?v=638435132117770000&width=800&height=800&aspect=true', desc: 'O clássico Air Force 1, referência mundial.' },
  { nome: 'Adidas Samba', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgYaU1OvQQ0dhJVipKaG0bh3zPaYXrDE0Hug&s', desc: 'Modelo icônico da Adidas, versátil e moderno.' },
  { nome: 'Vans Old Skool', img: 'https://secure-static.vans.com.br/medias/sys_master/vans/vans/h33/h52/h00/h00/12861051797534/Midres-Vans-V1002002130020-02.jpg', desc: 'O clássico dos skatistas, estilo e resistência.' },
  { nome: 'Puma Suede', img: 'https://artwalk.vtexassets.com/arquivos/ids/239923/Tenis-Puma-Suede-Classic-XXI-Preto.jpg?v=637695546092070000', desc: 'Design retrô, conforto e personalidade.' },
  { nome: 'New Balance 550', img: 'https://lojavirus.fbitsstatic.net/img/p/tenis-new-balance-550-white-black-bb550esi-75612/317505.jpg?w=1200&h=1200&v=no-value', desc: 'New Balance 550, tendência urbana.' }
];

// Usuários simulados
const usuarios = [
  { user: 'admin', pass: 'admin123', tipo: 'admin' },
  { user: 'cliente', pass: 'cliente123', tipo: 'cliente' }
];

function renderProdutos() {
  const lista = document.getElementById('product-list');
  lista.innerHTML = '';
  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `<img src="${prod.img}" alt="${prod.nome}"><h4>${prod.nome}</h4><p class='product-desc'>${prod.desc || ''}</p>`;
    lista.appendChild(div);
  });
  renderAdminProdutos();
}

function renderAdminProdutos() {
  const table = document.getElementById('admin-product-table');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  produtos.forEach((prod, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${prod.nome}</td>
      <td><img src="${prod.img}" alt="${prod.nome}"></td>
      <td>${prod.desc || ''}</td>
      <td></td>
    `;
    if (window.userTipo === 'admin' && window.adminEditMode) {
      const tdActions = tr.querySelector('td:last-child');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'nav-btn';
      editBtn.onclick = () => openEditModal(idx);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remover';
      removeBtn.className = 'nav-btn';
      removeBtn.onclick = () => {
        produtos.splice(idx, 1);
        renderProdutos();
      };

      tdActions.appendChild(editBtn);
      tdActions.appendChild(removeBtn);
    }
    tbody.appendChild(tr);
  });
}

// modo de edição no admin: quando ativado mostra os botões editar/remover
window.adminEditMode = false;
function toggleEditMode(value) {
  if (window.userTipo !== 'admin') return;
  window.adminEditMode = typeof value === 'boolean' ? value : !window.adminEditMode;
  const btn = document.getElementById('toggle-edit-btn');
  if (btn) btn.textContent = window.adminEditMode ? 'Sair do modo edição' : 'Editar Produtos';
  // re-renderiza para mostrar/ocultar botões
  renderAdminProdutos();
}

// Modal de edição
let editIdx = null;
function openEditModal(idx) {
  editIdx = idx;
  document.getElementById('edit-product-name').value = produtos[idx].nome;
  document.getElementById('edit-product-img').value = produtos[idx].img;
  document.getElementById('edit-product-desc').value = produtos[idx].desc || '';
  document.getElementById('edit-product-modal').style.display = 'block';
}
function closeEditModal() {
  document.getElementById('edit-product-modal').style.display = 'none';
  editIdx = null;
}
document.getElementById('edit-product-form').onsubmit = function(e) {
  e.preventDefault();
  if (editIdx !== null) {
    produtos[editIdx].nome = document.getElementById('edit-product-name').value;
    produtos[editIdx].img = document.getElementById('edit-product-img').value;
    produtos[editIdx].desc = document.getElementById('edit-product-desc').value;
    renderProdutos();
    closeEditModal();
  }
};

function showSection(id) {
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('login-area').classList.remove('active');
  document.getElementById('admin-panel').classList.remove('active');
  const adminUsers = document.getElementById('admin-users');
  if (adminUsers) adminUsers.classList.remove('active');
  if (id === 'main-content') {
    document.getElementById('main-content').style.display = 'block';
  } else if (id === 'login-area') {
    document.getElementById('login-area').classList.add('active');
  } else if (id === 'admin-panel') {
    document.getElementById('admin-panel').classList.add('active');
    // por padrão, não mostrar botões de edição até o admin ativar o modo
    // se o usuário já for admin e quiser editar, ele clicará em 'Editar Produtos'
    renderAdminProdutos();
  } else if (id === 'admin-users') {
    if (adminUsers) {
      adminUsers.classList.add('active');
      renderAdminUsers();
    }
  }
}
// Renderiza lista de usuários na tela de admin-users
function renderAdminUsers() {
  const ul = document.getElementById('admin-user-list');
  if (!ul) return;
  ul.innerHTML = '';
  usuarios.forEach((u, idx) => {
    const li = document.createElement('li');
    li.textContent = `${u.user} (${u.tipo})`;
    ul.appendChild(li);
  });
}

function logout() {
  window.userTipo = null;
  document.getElementById('admin-link').style.display = 'none';
  document.getElementById('logout-link').style.display = 'none';
  // desligar modo edição ao sair
  toggleEditMode(false);
  showSection('main-content');
}

document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;
  const found = usuarios.find(u => u.user === user && u.pass === pass);
  if (found) {
    window.userTipo = found.tipo;
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('login-area').classList.remove('active');
    if (found.tipo === 'admin') {
      document.getElementById('admin-link').style.display = 'inline';
      document.getElementById('logout-link').style.display = 'inline';
      // garantir que o modo de edição esteja desligado ao entrar
      toggleEditMode(false);
      showSection('admin-panel');
    } else {
      document.getElementById('admin-link').style.display = 'none';
      document.getElementById('logout-link').style.display = 'inline';
      showSection('main-content');
    }
  } else {
    document.getElementById('login-error').textContent = 'Usuário ou senha inválidos!';
    document.getElementById('login-error').style.display = 'block';
  }
};

document.getElementById('add-product-form').onsubmit = function(e) {
  e.preventDefault();
  const nome = document.getElementById('new-product-name').value;
  const img = document.getElementById('new-product-img').value;
  const desc = document.getElementById('new-product-desc').value;
  if (nome && img) {
    produtos.push({ nome, img, desc });
    renderProdutos();
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-img').value = '';
    document.getElementById('new-product-desc').value = '';
  }
};

// Inicialização
window.adminEditMode = false;
const toggleBtn = document.getElementById('toggle-edit-btn');
if (toggleBtn) toggleBtn.textContent = 'Editar Produtos';
showSection('main-content');
renderProdutos();
