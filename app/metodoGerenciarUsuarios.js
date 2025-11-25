
async function deletarUsuario(id) {
  if (!confirm("Tem certeza que deseja remover este aventureiro?")) return;

  const emprestimoAtivo = dadosDoSistema.emprestimos.find(e => e.usuarioId == id && e.status === 'ativo');
  if (emprestimoAtivo) {
    alert("Não é possível excluir: Usuário possui livros emprestados!");
    return;
  }

  dadosDoSistema.usuarios = dadosDoSistema.usuarios.filter(u => u.id != id);
  await salvarDadosNaAPI(dadosDoSistema);
  renderizarUsuarios();
  alert("Removido com sucesso!");
}

function editarUsuario(id) {
  const usuario = dadosDoSistema.usuarios.find(u => u.id == id);
  if (!usuario) return;


  document.getElementById('nome').value = usuario.nome;
  document.getElementById('cpf').value = usuario.cpf;
  document.getElementById('nascimento').value = usuario.nascimento;
  document.getElementById('telefone').value = usuario.telefone;
  document.getElementById('email').value = usuario.email;


  const end = usuario.dadosEndereco || {};

  document.getElementById('cep').value = end.cep || '';
  document.getElementById('logradouro').value = end.logradouro || '';
  document.getElementById('numero').value = end.numero || '';
  document.getElementById('bairro').value = end.bairro || '';
  document.getElementById('localidade').value = end.cidade || '';


  document.getElementById('id-edicao-usuario').value = id;
  const btn = document.querySelector('#form-usuario button[type="submit"]');
  btn.textContent = "Atualizar Cadastro";

  document.querySelector('[data-target="tela-cadastro-usuario"]').click();
  document.getElementById('nome').focus();
}