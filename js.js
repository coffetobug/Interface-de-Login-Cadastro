document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
              ANIMAÇÃO ENTRE FORMULÁRIOS & MOSTRAR|OCULTAR SENHA
     ========================================================================== */
  const formsWrapper = document.getElementById('formsWrapper');
  const btnIrParaCadastro = document.getElementById('btnIrParaCadastro');
  const btnIrParaLogin = document.getElementById('btnIrParaLogin');
  const btnToggleSenha = document.getElementById('btnToggleSenha');
  const inputLoginSenha = document.getElementById('login-senha');
  const iconeOlho = document.getElementById('iconeOlho');

  // Transição de tela
  if (btnIrParaCadastro) {
    btnIrParaCadastro.addEventListener('click', () => {
      limparErros();
      formsWrapper.classList.add('modo-cadastro');
    });
  }

  if (btnIrParaLogin) {
    btnIrParaLogin.addEventListener('click', () => {
      limparErros();
      formsWrapper.classList.remove('modo-cadastro');
    });
  }

  // Alternar visibilidade da senha no Login
  if (btnToggleSenha && inputLoginSenha && iconeOlho) {
    btnToggleSenha.addEventListener('click', () => {
      const ePassword = inputLoginSenha.getAttribute('type') === 'password';
      inputLoginSenha.setAttribute('type', ePassword ? 'text' : 'password');
      
      iconeOlho.classList.toggle('fa-eye', !ePassword);
      iconeOlho.classList.toggle('fa-eye-slash', ePassword);
    });
  }


  /* ==========================================================================
                              VALIDAÇÃO E MENSAGENS
     ========================================================================== */
  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function mostrarErro(idSpan, mensagem) {
    const el = document.getElementById(idSpan);
    if (el) {
      el.textContent = mensagem;
      el.style.display = 'block';
    }
  }

  function limparErros() {
    const mensagensErro = document.querySelectorAll('.mensagem-erro');
    mensagensErro.forEach(msg => {
      msg.textContent = '';
    });

    const statusLogin = document.getElementById('mensagemStatus');
    const statusCad = document.getElementById('mensagem-sucesso');
    if (statusLogin) statusLogin.style.display = 'none';
    if (statusCad) statusCad.style.display = 'none';
  }

  function obterUsuariosBanco() {
    return JSON.parse(localStorage.getItem('arcane_usuarios') || '[]');
  }

  function salvarUsuariosBanco(usuarios) {
    localStorage.setItem('arcane_usuarios', JSON.stringify(usuarios));
  }


  /* ==========================================================================
                                  CADASTRO
     ========================================================================== */
  const cadastroForm = document.getElementById('cadastro_Form');

  if (cadastroForm) {
    cadastroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      limparErros();

      const nome = document.getElementById('cad-nome').value.trim();
      const sobrenome = document.getElementById('cad-sobrenome').value.trim();
      const email = document.getElementById('cad-email').value.trim();
      const senha = document.getElementById('cad-senha').value;
      const msgSucesso = document.getElementById('mensagem-sucesso');

      let temErro = false;

      // Validações
      if (!nome) {
        mostrarErro('erro-cad-nome', 'Informe seu nome.');
        temErro = true;
      }
      if (!sobrenome) {
        mostrarErro('erro-cad-sobrenome', 'Informe seu sobrenome.');
        temErro = true;
      }
      if (!email || !validarEmail(email)) {
        mostrarErro('erro-cad-email', 'Insira um e-mail válido.');
        temErro = true;
      }
      if (!senha || senha.length < 8) {
        mostrarErro('erro-cad-senha', 'A senha deve ter pelo menos 8 caracteres.');
        temErro = true;
      }

      if (temErro) return;

      
      const usuarios = obterUsuariosBanco();
      const jaExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (jaExiste) {
        mostrarErro('erro-cad-email', 'Este e-mail já está cadastrado.');
        return;
      }

      // Salvar novo usuário
      usuarios.push({ nome, sobrenome, email, senha });
      salvarUsuariosBanco(usuarios);

    
      if (msgSucesso) {
        msgSucesso.textContent = 'Conta criada com sucesso! Redirecionando...';
        msgSucesso.style.display = 'block';
      }

      cadastroForm.reset();

     
      setTimeout(() => {
        formsWrapper.classList.remove('modo-cadastro');
        limparErros();
      }, 1500);
    });
  }


  /* ==========================================================================
                             LÓGICA DE LOGIN
     ========================================================================== */
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      limparErros();

      const nome = document.getElementById('login-nome').value.trim();
      const sobrenome = document.getElementById('login-sobrenome').value.trim();
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
      const msgStatus = document.getElementById('mensagemStatus');

      let temErro = false;

      if (!nome) {
        mostrarErro('erro-login-nome', 'Informe seu nome.');
        temErro = true;
      }
      if (!sobrenome) {
        mostrarErro('erro-login-sobrenome', 'Informe seu sobrenome.');
        temErro = true;
      }
      if (!email || !validarEmail(email)) {
        mostrarErro('erro-login-email', 'E-mail inválido.');
        temErro = true;
      }
      if (!senha) {
        mostrarErro('erro-login-senha', 'Digite sua senha.');
        temErro = true;
      }

      if (temErro) return;

      const usuarios = obterUsuariosBanco();
      const usuarioValido = usuarios.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.senha === senha &&
        u.nome.toLowerCase() === nome.toLowerCase()
      );

      if (usuarioValido) {
        msgStatus.className = 'mensagem-status sucesso';
        msgStatus.textContent = `Bem-vindo(a), ${usuarioValido.nome}! Login realizado.`;
        msgStatus.style.display = 'block';

        
        sessionStorage.setItem('usuario_logado', JSON.stringify(usuarioValido));

       
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);

      } else {
        msgStatus.className = 'mensagem-status';
        msgStatus.style.backgroundColor = '#ef4444';
        msgStatus.style.color = '#ffffff';
        msgStatus.textContent = 'Dados incorretos ou conta inexistente.';
        msgStatus.style.display = 'block';
      }
    });
  }


  /* ==========================================================================
                              RECUPERAÇÃO DE SENHA
     ========================================================================== */
  const btnEsqueceuSenha = document.querySelector('.esqueceu-senha');

  if (btnEsqueceuSenha) {
    btnEsqueceuSenha.addEventListener('click', (e) => {
      e.preventDefault();

      const emailPrompt = prompt('Digite o e-mail cadastrado para redefinir sua senha:');

      if (emailPrompt === null) return; 

      const emailLimpo = emailPrompt.trim();

      if (!emailLimpo || !validarEmail(emailLimpo)) {
        alert('Por favor, informe um endereço de e-mail válido.');
        return;
      }

      const usuarios = obterUsuariosBanco();
      const usuarioExiste = usuarios.some(u => u.email.toLowerCase() === emailLimpo.toLowerCase());

      if (usuarioExiste) {
        alert(`Instruções de redefinição enviadas para o e-mail: ${emailLimpo}`);
      } else {
        alert('Este e-mail não consta em nossa base de dados.');
      }
    });
  }

});




document.addEventListener("DOMContentLoaded", function () {
  const btnTopo = document.getElementById("botaoTopo");

  if (btnTopo) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        btnTopo.classList.add("visivel");
      } else {
        btnTopo.classList.remove("visivel");
      }
    });

    
    btnTopo.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});

document.querySelectorAll('.faixa-trilho').forEach(trilho => {
  const original = trilho.querySelector('.text_produtos');
  const clone = original.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true'); 
  trilho.appendChild(clone);
});

/* ==========================================================================
            ANIMAÇÕES & TRILHO RESPONSIVO (DESATIVADO EM CELULARES)
     ========================================================================== */
  
  // Função para checar se o dispositivo é mobile/tablet
  function ehDispositivoMovel() {
    return window.innerWidth <= 768 || window.matchMedia("(max-width: 768px)").matches;
  }

  // Aplica classe no body para controle no CSS
  function aplicarModoDispositivo() {
    if (ehDispositivoMovel()) {
      document.body.classList.add('dispositivo-movel');
      document.body.classList.remove('dispositivo-desktop');
    } else {
      document.body.classList.add('dispositivo-desktop');
      document.body.classList.remove('dispositivo-movel');
    }
  }

  aplicarModoDispositivo();
  window.addEventListener('resize', aplicarModoDispositivo);

  // Só clona os produtos para animação contínua em telas grandes (Desktop)
  if (!ehDispositivoMovel()) {
    document.querySelectorAll('.faixa-trilho').forEach(trilho => {
      const original = trilho.querySelector('.text_produtos');
      if (original && !trilho.querySelector('[aria-hidden="true"]')) {
        const clone = original.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        trilho.appendChild(clone);
      }
    });
  }


/*------------------------------------------------------------------------------------------------------------------------------------*/

