document.getElementById("btn").addEventListener("click", function (event) {
  event.preventDefault();
});

const validaUsuario = () => {
  const usuario = document.getElementById("usuario").value;
  if (usuario.includes("1", 1)) {
    alert("Usuario valido admin");
  } else if (usuario.includes("2", 1)) {
    window.location.href = "./aluno.html";
  } else if (usuario.includes("3", 1)) {
    window.location.href = "./professor.html";
  } else {
    alert("Usuario invalido");
  }
};
