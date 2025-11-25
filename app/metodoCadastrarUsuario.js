
const mascaras = {
  cpf: (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  telefone: (v) => v.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2'),
  cep: (v) => v.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
};

const aplicarMascara = (id, fn) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', e => e.target.value = fn(e.target.value));
};

aplicarMascara('cpf', mascaras.cpf);
aplicarMascara('telefone', mascaras.telefone);
aplicarMascara('cep', mascaras.cep);

// --- VALIDAÇÃO CPF ---
const validarCPF = (cpf) => {
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11 || /^(\d)\1{10}$/.test(nums)) return false;
  const calc = (seq) => {
    const sum = seq.split('').reduce((acc, n, i) => acc + parseInt(n) * (seq.length + 1 - i), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc(nums.slice(0, 9)) === parseInt(nums[9]) && calc(nums.slice(0, 10)) === parseInt(nums[10]);
};


const campoCep = document.getElementById('cep');
if (campoCep) {
  campoCep.addEventListener('focusout', async () => {
    const cep = campoCep.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) { alert("CEP inválido!"); return; }

        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('localidade').value = data.localidade;
        document.getElementById('uf').value = data.uf;
        document.getElementById('numero').focus();
      } catch (e) { console.error(e); }
    }
  });
}


const formUsuario = document.getElementById('form-usuario');

formUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idEdicao = document.getElementById('id-edicao-usuario').value;

  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();


  const dadosEndereco = {
    cep: document.getElementById('cep').value,
    logradouro: document.getElementById('logradouro').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('localidade').value,
    uf: document.getElementById('uf').value
  };

  // Validações
  if (nome.length < 8 || nome.split(' ').length < 2) { alert("Nome completo obrigatório."); return; }
  if (!validarCPF(cpf)) { alert("CPF inválido."); return; }
  if (telefone.replace(/\D/g, '').length < 10) { alert("Telefone incompleto."); return; }
  if (!dadosEndereco.logradouro || !dadosEndereco.numero) { alert("Endereço incompleto."); return; }

  const cpfLimpo = cpf.replace(/\D/g, '');

  const cpfJaExiste = dadosDoSistema.usuarios.some(u => {
    const cpfUsuarioLimpo = (u.cpf || '').replace(/\D/g, '');
    if (idEdicao && u.id == idEdicao) return false;
    return cpfUsuarioLimpo === cpfLimpo;
  });

  if (cpfJaExiste) {
    alert("⚠️ Este CPF já pertence a outro aventureiro!");
    return;
  }


  if (idEdicao) {
    // Modo Edição
    const index = dadosDoSistema.usuarios.findIndex(u => u.id == idEdicao);
    if (index !== -1) {
      dadosDoSistema.usuarios[index] = {
        ...dadosDoSistema.usuarios[index],
        nome,
        cpf,
        nascimento,
        telefone,
        email,
        dadosEndereco
      };
    }

    alert("Atualizado com sucesso!");

  } else {
    // Modo Novo Cadastro

    const novoUsuario = {
      id: gerarIdUnico("user_"),
      nome,
      cpf,
      nascimento,
      telefone,
      email,
      dadosEndereco,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    dadosDoSistema.usuarios.push(novoUsuario);

    alert("Cadastrado com sucesso!");
  }

  await salvarDadosNaAPI(dadosDoSistema);

  formUsuario.reset();

  document.getElementById('id-edicao-usuario').value = "";
  document.querySelector('#form-usuario button[type="submit"]').textContent = "Registrar na Guilda";

  renderizarUsuarios();

  document.querySelector('[data-target="tela-usuarios"]').click();
});