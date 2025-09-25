// Dados simulados de produtos
const produtos = [
  { nome: 'Adelungue Classic', img: 'https://images.unsplash.com/photo-1517260911205-8a3b66e655a4?auto=format&fit=crop&w=400&q=80' },
  { nome: 'Adelungue Runner', img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { nome: 'Adelungue Urban', img: 'https://images.unsplash.com/photo-1528701800484-905dffad3d04?auto=format&fit=crop&w=400&q=80' }
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
    div.innerHTML = `<img src="${prod.img}" alt="${prod.nome}"><h4>${prod.nome}</h4>`;
    lista.appendChild(div);
  });
  renderAdminProdutos();
}

function renderAdminProdutos() {
  const ul = document.getElementById('admin-product-list');
  if (!ul) return;
  ul.innerHTML = '';
  produtos.forEach((prod, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>${prod.nome}</strong></span>`;
    if (window.userTipo === 'admin') {
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'button';
      editBtn.onclick = () => openEditModal(idx);

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remover';
      removeBtn.className = 'button';
      removeBtn.style.marginLeft = '0.5rem';
      removeBtn.onclick = () => {
        produtos.splice(idx, 1);
        renderProdutos();
      };

      li.appendChild(editBtn);
      li.appendChild(removeBtn);
    }
    ul.appendChild(li);
  });
}

// Modal de edição
let editIdx = null;
function openEditModal(idx) {
  editIdx = idx;
  document.getElementById('edit-product-name').value = produtos[idx].nome;
  document.getElementById('edit-product-img').value = produtos[idx].img;
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
  if (nome && img) {
    produtos.push({ nome, img });
    renderProdutos();
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-img').value = '';
  }
};

// Inicialização
showSection('main-content');
renderProdutos();
