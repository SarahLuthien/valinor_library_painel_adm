
const formLivro = document.getElementById('form-livro');

formLivro.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idEdicao = document.getElementById('id-edicao').value;
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const ano = document.getElementById('ano').value;
  const imagem = document.getElementById('imagem').value;
  const genero = document.getElementById('genero').value;

  if (idEdicao) {
    // Modo Edição
    const index = dadosDoSistema.livros.findIndex(l => l.id == idEdicao);

    if (index !== -1) {
      dadosDoSistema.livros[index].titulo = titulo;
      dadosDoSistema.livros[index].autor = autor;
      dadosDoSistema.livros[index].ano = ano;
      dadosDoSistema.livros[index].imagem = imagem;
      dadosDoSistema.livros[index].categoria = genero;
    }
    alert("Obra atualizada com sucesso! ✨");

  } else {
    // Modo Novo Cadastro

    const novoLivro = {
      id: gerarIdUnico("livro_"),
      titulo,
      autor,
      ano,
      imagem,
      categoria: genero,
      disponivel: true
    };

    dadosDoSistema.livros.push(novoLivro);
    alert("Livro adicionado com sucesso ao acervo de Valinor! ✨");
  }


  await salvarDadosNaAPI(dadosDoSistema);

  formLivro.reset();

  document.getElementById('id-edicao').value = "";
  document.querySelector('#form-livro button[type="submit"]').textContent = "Salvar no Acervo";

  renderizarLivros();

  document.querySelector('[data-target="tela-livros"]').click();
});