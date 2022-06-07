const avatar = () => {
  const avatar = document.getElementById('foto-usuario');
  let r = (Math.random() + 1).toString(36).substring(7);
  avatar.src = `https://avatars.dicebear.com/api/avataaars/${r}.svg`;
};

avatar();

const matricula = () => {
  const matricula = document.getElementsByClassName('conteudo-matricula')[0];
  const horario = document.getElementsByClassName('conteudo-horario')[0];
  const boletim = document.getElementsByClassName('conteudo-boletim')[0];

  horario.style.display = 'none';
  boletim.style.display = 'none';
  matricula.style.display = 'block';
};

const horario = () => {
  const horario = document.getElementsByClassName('conteudo-horario')[0];
  const matricula = document.getElementsByClassName('conteudo-matricula')[0];
  const boletim = document.getElementsByClassName('conteudo-boletim')[0];

  boletim.style.display = 'none';
  matricula.style.display = 'none';
  horario.style.display = 'block';
};

const boletim = () => {
  const boletim = document.getElementsByClassName('conteudo-boletim')[0];
  const matricula = document.getElementsByClassName('conteudo-matricula')[0];
  const horario = document.getElementsByClassName('conteudo-horario')[0];

  horario.style.display = 'none';
  matricula.style.display = 'none';
  boletim.style.display = 'block';
};

const url = new URL(window.location.href);
const nomeValor = url.searchParams.get('nome');
const nome = document.querySelector('.nome');
nome.innerText = `Nome: ${nomeValor} `;
