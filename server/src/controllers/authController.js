const express = require('express');
const Student = require('../models/student');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await Student.findOne(email));

    const student = await Student.create(req.body);

    student.password = undefined;
    return res.send({ student });
  } catch (err) {
    console.warn(err);

    return res.status(400).send({ error: 'Erro ao tentar registrar.' });
  }
});

module.exports = (app) => app.use('/auth', router);
