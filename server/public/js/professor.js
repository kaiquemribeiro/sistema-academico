const avatar = () => {
  const avatar = document.getElementById('foto-usuario');
  let r = (Math.random() + 1).toString(36).substring(7);
  avatar.src = `https://avatars.dicebear.com/api/avataaars/${r}.svg`;
};

avatar();

const disciplinas = () => {
  const disciplinas = document.getElementsByClassName(
    'conteudo-disciplinas'
  )[0];
  const turmas = document.getElementsByClassName('conteudo-turmas')[0];
  const horario = document.getElementsByClassName('conteudo-horario')[0];

  horario.style.display = 'none';
  turmas.style.display = 'none';
  disciplinas.style.display = 'block';
};

const horario = () => {
  const horario = document.getElementsByClassName('conteudo-horario')[0];
  const turmas = document.getElementsByClassName('conteudo-turmas')[0];
  const disciplinas = document.getElementsByClassName(
    'conteudo-disciplinas'
  )[0];

  disciplinas.style.display = 'none';
  turmas.style.display = 'none';
  horario.style.display = 'block';
};

const turmas = () => {
  const turmas = document.getElementsByClassName('conteudo-turmas')[0];
  const horario = document.getElementsByClassName('conteudo-horario')[0];
  const disciplinas = document.getElementsByClassName(
    'conteudo-disciplinas'
  )[0];

  disciplinas.style.display = 'none';
  horario.style.display = 'none';
  turmas.style.display = 'block';
};

const url = new URL(window.location.href);
const teacherId = url.searchParams.get('id');

fetch(`/./auth/fetch_user/${teacherId}`)
  .then((res) => res.json())
  .then((json) => {
    renderInfo(json);
  });

function renderInfo(params = {}) {
  const { name, ra, subjectList } = params.user;
  console.log(params.user);

  document.querySelector('.title-name').innerText = name.split(' ')[0];

  document.querySelector('.nome .value').innerText = name;
  document.querySelector('.registro .value').innerText = ra;
  preencherDisciplinas();

  function preencherDisciplinas() {
    const conteudoDisciplinas = document.querySelector('.conteudo-disciplinas .lista');
    let i = 1;
    for (subject of subjectList) {
      conteudoDisciplinas.innerHTML += `<h2>${i++} - ${subject.name}</h2>`;
    }
  }
}
