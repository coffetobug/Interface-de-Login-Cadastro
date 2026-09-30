document.addEventListener('DOMContentLoaded', () => {
  const formsWrapper = document.getElementById('formsWrapper');
  const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
  const btnIrParaLogin = document.getElementById('btnIrParaLogin');

  // Transiciona para o formulário de Cadastro (sobe)
  if (btnIrParaCadastro) {
    btnIrParaCadastro.addEventListener('click', () => {
      formsWrapper.classList.add('modo-cadastro');
    });
  }

  // Volta para o formulário de Login (desce)
  if (btnIrParaLogin) {
    btnIrParaLogin.addEventListener('click', () => {
      formsWrapper.classList.remove('modo-cadastro');
    });
  }
});