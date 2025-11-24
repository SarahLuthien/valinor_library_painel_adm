async function deletarLivro(id) {

  if (!confirm("Tem certeza que deseja banir esta obra do Grimório?")) return;

  const livro = dadosDoSistema.livros.find(l => l.id == id);
  if (livro && !livro.disponivel) {
    alert("Não é possível excluir um livro que está emprestado!");
    return;
  }

  dadosDoSistema.livros = dadosDoSistema.livros.filter(l => l.id != id);

  await salvarDadosNaAPI(dadosDoSistema);

  renderizarLivros();
  alert("Livro removido com sucesso!");
}


function editarLivro(id) {

  const livro = dadosDoSistema.livros.find(l => l.id == id);
  if (!livro) return;

  document.getElementById('titulo').value = livro.titulo;
  document.getElementById('autor').value = livro.autor;
  document.getElementById('ano').value = livro.ano;
  document.getElementById('genero').value = livro.categoria;
  document.getElementById('imagem').value = livro.imagem;


  document.getElementById('id-edicao').value = id;

  const btnSalvar = document.querySelector('#form-livro button[type="submit"]');
  btnSalvar.textContent = "Atualizar Obra";

  document.querySelector('[data-target="tela-cadastro-livro"]').click();
}