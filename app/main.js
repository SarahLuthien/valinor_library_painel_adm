let dadosDoSistema = { livros: [], usuarios: [], emprestimos: [] };

// --- NAVEGAÇÃO ---
const botoesNav = document.querySelectorAll('.nav-link, [data-target]');
const telas = document.querySelectorAll('.tela');

botoesNav.forEach(botao => {
  botao.addEventListener('click', (e) => {
    const targetId = botao.getAttribute('data-target');


    telas.forEach(tela => tela.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));


    const telaSelecionada = document.getElementById(targetId);
    if (telaSelecionada) {
      telaSelecionada.classList.remove('hidden');
      telaSelecionada.classList.add('fade-in');
    }

    if (botao.classList.contains('nav-link')) {
      botao.classList.add('active');
    }


    if (targetId === 'tela-emprestimos') {
      if (typeof exibirListaDeEmprestimos === 'function') exibirListaDeEmprestimos();
    }
    if (targetId === 'tela-novo-emprestimo') {
      if (typeof atualizarOpcoesDeEmprestimo === 'function') atualizarOpcoesDeEmprestimo();
    }
  });
});

// --- RENDERIZAÇÃO (UI) ---

function renderizarLivros() {
  const container = document.getElementById('lista-livros');
  container.innerHTML = '';

  dadosDoSistema.livros.forEach(livro => {
    const statusBadge = livro.disponivel
      ? '<span class="badge badge-disponivel">Disponível</span>'
      : '<span class="badge badge-emprestado">Emprestado</span>';

    const imagem = livro.imagem || 'https://via.placeholder.com/200x300?text=Capa+Valinor';

    container.innerHTML += `
            <div class="card-livro">
                <img src="${imagem}" alt="${livro.titulo}" class="livro-capa">
                <h3 class="livro-titulo">${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Gênero:</strong> ${livro.categoria || 'Geral'}</p>
                ${statusBadge}
            </div>
        `;
  });
}

function renderizarUsuarios() {
  const container = document.getElementById('lista-usuarios');
  container.innerHTML = '';

  dadosDoSistema.usuarios.forEach(user => {
    container.innerHTML += `
            <div class="card-usuario">
                <h3 class="livro-titulo">${user.nome}</h3>
                <p>📧 ${user.email}</p>
                <p>🛡️ Membro desde: ${user.dataCadastro || 'Desconhecido'}</p>
            </div>
        `;
  });
}

// --- INICIALIZAÇÃO ---
async function iniciarSistema() {
  console.log("Conectando a Valinor..."); // realizando teste lembnrar de apagar!!
  dadosDoSistema = await buscarDadosDaAPI();

  renderizarLivros();
  renderizarUsuarios();
}

iniciarSistema();