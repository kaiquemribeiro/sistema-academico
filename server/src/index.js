const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers')(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  // res.send("Servidor online");
  res.redirect('./auth/authenticate');
});

app.get('/auth/authenticate', (req, res) => {
  // res.send("Servidor online");
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/aluno', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/aluno.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/admin.html'));
});

app.get('/professor', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/professor.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Press Ctrl + C to stop');
});
