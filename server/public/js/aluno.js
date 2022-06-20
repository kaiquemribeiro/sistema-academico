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
  matricula.style.display = 'flex';
};

const horario = () => {
  const horario = document.getElementsByClassName('conteudo-horario')[0];
  const matricula = document.getElementsByClassName('conteudo-matricula')[0];
  const boletim = document.getElementsByClassName('conteudo-boletim')[0];

  boletim.style.display = 'none';
  matricula.style.display = 'none';
  horario.style.display = 'flex';
};

const boletim = () => {
  const boletim = document.getElementsByClassName('conteudo-boletim')[0];
  const matricula = document.getElementsByClassName('conteudo-matricula')[0];
  const horario = document.getElementsByClassName('conteudo-horario')[0];

  horario.style.display = 'none';
  matricula.style.display = 'none';
  boletim.style.display = 'flex';
};

const url = new URL(window.location.href);
const studentId = url.searchParams.get('id');
const nameElement = document.querySelector('.nome-value');

fetch(`/./auth/fetch_user/${studentId}`)
  .then((res) => res.json())
  .then((json) => {
    renderInfo(json);
  });

function renderInfo(params = {}) {
  const { name, ra, subjectList, timetable, course, periodo, turno } =
    params.user;
  console.log(params.user);
  const raInput = document.getElementById('input-ra');
  const nomeTitulo = document.getElementById('nome-titulo');
  nomeTitulo.innerText = name.split(' ')[0];
  const tabela = document.querySelector('.tabela tbody');

  document.querySelector('.curso-value').innerText = course.name;
  document.querySelector('.matricula-value').innerText = ra;
  document.querySelector('.periodo-value').innerText = periodo;
  document.querySelector('.turno-value').innerText = turno;

  raInput.value = ra;
  nameElement.innerText = name;
  preencherTabela();
  preencherNotas();
  preencherHorario();
  function preencherTabela() {
    subjectList.forEach((subject) => {
      console.log(subject);
      const row = document.createElement('tr');
      const tdId = document.createElement('td');
      tdId.innerText = subject.id;
      const tdName = document.createElement('td');
      tdName.innerText = subject.name;
      const tdCancelar = document.createElement('td');
      const linkCancelar = document.createElement('a');
      linkCancelar.innerHTML = `<a href="/auth/subject/cancel?student=${ra}&subject=${subject.id}">Cancelar</a>`;
      tdCancelar.appendChild(linkCancelar);
      row.appendChild(tdId);
      row.appendChild(tdName);
      row.appendChild(tdCancelar);
      tabela.appendChild(row);
    });
  }
  function preencherNotas() {
    const tabelaNotas = document.getElementById('tabela-notas');

    const { reportcard } = params.user;
    for (row of reportcard) {
      tabelaNotas.innerHTML += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
    }
  }
  function preencherHorario() {
    const horario = {
      0: 'Manhã',
      1: 'Tarde',
      2: 'Noite',
    };

    const tbhorarioElemento = document.getElementById('tabela-horario');
    for (let i = 0; i < 3; i++) {
      let templateTr = `<tr>`;
      templateTr += `<th>${horario[i]}</th>`;
      for (let j = 0; j < 5; j++) {
        templateTr += `<td>${timetable[j][i]}</td>`;
      }
      templateTr += '</tr>';
      tbhorarioElemento.innerHTML += templateTr;
    }
  }
}
