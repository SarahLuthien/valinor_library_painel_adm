let dadosDoSistema = { usuarios: [], livros: [], emprestimos: [] };


function gerarIdUnico(prefix = "id_") {
  let id;
  do {
    id = prefix + Date.now() + "_" + Math.floor(Math.random() * 100000);
  } while (
    dadosDoSistema.usuarios.some(u => u.id === id) ||
    dadosDoSistema.livros.some(l => l.id === id) ||
    dadosDoSistema.emprestimos.some(e => e.id === id)
  );

  return id;
}


const botoesNav = document.querySelectorAll('.nav-link, [data-target]');
const telas = document.querySelectorAll('.tela');
const btnMobile = document.getElementById('btn-mobile');

if (btnMobile) {
  btnMobile.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
  });
}

const linksMenu = document.querySelectorAll('.nav-link');
linksMenu.forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    if (window.innerWidth < 600) {
      nav.classList.remove('active');
    }
  });
});

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


function renderizarUsuarios() {
  const corpoTabela = document.getElementById('tabela-corpo-usuarios');
  const msgVazia = document.getElementById('mensagem-vazia');

  corpoTabela.innerHTML = '';

  const usuariosOrdenados = dadosDoSistema.usuarios.sort((a, b) => {
    return a.nome.localeCompare(b.nome);
  });

  // Controle de Exibição 
  if (usuariosOrdenados.length === 0) {
    msgVazia.style.display = 'block';
    return;
  } else {
    msgVazia.style.display = 'none';
  }


  let linhasHTML = '';

  usuariosOrdenados.forEach(user => {
    const telefone = user.telefone || '-';

    // Formatação Data
    let nascFormatado = '-';
    if (user.nascimento) {
      const [ano, mes, dia] = user.nascimento.split('-');
      nascFormatado = `${dia}/${mes}/${ano}`;
    } else if (user.nascimentoBR) {
      nascFormatado = user.nascimentoBR;
    }

    // Formatação Endereço
    let enderecoLegivel = '-';
    if (user.dadosEndereco) {
      const end = user.dadosEndereco;
      enderecoLegivel = `${end.logradouro}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}`;
    } else if (user.endereco) {
      enderecoLegivel = user.endereco;
    }


    linhasHTML += `
        <tr>
            <td><span class="user-nome">${user.nome}</span></td>
            <td><span class="user-email">${user.email}</span></td>
            <td>${telefone}</td>
            <td>${nascFormatado}</td>
            <td> ${enderecoLegivel}"</td>
            <td>
                <div class="acoes">
                    <button onclick="editarUsuario('${user.id}')" class="btn-icon" title="Editar">
                    <i data-feather="edit-2"></i></button>
                    <button onclick="deletarUsuario('${user.id}')" class="btn-icon btn-perigo" title="Excluir">
                    <i data-feather="trash-2"></i></button>
                </div>
            </td>
        </tr>
    `;
  });

  corpoTabela.innerHTML = linhasHTML;


  if (window.feather) {
    feather.replace();
  }

}


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
                <div class="card-info">
                    <p><strong>Autor:</strong> ${livro.autor}</p>
                    <p><strong>Ano:</strong> ${livro.ano}</p>
                    <p><strong>Gênero:</strong> ${livro.categoria || 'Geral'}</p>
                </div>
                <div class="card-footer">
                    ${statusBadge}
                    <div class="acoes">
                        <button onclick="editarLivro('${livro.id}')" class="btn-icon" title="Editar">
                        <i data-feather="edit-2"></i></button>
                        <button onclick="deletarLivro('${livro.id}')" class="btn-icon btn-perigo" title="Excluir">
                        <i data-feather="trash-2"></i></button>
                    </div>
                </div>
            </div>
        `;
  });

  if (window.feather) {
    feather.replace();
  }

}


async function iniciarSistema() {

  dadosDoSistema = await buscarDadosDaAPI();
  renderizarUsuarios();
  renderizarLivros();
}

iniciarSistema();