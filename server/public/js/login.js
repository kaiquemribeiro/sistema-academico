const url_string = window.location.href;
const url = new URL(url_string);
const not_found = url.searchParams.get('not_found');
const wrong_pass = url.searchParams.get('wrong_pass');

const error_email = document.querySelector('.not-found');
const error_pass = document.querySelector('.wrong-pass');

if (not_found) error_email.classList.add('active');

if (wrong_pass) error_pass.classList.add('active');
