const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const path = require('path');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(express.static("public"));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

// server.get("/aluno", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/html/aluno.html"));
// });

// server.get("/professor", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/html/professor.html"));
// });

server.listen(3001, () => {
  console.log('Server running on port 3001');
  console.log('Press Ctrl + C to stop');
});
