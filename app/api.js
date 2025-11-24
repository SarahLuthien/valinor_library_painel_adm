
const BIN_ID = '69234644ae596e708f6c136b';
const API_KEY = '$2a$10$beIBRKyUsrWdI8pn3KCORenaAVvipvSnDbgO3RFLj5tgDOKlX5PLK';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;


async function buscarDadosDaAPI() {
  try {
    const resposta = await fetch(API_URL, {
      method: "GET",
      headers: {
        "X-Master-Key": API_KEY,
        "Accept": "application/json"
      }
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ao buscar dados: ${resposta.status} - ${resposta.statusText}`);
    }

    const dados = await resposta.json();

    if (!dados || typeof dados !== "object" || !dados.record) {
      throw new Error("Formato de resposta inválido da API.");
    }

    const record = dados.record;

    return {
      usuarios: Array.isArray(record.usuarios) ? record.usuarios : [],
      livros: Array.isArray(record.livros) ? record.livros : [],
      emprestimos: Array.isArray(record.emprestimos) ? record.emprestimos : [],
    };

  } catch (erro) {
    console.error("Erro em buscarDadosDaAPI:", erro);
    alert("Erro ao conectar com o banco de dados. Tente novamente mais tarde.");
    return { usuarios: [], livros: [], emprestimos: [] };
  }
}



async function salvarDadosNaAPI(dadosAtualizados) {
  try {
    if (
      !dadosAtualizados ||
      typeof dadosAtualizados !== "object" ||
      !Array.isArray(dadosAtualizados.usuarios) ||
      !Array.isArray(dadosAtualizados.livros) ||
      !Array.isArray(dadosAtualizados.emprestimos)
    ) {
      throw new Error("Formato inválido de dados para salvar na API.");
    }

    const resposta = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "X-Master-Key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!resposta.ok) {
      const textoErro = await resposta.text().catch(() => null);
      throw new Error(
        `Erro HTTP ao salvar dados: ${resposta.status} - ${textoErro || resposta.statusText
        }`
      );
    }

    return true;

  } catch (erro) {
    console.error("Erro em salvarDadosNaAPI:", erro);
    alert("Erro ao salvar as alterações. Tente novamente.");
    return false;
  }
}
