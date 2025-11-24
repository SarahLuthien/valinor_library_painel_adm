
function atualizarOpcoesDeEmprestimo() {
  const selectUsuario = document.getElementById('select-usuario');
  const selectLivro = document.getElementById('select-livro');

  selectUsuario.innerHTML = '<option value="">Selecione um Aventureiro...</option>';
  selectLivro.innerHTML = '<option value="">Selecione um Livro Disponível...</option>';

  const listaUsuarios = [...dadosDoSistema.usuarios].sort((a, b) => a.nome.localeCompare(b.nome));

  listaUsuarios.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.nome;
    selectUsuario.appendChild(option);
  });

  const livrosDisponiveis = dadosDoSistema.livros
    .filter(livro => livro.disponivel === true)
    .sort((a, b) => a.titulo.localeCompare(b.titulo));

  if (livrosDisponiveis.length === 0) {
    const option = document.createElement('option');
    option.textContent = "--- Nenhum livro disponível no momento ---";
    selectLivro.appendChild(option);
  } else {
    livrosDisponiveis.forEach(livro => {
      const option = document.createElement('option');
      option.value = livro.id;
      option.textContent = livro.titulo;
      selectLivro.appendChild(option);
    });
  }
}

// Exibição
function exibirListaDeEmprestimos() {
  const corpoTabela = document.getElementById('tabela-corpo-emprestimos');
  const msgVazia = document.getElementById('msg-emprestimos-vazio');

  corpoTabela.innerHTML = '';
  const listaOrdenada = [...dadosDoSistema.emprestimos].sort((a, b) => {

    if (a.status === 'ativo' && b.status !== 'ativo') return -1;
    if (a.status !== 'ativo' && b.status === 'ativo') return 1;


    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;
    return 0;
  });

  if (!listaOrdenada || listaOrdenada.length === 0) {
    msgVazia.style.display = 'block';
    return;
  }
  msgVazia.style.display = 'none';

  listaOrdenada.forEach(emp => {

    const livro = dadosDoSistema.livros.find(l => l.id == emp.livroId);
    const usuario = dadosDoSistema.usuarios.find(u => u.id == emp.usuarioId);

    const tituloLivro = livro ? livro.titulo : '<span style="color:red">Livro Removido</span>';
    const nomeUsuario = usuario ? usuario.nome : '<span style="color:red">Usuário Removido</span>';

    const dataSaida = emp.dataEmprestimo || '-';
    const dataVolta = emp.dataDevolucao || '-';

    let statusBadge, btnAcao;

    if (emp.status === 'ativo') {
      statusBadge = `<span class="badge badge-emprestado">Em Andamento</span>`;
      btnAcao = `<button onclick="realizarDevolucao('${emp.id}')" class="btn-icon" title="Realizar Devolução"><i data-feather="check-circle"></i></button>`;
    } else {
      statusBadge = `<span class="badge badge-disponivel">Concluída</span>`;
      btnAcao = `<span style="color: green; font-size: 1.2rem;">✔</span>`;
    }

    corpoTabela.innerHTML += `
            <tr>
                <td><strong>${tituloLivro}</strong></td>
                <td>${nomeUsuario}</td>
                <td>${dataSaida}</td> 
                <td>${dataVolta}</td> 
                <td>${statusBadge}</td>
                <td style="text-align:center;">${btnAcao}</td>
            </tr>
        `;
  });

  if (window.feather) {
    feather.replace();
  }
}

// Registrar
const formEmprestimo = document.getElementById('form-emprestimo');

formEmprestimo.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuarioId = document.getElementById('select-usuario').value;
  const livroId = document.getElementById('select-livro').value;

  if (!usuarioId || !livroId) {
    alert("Selecione um aventureiro e um livro!");
    return;
  }

  // Atualiza status do Livro
  const indexLivro = dadosDoSistema.livros.findIndex(l => l.id == livroId);
  if (indexLivro !== -1) {
    dadosDoSistema.livros[indexLivro].disponivel = false;
  }


  const novoEmprestimo = {
    id: "emp_" + Date.now(),
    usuarioId,
    livroId,
    dataEmprestimo: new Date().toLocaleDateString('pt-BR'),
    dataDevolucao: null,
    status: 'ativo'
  };

  if (!dadosDoSistema.emprestimos) dadosDoSistema.emprestimos = [];
  dadosDoSistema.emprestimos.push(novoEmprestimo);

  await salvarDadosNaAPI(dadosDoSistema);

  alert("Missão iniciada! O livro foi emprestado com sucesso. 📖");
  formEmprestimo.reset();


  if (typeof renderizarLivros === 'function') renderizarLivros();
  exibirListaDeEmprestimos();
  document.querySelector('[data-target="tela-emprestimos"]').click();
});

// Devolução
window.realizarDevolucao = async function (idEmprestimo) {
  if (!confirm("Confirmar o retorno deste livro ao acervo?")) return;

  // Acha o empréstimo
  const indexEmp = dadosDoSistema.emprestimos.findIndex(e => e.id == idEmprestimo);
  if (indexEmp === -1) return;

  const emprestimo = dadosDoSistema.emprestimos[indexEmp];

  // Atualiza o Empréstimo
  emprestimo.status = 'devolvido';
  emprestimo.dataDevolucao = new Date().toLocaleDateString('pt-BR');

  // Liibera o livro
  const indexLivro = dadosDoSistema.livros.findIndex(l => l.id == emprestimo.livroId);
  if (indexLivro !== -1) {
    dadosDoSistema.livros[indexLivro].disponivel = true;
  }


  await salvarDadosNaAPI(dadosDoSistema);

  if (typeof renderizarLivros === 'function') renderizarLivros();
  exibirListaDeEmprestimos();
  alert("Livro devolvido ao Grimório! ✨");
};