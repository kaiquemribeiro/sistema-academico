const avatar = () => {
    const avatar = document.getElementById('foto-usuario');
    let r = (Math.random() + 1).toString(36).substring(7);
    avatar.src = `https://avatars.dicebear.com/api/avataaars/${r}.svg`
}

avatar();

const disciplinas = () => {
    const disciplinas = document.getElementsByClassName('conteudo-disciplinas')[0];
    const turmas = document.getElementsByClassName('conteudo-turmas')[0];
    const horario = document.getElementsByClassName('conteudo-horario')[0];
    
    horario.style.display = 'none';
    turmas.style.display = 'none';
    disciplinas.style.display = 'block';
}

const horario = () => {
    const horario = document.getElementsByClassName('conteudo-horario')[0];
    const turmas = document.getElementsByClassName('conteudo-turmas')[0];
    const disciplinas = document.getElementsByClassName('conteudo-disciplinas')[0];
    
    disciplinas.style.display = 'none';
    turmas.style.display = 'none';
    horario.style.display = 'block';
}

const turmas = () => {
    const turmas = document.getElementsByClassName('conteudo-turmas')[0];
    const horario = document.getElementsByClassName('conteudo-horario')[0];
    const disciplinas = document.getElementsByClassName('conteudo-disciplinas')[0];

    disciplinas.style.display = 'none';
    horario.style.display = 'none';
    turmas.style.display = 'block';
}