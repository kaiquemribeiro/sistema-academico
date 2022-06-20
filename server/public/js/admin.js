const url = new URL(window.location.href);
const token = url.searchParams.get('token');
const adminId = url.searchParams.get('id');

const nameElement = document.querySelector('.nome .valor');

fetch(`/./auth/fetch_user/${adminId}`)
  .then((res) => res.json())
  .then((json) => {
    renderInfo(json);
  });

function renderInfo(params = {}) {
  const { name } = params.user;
  nameElement.innerText = name;
}

const forms = document.querySelectorAll('form');

// forms.forEach((form) => {
//   form.addEventListener('submit', (event) => {
//     event.preventDefault();
//   });
// });
