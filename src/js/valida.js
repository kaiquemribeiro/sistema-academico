const validaUsuario = () => {
    const usuario = document.getElementById('usuario').value;
    if(usuario.includes('1', 1)){
        alert('Usuario valido admin');
        return 1;
    } else if(usuario.includes('2', 1)){
        alert('Usuario valido docente');
        return 2;
    } else {
        alert('Usuario invalido');
    }
}