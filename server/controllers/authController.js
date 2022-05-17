const express = require('express');

const Student = require('../models/student');

const router = express.Router();

console.log('authController funcionando');

router.post('./register', async (req, res) => {
  res.send('Rota de registro');
  console.log('tentando registrar..');
  // try {
  //   const student = await Student.create(req.body);

  //   return res.send({ student });
  // } catch (err) {
  //   console.warn(err);

  //   return res.status(400).send({ error: 'Erro ao tentar registrar.' });
  // }
});

module.exports = (app) => app.use('/auth', router);
