const BIN_ID = '69234644ae596e708f6c136b';
const API_KEY = '$2a$10$beIBRKyUsrWdI8pn3KCORenaAVvipvSnDbgO3RFLj5tgDOKlX5PLK';


const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


async function buscarDadosDaAPI() {
  try {
    const resposta = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!resposta.ok) throw new Error('Erro ao buscar dados');

    const dados = await resposta.json();
    return dados.record;

  } catch (erro) {
    console.error(erro); // testando.. lembrar de apagar!!
    alert("Erro ao conectar com o banco de dados!");
    return { usuarios: [], livros: [], emprestimos: [] };
  }
}


async function salvarDadosNaAPI(dadosAtualizados) {
  try {
    const resposta = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!resposta.ok) throw new Error('Erro ao salvar dados');
    console.log("Dados salvos com sucesso!"); // testando.. lembrar de apagar!!
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar as alterações.");
  }
}